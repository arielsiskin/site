import assert from "node:assert/strict";
import { leadRecord } from "./zoho.ts";

const base = { empresa: "ACME", email: "Ana@Acme.COM", telefono: "+54 11 5555", pais: "Argentina", mensaje: "hola" };
const r = leadRecord({ ...base, nombre: "Ana María Pérez" });
assert.equal(r.First_Name, "Ana");
assert.equal(r.Last_Name, "María Pérez");
assert.equal(r.Dominio_2, "acme.com");
assert.equal(r.Mobile, "+54 11 5555");
const one = leadRecord({ ...base, nombre: "Ana" }); // Last_Name is the one the CRM requires
assert.equal(one.Last_Name, "Ana");
assert.equal(one.First_Name, undefined);
console.log("zoho ok");
