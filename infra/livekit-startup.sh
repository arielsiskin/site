#!/bin/bash
# Arranque de la VM de LiveKit de la demo de voz (Container-Optimized OS: trae Docker, no gcloud). Corre en cada boot,
# es idempotente y lo vuelve a correr scripts/livekit.sh para actualizar el worker. Copia del de QualityIQ
# (quality-iq/infra/files/livekit-startup.sh.tftpl) sin Egress ni Redis: la demo no graba nada.
set -euo pipefail
log() { echo "[startup] $*"; }
meta() { curl -sf -H 'Metadata-Flavor: Google' "http://metadata.google.internal/computeMetadata/v1/$1"; }

PROJECT=$(meta project/project-id)
HOSTNAME_RTC=$(meta instance/attributes/livekit-hostname)
WORKER_IMAGE="us-central1-docker.pkg.dev/$PROJECT/cloud-run-source-deploy/voice-agent:latest"

# Los secretos se leen de Secret Manager con el token de la VM: por metadata los vería cualquiera con compute.instances.get.
TOKEN=$(meta instance/service-accounts/default/token | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')
secret() {
  curl -sf -H "Authorization: Bearer $TOKEN" \
    "https://secretmanager.googleapis.com/v1/projects/$PROJECT/secrets/$1/versions/latest:access?prettyPrint=false" \
    | tr -d ' \n\r' | sed -n 's/.*"data":"\([^"]*\)".*/\1/p' | base64 -d | tr -d '\r\n'
}
LIVEKIT_SECRET=$(secret livekit-api-secret || true)
if [ -z "$LIVEKIT_SECRET" ]; then
  log "ERROR: livekit-api-secret vino vacío: ¿tiene una versión cargada?"
  exit 1
fi

log "escribiendo configs para $HOSTNAME_RTC"
umask 077
# /etc es tmpfs en COS y Docker crea como directorio un bind-mount que no existe: se borran antes de escribir.
rm -rf /etc/livekit.yaml /etc/Caddyfile
cat > /etc/livekit.yaml <<EOF
port: 7880
bind_addresses: ["127.0.0.1"]
rtc:
  tcp_port: 7881
  udp_port: 7882
  use_external_ip: true
keys:
  mayday-site: $LIVEKIT_SECRET
room:
  # Por sala: el visitante y Maya. El tope de llamadas simultáneas lo pone /api/call.
  max_participants: 2
log_level: info
EOF
cat > /etc/Caddyfile <<EOF
$HOSTNAME_RTC {
    reverse_proxy localhost:7880
}
EOF

until docker info >/dev/null 2>&1; do sleep 2; done

# COS trae iptables con INPUT en DROP: además del firewall de GCP hay que abrir los puertos en la VM.
open_port() { iptables -C INPUT -p "$1" --dport "$2" -j ACCEPT 2>/dev/null || iptables -A INPUT -p "$1" --dport "$2" -j ACCEPT; }
open_port tcp 80
open_port tcp 443
open_port tcp 7881
open_port udp 7882

docker rm -f caddy livekit voice-agent >/dev/null 2>&1 || true
# /var/lib/caddy guarda el certificado: un reinicio no lo vuelve a pedir (Let's Encrypt limita los duplicados).
log "levantando caddy"
docker run -d --name caddy --restart always --network host \
  -v /var/lib/caddy:/data -v /etc/Caddyfile:/etc/caddy/Caddyfile:ro caddy:2
log "levantando livekit"
docker run -d --name livekit --restart always --network host --pull always \
  -v /etc/livekit.yaml:/etc/livekit.yaml:ro livekit/livekit-server:latest --config /etc/livekit.yaml

# El worker va último y sin cortar el arranque: si falta la imagen o una clave, LiveKit sigue arriba.
# En COS el home de root es de solo lectura: docker login escribe en /var/lib.
export DOCKER_CONFIG=/var/lib/docker-config
mkdir -p "$DOCKER_CONFIG"
docker image prune -f >/dev/null 2>&1 || true
if docker login -u oauth2accesstoken -p "$TOKEN" https://us-central1-docker.pkg.dev >/dev/null 2>&1; then
  log "levantando voice-agent"
  docker run -d --name voice-agent --restart always --network host --pull always \
    -e LIVEKIT_URL=ws://localhost:7880 -e LIVEKIT_API_KEY=mayday-site -e LIVEKIT_API_SECRET="$LIVEKIT_SECRET" \
    -e GEMINI_API_KEY="$(secret gemini-api-key || true)" -e DEEPGRAM_API_KEY="$(secret deepgram-api-key || true)" \
    -e ELEVEN_API_KEY="$(secret elevenlabs-api-key || true)" -e ELEVEN_VOICE_ID=EXAVITQu4vr4xnSDxMaL \
    "$WORKER_IMAGE" || log "ERROR: no levantó voice-agent (¿se publicó la imagen?)"
else
  log "ERROR: no pudo entrar a Artifact Registry: sin voice-agent"
fi
log "listo"
