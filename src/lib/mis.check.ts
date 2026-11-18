// Run: node --experimental-strip-types src/lib/mis.check.ts
import assert from "node:assert/strict";
import { board, QUESTIONS, samAnswer, SOURCES } from "./mis.ts";

const all = board(["botmaker", "telefonia", "voicebot", "qualityiq", "crm"]);
const sum = (k: "botmaker" | "telefonia" | "voicebot") => (SOURCES[k].conv as readonly number[]).reduce((a, b) => a + b, 0);
assert.equal(all.conversations, sum("botmaker") + sum("telefonia") + sum("voicebot"));
assert.equal(all.peak?.day, "V 14"); // the story SAM tells
assert.ok(all.sales !== null && all.quality === 84);

// Only one channel: no sales or quality, numbers shrink.
const wa = board(["botmaker"]);
assert.equal(wa.conversations, sum("botmaker"));
assert.equal(wa.sales, null);
assert.equal(wa.quality, null);

// Nothing connected: empty board, SAM asks to connect a channel instead of inventing.
const none = board(["crm"]);
assert.equal(none.conversations, 0);
assert.equal(none.costPerConv, null);
assert.match(samAnswer(QUESTIONS[0], none, ["crm"]), /conectá al menos un canal/);

// SAM quotes the board's own numbers.
assert.ok(samAnswer(QUESTIONS[0], all, ["botmaker", "telefonia", "voicebot", "qualityiq", "crm"]).includes(all.conversations.toLocaleString("es-AR")));
console.log("mis ok");
