#!/usr/bin/env bash
# Deploys the site to Cloud Run in the AR-Mayday Global - Site project. Keys come from Secret Manager, never files.
# ElevenLabs is optional: until its secret has a version, the voicebot answers with a clear "missing key" error.
set -euo pipefail
cd "$(dirname "$0")/.."

P=ar-mayday-global-site
R=us-central1
SECRETS="GEMINI_API_KEY=gemini-api-key:latest"
if [ -n "$(gcloud secrets versions list elevenlabs-api-key --project=$P --filter=state=enabled --limit=1 --format='value(name)' 2>/dev/null)" ]; then
  SECRETS="$SECRETS,ELEVEN_API_KEY=elevenlabs-api-key:latest"
fi

npm run check

# max-instances caps both cost and the effective rate limit (it is per instance, see src/lib/ratelimit.ts).
gcloud run deploy mayday-site --source . --region=$R --project=$P --quiet \
  --allow-unauthenticated --min-instances=0 --max-instances=3 \
  --memory=512Mi --cpu=1 --timeout=120 --concurrency=40 \
  --set-secrets="$SECRETS" --set-env-vars=ELEVEN_VOICE_ID=EXAVITQu4vr4xnSDxMaL

gcloud run services describe mayday-site --region=$R --project=$P --format='value(status.url)'
