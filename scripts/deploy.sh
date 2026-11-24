#!/usr/bin/env bash
# Deploys the site to Cloud Run in the AR-Mayday Global - Site project. Keys come from Secret Manager, never files.
# Cloud Run only gets what it uses: Gemini (chat and QualityIQ demos), the LiveKit secret to sign call tokens and the
# Turnstile secret and Zoho credentials for the contact form (/api/contact, src/lib/zoho.ts).
# Deepgram and ElevenLabs live only on the LiveKit VM (scripts/livekit.sh).
set -euo pipefail
cd "$(dirname "$0")/.."

P=ar-mayday-global-site
R=us-central1
# The live call goes to the LiveKit VM; its hostname lives in the VM metadata.
LIVEKIT_HOST=$(gcloud compute instances describe livekit --zone=$R-a --project=$P --format='value(metadata.items.filter("key:livekit-hostname").extract("value").flatten())')

npm run check

# max-instances caps both cost and the effective rate limit (it is per instance, see src/lib/ratelimit.ts).
gcloud run deploy mayday-site --source . --region=$R --project=$P --quiet \
  --allow-unauthenticated --min-instances=0 --max-instances=3 \
  --memory=512Mi --cpu=1 --timeout=120 --concurrency=40 \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest,LIVEKIT_API_SECRET=livekit-api-secret:latest,TURNSTILE_SECRET=turnstile-secret:latest,ZOHO_OAUTH=zoho-oauth:latest" \
  --set-env-vars="LIVEKIT_URL=wss://$LIVEKIT_HOST"

gcloud run services describe mayday-site --region=$R --project=$P --format='value(status.url)'
