// When to hang up: someone said goodbye. Adapted from QualityIQ (quality-iq/apps/voice-agent/src/practice.ts).
export const FAREWELL = /\b(chau|chao|adi[oó]s|nos vemos|hasta luego|hasta pronto|hasta mañana|hasta la pr[oó]xima|que (le |te )?vaya bien|que tenga(s)? (un )?(buen|lindo|excelente|feliz) (d[ií]a|fin de semana)|que tenga(s)? (una )?(buena tarde|buena noche|buenas tardes|buenas noches|linda tarde|excelente tarde)|gracias por (comunicarse|comunicarte|llamar|tu llamada|su llamada|elegirnos))\b/i;

/** The model sometimes writes a stage direction instead of hanging up ("(Llamada finalizada)", "[cuelga]"). */
export const CALL_ENDED = /^\s*[([*]?\s*(llamada (finalizada|terminada)|fin de la llamada|cuelga|colg[oó])\b/i;

/** Maya's last line closes the call: a goodbye that does not ask anything ("¡Gracias por llamar! ¿Algo más?" keeps
 *  going), a stage direction, or any reply right after the visitor said goodbye. */
export function shouldHangUp(bot: string, userSaidBye: boolean) {
  if (CALL_ENDED.test(bot)) return true;
  if (userSaidBye) return true;
  return FAREWELL.test(bot) && !bot.trim().endsWith('?');
}

/** Same list as src/lib/insults.ts (the site keeps a copy: change both). Insults common across LatAm, for the softphone alert (Maya's reaction comes from the prompt, the model understands
 *  context). Left out on purpose: words that are friendly in some countries ("boludo", "güey", "huevón" among friends).
 *  shortcut: a word list misses creative insults; ask the LLM per turn if the alert ever needs to be exact. */
export const INSULT = /\b(idiota|imb[eé]cil|est[uú]pid[oa]|pelotud[oa]|forr[oa]|tarad[oa]|in[uú]til|mog[oó]lic[oa]|hij[oa] de (puta|perra)|hdp|put[oa]|la concha|concha ?(e ?)?tu ?madre|conchetumadre|mierda|pendej[oa]|cabr[oó]n|chinga(da|tu)?|pinche|gonorrea|malparid[oa]|culiad[oa]|maric[oó]n|basura)\b/i;
