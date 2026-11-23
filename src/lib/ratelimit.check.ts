// Run: node --experimental-strip-types src/lib/ratelimit.check.ts
import assert from "node:assert/strict";
import { allow, clientIp } from "./ratelimit.ts";

assert.ok(allow("a", 2, 1000, 0));
assert.ok(allow("a", 2, 1000, 10));
assert.equal(allow("a", 2, 1000, 20), false); // third in the window
assert.ok(allow("b", 2, 1000, 20)); // other keys are independent
assert.ok(allow("a", 2, 1000, 1000)); // new window
assert.equal(clientIp(new Request("http://x", { headers: { "x-forwarded-for": "6.6.6.6, 1.2.3.4" } })), "1.2.3.4"); // forged first entry ignored
assert.equal(clientIp(new Request("http://x")), "local");
console.log("ratelimit ok");
