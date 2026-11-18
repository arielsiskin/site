// ElevenLabs TTS for the LiveKit agent over the plain REST stream: one request per sentence, reading the PCM as it
// arrives. Copy of QualityIQ's Azure wrapper (quality-iq/apps/voice-agent/src/azure-tts.ts), which works in prod with
// interruptions. The official plugin (@livekit/agents-plugin-elevenlabs 1.8.1) stalls 10 s on every reply, both over
// its websocket and its HTTP path ("TTS stream stalled after producing audio"), while ElevenLabs itself answers fine.
// Not text streaming: the framework wraps it in a StreamAdapter that splits the LLM reply into sentences, and the
// first sentence plays while the next ones are generated.
import { APIConnectionError, APIStatusError, AudioByteStream, shortuuid, tokenize, tts, type APIConnectOptions } from '@livekit/agents';

const SAMPLE_RATE = 24_000;
const NUM_CHANNELS = 1;

export interface ElevenTTSOptions {
  voiceId: string;
  apiKey: string;
  /** eleven_flash_v2_5: ElevenLabs' lowest-latency model. */
  model: string;
}

export class TTS extends tts.TTS {
  label = 'elevenlabs.TTS';
  readonly opts: ElevenTTSOptions;

  constructor(opts: Partial<ElevenTTSOptions> & { voiceId: string }) {
    super(SAMPLE_RATE, NUM_CHANNELS, { streaming: false });
    const apiKey = opts.apiKey ?? process.env.ELEVEN_API_KEY;
    if (!apiKey) throw new Error('Falta la clave de ElevenLabs (ELEVEN_API_KEY)');
    this.opts = { model: 'eleven_flash_v2_5', ...opts, apiKey };
  }

  get model() { return this.opts.model; }
  get provider() { return 'ElevenLabs'; }

  synthesize(text: string, connOptions?: APIConnectOptions, abortSignal?: AbortSignal): tts.ChunkedStream {
    return new ChunkedStream(this, text, connOptions, abortSignal);
  }

  /** Sentence by sentence, as the framework does when it wraps a non-streaming TTS. */
  stream(): tts.SynthesizeStream {
    return new tts.StreamAdapter(this, new tokenize.basic.SentenceTokenizer()).stream();
  }
}

class ChunkedStream extends tts.ChunkedStream {
  label = 'elevenlabs.ChunkedStream';
  #tts: TTS;
  #text: string;

  constructor(owner: TTS, text: string, connOptions?: APIConnectOptions, abortSignal?: AbortSignal) {
    super(text, owner, connOptions, abortSignal);
    this.#tts = owner;
    this.#text = text;
  }

  protected async run() {
    const { voiceId, apiKey, model } = this.#tts.opts;
    const requestId = shortuuid();
    let res: Response;
    try {
      res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=pcm_${SAMPLE_RATE}`, {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: this.#text, model_id: model, language_code: 'es' }),
        signal: this.abortSignal,
      });
    } catch (e) {
      if (this.abortSignal.aborted) return;
      throw new APIConnectionError({ message: `ElevenLabs no responde: ${(e as Error).message}` });
    }
    if (!res.ok || !res.body) {
      // The body is the provider's error: it goes to the VM log, never to the visitor.
      throw new APIStatusError({ message: `ElevenLabs respondió ${res.status} ${await res.text().catch(() => '')}`.trim(), options: { statusCode: res.status } });
    }
    const bstream = new AudioByteStream(SAMPLE_RATE, NUM_CHANNELS);
    const put = (frames: ReturnType<AudioByteStream['write']>) => {
      for (const frame of frames) if (!this.queue.closed) this.queue.put({ requestId, segmentId: requestId, frame, final: false });
    };
    try {
      for await (const chunk of res.body) put(bstream.write(chunk as Uint8Array));
      put(bstream.flush());
    } catch (e) {
      if (!this.abortSignal.aborted) throw new APIConnectionError({ message: `Se cortó el audio de ElevenLabs: ${(e as Error).message}` });
    } finally {
      // Closing the queue is what tells the framework the sentence ended (without it: "TTS stream stalled").
      if (!this.queue.closed) this.queue.close();
    }
  }
}
