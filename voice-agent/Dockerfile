# Worker de la demo de voz: corre en la VM de LiveKit (infra/livekit-startup.sh). Compilado y no con tsx: cada llamada
# forkea un proceso que reimporta todo, y el framework lo corta a los 30 s.
FROM node:22-slim AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY tsconfig.json ./
COPY src/ ./src/
RUN npx tsc

FROM node:22-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/worker.js", "start"]
