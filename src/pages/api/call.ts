import type { APIRoute } from "astro";
import { AccessToken, RoomAgentDispatch, RoomConfiguration, RoomServiceClient } from "livekit-server-sdk";
import { allow, clientIp } from "@/lib/ratelimit";
import { CALL_SECONDS, isScenario, MAX_CALLS, SCENARIOS, STYLE, callsUsed } from "@/lib/voicebot";

export const prerender = false;

// Mismo nombre que registra el worker (voice-agent/src/worker.ts) y misma clave que la VM (infra/livekit-startup.sh).
const AGENT_NAME = "mayday-site-demo";
const API_KEY = "mayday-site";
const COOKIE = "mayday_demo_calls";
const MAX_ROOMS = 3; // llamadas a la vez: la VM es una e2-medium y cada una paga Deepgram + Gemini + ElevenLabs
const json = (body: unknown, status = 200) => Response.json(body, { status });

/** Abre una llamada con Maya: sala de LiveKit + token del visitante. Cuenta las pruebas por cookie y, como la cookie
 *  se borra fácil, también por IP. */
export const POST: APIRoute = async ({ request, cookies, url }) => {
  const { LIVEKIT_URL: lkUrl, LIVEKIT_API_SECRET: secret } = process.env;
  if (!lkUrl || !secret) return json({ error: "La llamada en vivo todavía no está configurada." }, 503);

  const used = callsUsed(cookies.get(COOKIE)?.value);
  if (used >= MAX_CALLS) return json({ error: "Ya usaste tus pruebas de la demo. Si querés seguir, escribinos y te mostramos más.", left: 0 }, 429);
  if (!allow(`call:${clientIp(request)}`, MAX_CALLS * 3, 24 * 3600_000)) return json({ error: "Muchas llamadas desde esta red hoy: probá mañana.", left: 0 }, 429);

  const { scenario } = (await request.json().catch(() => null)) ?? {};
  if (!isScenario(scenario)) return json({ error: "Escenario inválido" }, 400);

  const rooms = await new RoomServiceClient(lkUrl.replace(/^ws/, "http"), API_KEY, secret).listRooms().catch(() => null);
  if (!rooms) return json({ error: "La llamada en vivo no está disponible ahora. Probá en un rato." }, 503);
  if (rooms.length >= MAX_ROOMS) return json({ error: "Maya está atendiendo otras llamadas. Probá en un minuto." }, 503);

  const s = SCENARIOS[scenario];
  const room = `demo-${scenario}-${crypto.randomUUID().slice(0, 8)}`;
  const config = { instructions: `${s.prompt}\n${STYLE}`, greeting: s.greeting, maxSeconds: CALL_SECONDS };
  const token = new AccessToken(API_KEY, secret, { identity: `visitante-${room}`, ttl: "10m" });
  token.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true, canPublishData: true });
  token.roomConfig = new RoomConfiguration({ name: room, agents: [new RoomAgentDispatch({ agentName: AGENT_NAME, metadata: JSON.stringify(config) })] });

  cookies.set(COOKIE, String(used + 1), { path: "/", maxAge: 30 * 86400, sameSite: "lax", secure: url.protocol === "https:" });
  return json({ url: lkUrl, token: await token.toJwt(), left: MAX_CALLS - used - 1, maxSeconds: CALL_SECONDS });
};
