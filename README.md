# Mayday Global, sitio institucional

Astro (HTML estático) con islas React para las demos interactivas y dos rutas de servidor para la IA.
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
ELEVEN_API_KEY=...      # opcional; sin ella el voicebot muestra "falta la clave"
ELEVEN_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```

## Deploy

```bash
scripts/deploy.sh
```

Las claves salen de Secret Manager (`gemini-api-key`, `elevenlabs-api-key`). Para cargar o rotar ElevenLabs:

```bash
printf '%s' "$CLAVE" | gcloud secrets versions add elevenlabs-api-key --data-file=- --project=ar-mayday-global-site
```

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
