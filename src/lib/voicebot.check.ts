// Run: node --experimental-strip-types src/lib/voicebot.check.ts
import assert from "node:assert/strict";
import { callsUsed, MAX_CALLS } from "./voicebot.ts";

assert.equal(callsUsed(undefined), 0);
assert.equal(callsUsed("2"), 2);
assert.equal(callsUsed("-50"), 0); // editar la cookie no da pruebas extra
assert.equal(callsUsed("99"), MAX_CALLS);
assert.equal(callsUsed("abc"), 0);
console.log("voicebot ok");
