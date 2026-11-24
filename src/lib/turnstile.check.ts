import assert from "node:assert/strict";
import { accepted } from "./turnstile.ts";

assert.ok(accepted({ success: true, action: "contacto", hostname: "mayday.global" }, false));
assert.ok(!accepted({ success: false, action: "contacto", hostname: "mayday.global" }, false));
assert.ok(!accepted({ success: true, action: "otra", hostname: "mayday.global" }, false)); // token minted for another form
assert.ok(!accepted({ success: true, action: "contacto", hostname: "evil.com" }, false)); // token from another site
assert.ok(accepted({ success: true, hostname: "example.com" }, true));
console.log("turnstile ok");
