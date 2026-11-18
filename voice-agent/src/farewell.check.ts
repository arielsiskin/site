// Run: node --experimental-strip-types voice-agent/src/farewell.check.ts
import assert from 'node:assert/strict';
import { CALL_ENDED, FAREWELL, INSULT, shouldHangUp } from './farewell.ts';

assert.match('Listo, chau', FAREWELL);
assert.match('Gracias, que tengas un buen día', FAREWELL);
assert.match('Perfecto, gracias por llamar a Banco Austral. ¡Hasta luego!', FAREWELL);
assert.doesNotMatch('Buen día, habla Maya de RapiEnvío', FAREWELL);
assert.doesNotMatch('Hola, perdí mi tarjeta', FAREWELL);
assert.match('(Llamada finalizada)', CALL_ENDED);
assert.doesNotMatch('La llamada finalizada de ayer se cortó', CALL_ENDED);

// Maya says goodbye on her own: hang up, unless she is still asking something.
assert.equal(shouldHangUp('Tu tarjeta quedó bloqueada. ¡Que tengas un buen día!', false), true);
assert.equal(shouldHangUp('¡Gracias por llamar! ¿Te puedo ayudar con algo más?', false), false);
assert.equal(shouldHangUp('Entiendo, ¿me confirmás tu número de pedido?', false), false);
// The visitor said goodbye: Maya's reply is the last line, whatever it says.
assert.equal(shouldHangUp('Gracias a vos, ¡hasta pronto!', true), true);
assert.equal(shouldHangUp('Perfecto.', true), true);
console.log('farewell ok');
assert.match('Sos una idiota, no me resolvés nada', INSULT);
assert.match('andate a la mierda', INSULT);
assert.match('Malparida, no sirve', INSULT);
assert.doesNotMatch('Hola, perdí mi tarjeta de débito', INSULT);
assert.doesNotMatch('Che boludo, ¿me ayudás?', INSULT);
assert.doesNotMatch('Computadora', INSULT); // "puta" inside a word
console.log('insult ok');
