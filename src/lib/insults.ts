// Insults common across LatAm. Same list as voice-agent/src/farewell.ts (the worker is its own package and cannot
// import from the site): change both together. Left out on purpose: words that are friendly in some countries
// ("boludo", "güey"). shortcut: a word list misses creative insults; ask the LLM if this ever needs to be exact.
export const INSULT = /\b(idiota|imb[eé]cil|est[uú]pid[oa]|pelotud[oa]|forr[oa]|tarad[oa]|in[uú]til|mog[oó]lic[oa]|hij[oa] de (puta|perra)|hdp|put[oa]|la concha|concha ?(e ?)?tu ?madre|conchetumadre|mierda|pendej[oa]|cabr[oó]n|chinga(da|tu)?|pinche|gonorrea|malparid[oa]|culiad[oa]|maric[oó]n|basura)\b/i;
