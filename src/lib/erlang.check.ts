// Run: node --experimental-strip-types lib/erlang.check.ts
import assert from "node:assert/strict";
import { agentsNeeded, erlangC, INTRADAY, serviceLevel } from "./erlang.ts";

const close = (a: number, b: number, eps = 1e-3) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
close(erlangC(2, 1), 1 / 3); // by hand: (1/2·2/1) / (1 + 1 + 1)
close(erlangC(11, 10), 0.6821, 1e-3); // published tables
assert.equal(erlangC(10, 10), 1);
assert.equal(serviceLevel(5, 0, 180, 20), 1);
// 200 calls/h at 180 s = 10 erlangs; 80/20 needs 14 agents (13 gives 79.6%)
assert.equal(agentsNeeded(200, 180, 0.8, 20), 14);
close(serviceLevel(13, 200, 180, 20), 0.7956);
assert.ok(agentsNeeded(4000, 240, 0.9, 20) > 260); // big volumes stay finite
close(INTRADAY.reduce((s, x) => s + x, 0), 1);
console.log("erlang ok");
