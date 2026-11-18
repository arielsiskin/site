// Erlang C, the standard contact-center staffing model. Erlang B by recursion first, so large agent counts never
// overflow factorials.

/** Probability a call waits, with `agents` agents and `traffic` erlangs (calls × AHT / interval length). */
export function erlangC(agents: number, traffic: number): number {
  if (agents <= traffic) return 1;
  let b = 1;
  for (let n = 1; n <= agents; n++) b = (traffic * b) / (n + traffic * b);
  return (agents * b) / (agents - traffic * (1 - b));
}

/** Share of calls answered within `targetSec`. */
export function serviceLevel(agents: number, calls: number, ahtSec: number, targetSec: number, intervalSec = 3600): number {
  if (calls <= 0) return 1;
  const traffic = (calls * ahtSec) / intervalSec;
  if (agents <= traffic) return 0;
  return 1 - erlangC(agents, traffic) * Math.exp((-(agents - traffic) * targetSec) / ahtSec);
}

/** Fewest agents on the phones that reach `goal` (0-1) service level in the interval. */
export function agentsNeeded(calls: number, ahtSec: number, goal: number, targetSec: number, intervalSec = 3600): number {
  if (calls <= 0) return 0;
  let n = Math.max(1, Math.floor((calls * ahtSec) / intervalSec));
  while (serviceLevel(n, calls, ahtSec, targetSec, intervalSec) < goal && n < 5000) n++;
  return n;
}

/** Share of the day's calls in each hour from 8 to 21 (a typical LatAm inbound curve: morning and after-lunch peaks). */
export const INTRADAY = [0.045, 0.075, 0.095, 0.1, 0.09, 0.07, 0.075, 0.09, 0.088, 0.08, 0.065, 0.05, 0.04, 0.037];
export const HOURS = INTRADAY.map((_, i) => `${String(8 + i).padStart(2, "0")}:00`);
