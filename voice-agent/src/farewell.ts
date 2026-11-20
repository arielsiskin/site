// When to hang up: someone said goodbye. Adapted from QualityIQ (quality-iq/apps/voice-agent/src/practice.ts).
export const FAREWELL = /\b(chau|chao|adi[oó]s|nos vemos|hasta luego|hasta pronto|hasta mañana|hasta la pr[oó]xima|que (le |te )?vaya bien|que tenga(s)? (un )?(buen|lindo|excelente|feliz) (d[ií]a|fin de semana)|que tenga(s)? (una )?(buena tarde|buena noche|buenas tardes|buenas noches|linda tarde|excelente tarde)|gracias por (comunicarse|comunicarte|llamar|tu llamada|su llamada|elegirnos))\b/i;

/** The model sometimes writes a stage direction instead of hanging up ("(Llamada finalizada)", "[cuelga]"). */
export const CALL_ENDED = /^\s*[([*]?\s*(llamada (finalizada|terminada)|fin de la llamada|cuelga|colg[oó])\b/i;

/** Maya's closing question ("¿Te puedo ayudar en algo más?"), and a visitor's short "no" to it. */
export const ASKS_MORE = /algo m[aá]s\s*\?\s*$/i;
// A "no" that goes on to ask for something else ("no, pero quería...") is not a goodbye.
export const NO_MORE = /^[^\p{L}]*(no|nada( m[aá]s)?|eso (es )?todo|es todo|est[aá] bien|listo|ya est[aá]|todo bien|perfecto)(?!\p{L})(?!.*\b(quer[ií]a|quiero|necesito|pero|tambi[eé]n|otra)\b)/iu;

/** The visitor is closing: they said goodbye, or answered no to Maya's "¿algo más?". */
export const userCloses = (user: string, lastBot: string) => FAREWELL.test(user) || (ASKS_MORE.test(lastBot) && NO_MORE.test(user));

/** Maya's last line closes the call: a stage direction, a goodbye that does not ask anything, or any reply that is
 *  not a question once the visitor is closing ("¿algo más?" keeps the call open). */
export function shouldHangUp(bot: string, userClosing: boolean) {
  if (CALL_ENDED.test(bot)) return true;
  if (bot.trim().endsWith('?')) return false;
  return userClosing || FAREWELL.test(bot);
}

/** Same list as src/lib/insults.ts (the site keeps a copy: change both). Insults common across LatAm, for the softphone alert (Maya's reaction comes from the prompt, the model understands
 *  context). Left out on purpose: words that are friendly in some countries ("boludo", "güey", "huevón" among friends).
 *  shortcut: a word list misses creative insults; ask the LLM per turn if the alert ever needs to be exact. */
export const INSULT = /\b(idiota|imb[eé]cil|est[uú]pid[oa]|pelotud[oa]|forr[oa]|tarad[oa]|in[uú]til|mog[oó]lic[oa]|hij[oa] de (puta|perra)|hdp|put[oa]|la concha|concha ?(e ?)?tu ?madre|conchetumadre|mierda|pendej[oa]|cabr[oó]n|chinga(da|tu)?|pinche|gonorrea|malparid[oa]|culiad[oa]|maric[oó]n|basura)\b/i;
