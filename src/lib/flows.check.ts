// Self-check for route(): node --experimental-strip-types src/lib/flows.check.ts
import assert from "node:assert/strict";
import { route } from "./flows.ts";

assert.equal(route("banco", "Perdí mi tarjeta"), "tarjetas");
assert.equal(route("banco", "¿Cuál es mi saldo?"), "cuentas");
assert.equal(route("banco", "Quiero hablar con una persona por mi tarjeta"), "humano"); // a person wins
assert.equal(route("banco", "Hola, buen día"), null);
assert.equal(route("delivery", "Es el pedido 48213"), "pedidos");
assert.equal(route("delivery", "Quiero cambiar la dirección"), "cambios");
assert.equal(route("mayday", "Quiero una demo"), "ventas");
assert.equal(route("mayday", "¿Qué hace Mayday?"), "productos");
console.log("flows ok");
