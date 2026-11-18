#!/usr/bin/env bash
# La VM de LiveKit de la demo de voz (Caddy + LiveKit + el worker de voice-agent/).
#   scripts/livekit.sh          publica la imagen del worker y lo reinicia en la VM (la crea si no existe)
#   scripts/livekit.sh host X   cambia el hostname del certificado (X tiene que apuntar a la IP, sin proxy)
# La IP, el firewall, la cuenta livekit-vm y los secretos se crearon a mano una vez (ver README).
set -euo pipefail
cd "$(dirname "$0")/.."

P=ar-mayday-global-site
Z=us-central1-a
IP=$(gcloud compute addresses describe livekit --region=us-central1 --project=$P --format='value(address)')

if [ "${1:-}" = host ]; then
  gcloud compute instances add-metadata livekit --zone=$Z --project=$P --metadata=livekit-hostname="$2"
  gcloud compute ssh livekit --zone=$Z --project=$P --tunnel-through-iap --command='sudo google_metadata_script_runner startup'
  exit
fi

gcloud builds submit voice-agent --tag=us-central1-docker.pkg.dev/$P/cloud-run-source-deploy/voice-agent:latest --project=$P --region=us-central1

if ! gcloud compute instances describe livekit --zone=$Z --project=$P >/dev/null 2>&1; then
  # sslip.io resuelve 1-2-3-4.sslip.io a 1.2.3.4: alcanza para el certificado mientras no haya un nombre propio.
  gcloud compute instances create livekit --zone=$Z --project=$P \
    --machine-type=e2-medium --tags=livekit --address="$IP" \
    --image-family=cos-stable --image-project=cos-cloud --boot-disk-size=10GB --boot-disk-type=pd-balanced \
    --service-account=livekit-vm@$P.iam.gserviceaccount.com --scopes=cloud-platform --shielded-secure-boot \
    --metadata=google-logging-enabled=true,block-project-ssh-keys=true,livekit-hostname="${IP//./-}.sslip.io" \
    --metadata-from-file=startup-script=infra/livekit-startup.sh
else
  gcloud compute instances add-metadata livekit --zone=$Z --project=$P --metadata-from-file=startup-script=infra/livekit-startup.sh
  gcloud compute ssh livekit --zone=$Z --project=$P --tunnel-through-iap --command='sudo google_metadata_script_runner startup'
fi
echo "wss://$(gcloud compute instances describe livekit --zone=$Z --project=$P --format='value(metadata.items.filter("key:livekit-hostname").extract("value").flatten())')"
echo "Si cambió el hostname: scripts/deploy.sh para que el sitio lo tome."
