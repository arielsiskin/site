// Contact-form leads: a Zoho CRM "Posible cliente" owned by Juan Moraca, plus a Cliq DM to him.
// Credentials: the zoho-oauth secret (Self Client refresh token, scopes ZohoCRM.modules.leads.CREATE,ZohoCliq.Webhooks.CREATE).

const OWNER = "6459628000000504053"; // Juan Pablo Moraca
const OWNER_EMAIL = "juan.moraca@mayday.global";
const LAYOUT = "6459628000000091055"; // "Lead Inside", the active layout
const ORG = "org867978920";

// "País de Gestión" picklist in the CRM (the form offers the same list).
export const COUNTRIES = ["Argentina", "Bolivia", "Brasil", "Canadá", "Chile", "Colombia", "Costa Rica", "Ecuador", "El Salvador", "España", "Estados Unidos", "Guatemala", "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "República Dominicana", "Uruguay", "Venezuela"];

export type Lead = { nombre: string; empresa: string; email: string; telefono: string; pais: string; mensaje: string };
type Creds = { client_id: string; client_secret: string; refresh_token: string; api_domain?: string };

/** The CRM record for a form lead: name split for First/Last, website domain taken from the email. */
export function leadRecord(l: Lead) {
  const [first, ...rest] = l.nombre.split(/\s+/);
  return {
    First_Name: rest.length ? first : undefined,
    Last_Name: rest.length ? rest.join(" ") : first,
    Company: l.empresa,
    Email: l.email,
    Mobile: l.telefono,
    Pais_de_Gesti_n: l.pais,
    Dominio_2: l.email.split("@")[1]?.toLowerCase(),
    Description: l.mensaje,
    Lead_Source: "Lead Inbound",
    Lead_Status: "Not Contacted",
    Owner: { id: OWNER },
    Layout: { id: LAYOUT },
  };
}

let cached: { token: string; until: number } | undefined;

async function accessToken(c: Creds): Promise<string> {
  if (cached && Date.now() < cached.until) return cached.token;
  const accounts = (c.api_domain ?? "https://www.zohoapis.com").replace("www.zohoapis", "accounts.zoho");
  const res = await fetch(`${accounts}/oauth/v2/token`, {
    method: "POST",
    body: new URLSearchParams({ grant_type: "refresh_token", client_id: c.client_id, client_secret: c.client_secret, refresh_token: c.refresh_token }),
    signal: AbortSignal.timeout(10_000),
  });
  const r = await res.json();
  if (!r.access_token) throw new Error(`zoho token: ${r.error ?? res.status}`);
  cached = { token: r.access_token, until: Date.now() + (r.expires_in - 120) * 1000 };
  return r.access_token;
}

/** Creates the lead and pings Juan on Cliq. Throws if the CRM rejects it; a failed Cliq ping is only logged. */
export async function sendLead(l: Lead): Promise<void> {
  const c = JSON.parse(process.env.ZOHO_OAUTH ?? "null") as Creds | null;
  if (!c) throw new Error("ZOHO_OAUTH not set");
  const api = c.api_domain ?? "https://www.zohoapis.com";
  const auth = { Authorization: `Zoho-oauthtoken ${await accessToken(c)}`, "content-type": "application/json" };

  const res = await fetch(`${api}/crm/v2/Leads`, {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ data: [leadRecord(l)], trigger: ["workflow", "approval"] }),
    signal: AbortSignal.timeout(10_000),
  });
  const out = await res.json().catch(() => null);
  const row = out?.data?.[0];
  if (row?.code !== "SUCCESS") throw new Error(`zoho lead: ${JSON.stringify(row ?? out ?? res.status)}`);

  const crm = api.replace("www.zohoapis", "crm.zoho");
  const text = [
    "*Nuevo lead desde mayday.global* (formulario de contacto)",
    `*${l.nombre}*, ${l.empresa} (${l.pais})`,
    `${l.email} · ${l.telefono}`,
    `> ${l.mensaje.slice(0, 500)}`,
    `${crm}/crm/${ORG}/tab/Leads/${row.details.id}`,
  ].join("\n");
  const cliq = api.replace("www.zohoapis", "cliq.zoho");
  await fetch(`${cliq}/api/v2/buddies/${OWNER_EMAIL}/message`, { method: "POST", headers: auth, body: JSON.stringify({ text }), signal: AbortSignal.timeout(10_000) })
    .then(async (r) => r.ok || console.error(`cliq ${r.status}: ${await r.text()}`))
    .catch((e) => console.error("cliq", e));
}
