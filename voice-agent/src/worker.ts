// Maya, el voicebot de la demo del sitio: se une a la sala que abre /api/call (src/pages/api/call.ts) y atiende como
// un voicebot de contact center. Deepgram escucha, Gemini contesta y ElevenLabs pone la voz. El visitante la puede
// interrumpir hablando encima (VAD). Adaptado del worker de QualityIQ (quality-iq/apps/voice-agent/src/worker.ts).
import { fileURLToPath } from 'node:url';
import { RoomEvent } from '@livekit/rtc-node';
import { Agent, AgentSession, AgentSessionEventTypes, cli, defineAgent, inference, ServerOptions, type JobContext } from '@livekit/agents';
import { STT as DeepgramSTT } from '@livekit/agents-plugin-deepgram';
import { LLM as GoogleLLM } from '@livekit/agents-plugin-google';
import { TTS as ElevenTTS } from './eleven-tts.js';
import { VAD as SileroVAD } from '@livekit/agents-plugin-silero';

export const AGENT_NAME = 'mayday-site-demo';

/** Lo arma el sitio (el visitante solo elige el escenario): el prompt nunca viene del navegador. */
type CallConfig = { instructions: string; greeting: string; maxSeconds: number };

/** Eventos para la pantalla de la demo (src/components/VoiceDemo.tsx), por el canal de datos. */
type DemoEvent =
  | { type: 'partial'; text: string }
  | { type: 'transcript'; role: 'user' | 'bot'; text: string }
  | { type: 'closed'; reason: string };

export default defineAgent({
  prewarm: async proc => {
    proc.userData.vad = await SileroVAD.load();
  },

  entry: async (ctx: JobContext) => {
    await ctx.connect();
    const c: CallConfig = JSON.parse(ctx.job.metadata || '{}');
    if (!c.instructions) return ctx.shutdown('sin configuración');
    const send = (e: DemoEvent) =>
      ctx.room.localParticipant?.publishData(new TextEncoder().encode(JSON.stringify(e)), { reliable: true }).catch(err => console.error('[demo] evento', err));

    let ended = false;
    const end = (reason: string) => {
      if (ended) return;
      ended = true;
      send({ type: 'closed', reason });
      ctx.shutdown(reason);
    };

    const session = new AgentSession({
      stt: new DeepgramSTT({ model: 'nova-3', language: 'es-419' }),
      llm: new GoogleLLM({ model: process.env.DEMO_MODEL || 'gemini-3.5-flash-lite', apiKey: process.env.GEMINI_API_KEY }),
      // Our own wrapper (eleven-tts.ts): the official ElevenLabs plugin stalls on every reply in agents 1.8.1.
      tts: new ElevenTTS({ voiceId: process.env.ELEVEN_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL' }),
      vad: ctx.proc.userData.vad as InstanceType<typeof SileroVAD>,
      // Default 3 s: the visitor could not cut the ~4 s greeting. 1 s is enough for the browser echo canceller to settle.
      aecWarmupDuration: 1000,
      turnHandling: {
        turnDetection: new inference.TurnDetector({ version: 'v1-mini' }),
        // No preemptiveTts (QualityIQ turns it on): here the preemptive TTS stream sometimes never closed and the reply
        // stalled 10 s in silence. The LLM still drafts the reply early (default), the voice starts once the turn ends.
        endpointing: { mode: 'dynamic', maxDelay: 1200 },
        // Sin LiveKit Cloud el detector "adaptive" no tiene credenciales: VAD corta a Maya apenas el visitante habla.
        interruption: { mode: 'vad' },
      },
    });

    session.on(AgentSessionEventTypes.UserInputTranscribed, ev => {
      if (!ev.isFinal && ev.transcript.trim()) send({ type: 'partial', text: ev.transcript.trim() });
    });
    // No se loguea el texto: el sitio promete que la demo no guarda lo que dice el visitante.
    session.on(AgentSessionEventTypes.ConversationItemAdded, ev => {
      if (ev.item.type !== 'message' || !ev.item.textContent) return;
      // The sentence tokenizer glues sentences ("Maya.¿Qué"): put the space back for the screen.
      send({ type: 'transcript', role: ev.item.role === 'assistant' ? 'bot' : 'user', text: ev.item.textContent.replace(/([.?!])(?=[¿¡A-ZÁÉÍÓÚÑ])/g, '$1 ') });
    });
    session.on(AgentSessionEventTypes.Close, () => end('Llamada finalizada'));

    const limit = setTimeout(() => {
      void session.say('Se terminó el tiempo de la demo. ¡Gracias por probar a Maya!').waitForPlayout()
        .catch(() => {}).finally(() => end('Se cumplió el tiempo de la demo'));
    }, c.maxSeconds * 1000);
    ctx.addShutdownCallback(async () => {
      clearTimeout(limit);
      await ctx.deleteRoom().catch(err => console.error('[demo] no se pudo cerrar la sala', err));
    });

    // The browser says "hello" once its mic is on (VoiceDemo.tsx), like QualityIQ's "answer": speaking before the
    // visitor's side is ready left the first utterance stalled ~10 s with no audio. Fallback: greet after 4 s anyway.
    const hello = new Promise<void>(resolve => {
      ctx.room.on(RoomEvent.DataReceived, payload => {
        try { if (JSON.parse(new TextDecoder().decode(payload)).type === 'hello') resolve(); } catch { /* not ours */ }
      });
      setTimeout(resolve, 4000);
    });
    await session.start({ agent: Agent.create({ instructions: c.instructions }), room: ctx.room });
    await hello;
    console.log(`[demo] llamada ${ctx.room.name}`);
    session.say(c.greeting);
  },
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  cli.runApp(new ServerOptions({ agent: fileURLToPath(import.meta.url), agentName: AGENT_NAME, initializeProcessTimeout: 30_000 }));
}
