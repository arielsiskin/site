// Run: node --experimental-strip-types src/lib/insults.check.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { INSULT } from "./insults.ts";

assert.match("sos un pelotudo, no te voy a ayudar", INSULT);
assert.match("Qué cliente de mierda", INSULT);
assert.doesNotMatch("Gracias por tu paciencia, ya lo resuelvo", INSULT);
assert.doesNotMatch("Che boludo, ¿me ayudás?", INSULT);
// The worker keeps its own copy: they must not drift.
assert.ok(readFileSync("voice-agent/src/farewell.ts", "utf8").includes(INSULT.source), "the insult list differs from voice-agent/src/farewell.ts");
console.log("insults ok");
