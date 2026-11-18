// Run: node --experimental-strip-types lib/qiq.check.ts
import assert from "node:assert/strict";
import { PROTOCOL, SAMPLE, score } from "./qiq.ts";

const it = (status: "met" | "partial" | "not_met" | "na") => ({ id: "x", status, evidence: "", timestamp: null, better: null });
assert.equal(score([it("met"), it("partial"), it("not_met"), it("na")]), 50);
assert.equal(score([it("na")]), null);
assert.equal(score([]), null);
assert.equal(score(SAMPLE.items), 86);
assert.deepEqual(SAMPLE.items.map((i) => i.id), PROTOCOL.map((p) => p.id));
console.log("qiq ok");
