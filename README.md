# Mayday Global, sitio institucional

Astro (HTML estático) con islas React para las demos interactivas y tres rutas de servidor (`/api/voice` chat, `/api/analyze` QualityIQ, `/api/call` llamada en vivo).
Corre en Cloud Run, proyecto `ar-mayday-global-site` (carpeta Proyectos Internos), región `us-central1`.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321, lee las claves de .env.local
npm run check    # tipos + self-checks (puntaje QualityIQ, Erlang C, rate limit)
```

`.env.local` (no se commitea):

```
GEMINI_API_KEY=...      # clave propia del sitio: gcloud secrets versions access latest --secret=gemini-api-key --project=ar-mayday-global-site
LIVEKIT_URL=wss://34-121-141-195.sslip.io   # opcional, para probar la llamada en vivo
LIVEKIT_API_SECRET=...  # gcloud secrets versions access latest --secret=livekit-api-secret --project=ar-mayday-global-site
```

## Deploy

```bash
scripts/deploy.sh
```

Cloud Run solo recibe `gemini-api-key` y `livekit-api-secret`. Deepgram y ElevenLabs viven solo en la VM de LiveKit. Para cargar o rotar una clave:

```bash
printf '%s' "$CLAVE" | gcloud secrets versions add <secreto> --data-file=- --project=ar-mayday-global-site
```

## Llamada en vivo con Maya (LiveKit)

El voicebot de la home es una llamada en tiempo real que se puede interrumpir. Funciona así:
- `/api/call` abre una sala en la VM `livekit` del proyecto, donde corren Caddy, LiveKit y el worker de `voice-agent/`.
- El worker usa Deepgram para escuchar, Gemini para responder y ElevenLabs para la voz.
- Cada navegador tiene 4 llamadas de 3 minutos, contadas con la cookie `mayday_demo_calls`.
- Como borrar la cookie alcanza para resetear el contador, también hay un límite diario por IP.
- Puede haber 3 llamadas a la vez como máximo.

```bash
scripts/livekit.sh                         # publica el worker y lo reinicia en la VM (también para tomar claves nuevas)
scripts/livekit.sh host rtc.mayday.global  # cambia el hostname del certificado (registro A a la IP, sin proxy de Cloudflare)
scripts/deploy.sh                          # el sitio toma el hostname de la VM en cada deploy
```

El worker lee de Secret Manager estas claves: `livekit-api-secret`, `gemini-api-key`, `deepgram-api-key` y `elevenlabs-api-key`. Después de cargar o rotar una, corré `scripts/livekit.sh`.

El IP fijo, el firewall, la cuenta de servicio `livekit-vm` y los secretos se crearon a mano una sola vez. Los comandos son los mismos de `infra/livekit.tf` en quality-iq.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Home y sus secciones | `src/pages/index.astro`, `src/components/*.tsx` |
| Páginas de texto (Markdown) | `src/pages/*.md` con `layout: ../layouts/Prose.astro` |
| Demo voicebot / IA Bot | `src/components/VoiceDemo.tsx`, `BotDemo.tsx`, escenarios en `src/lib/voicebot.ts`, API en `src/pages/api/voice.ts` |
| Demo QualityIQ | `src/components/QualityDemo.tsx`, protocolo y ejemplo en `src/lib/qiq.ts`, API en `src/pages/api/analyze.ts` |
| Omnichannel / WFM | `src/components/OmniDemo.tsx`, `WfmDemo.tsx` (todo en el navegador; Erlang C en `src/lib/erlang.ts`) |
| Colores y tipografías | `tailwind.config.ts` (tokens de `quality-iq/apps/web/src/tokens.ts`) |
| Redirecciones de URLs viejas | `astro.config.mjs` |

Analytics (GA + GTM) solo se cargan en `mayday.global`; en la URL de Cloud Run y en local no.
