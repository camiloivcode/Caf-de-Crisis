import assert from 'node:assert';
import { resolve, newOrder } from './api/game.js';
import { ROUNDS } from './api/_rounds.js';

assert.equal(ROUNDS.length, 10);
for (const r of ROUNDS) assert.deepEqual(r.options.map((o) => o.kind).sort(), ['big', 'lose', 'small']);

const order = newOrder();
const bestLetter = (r) => 'ABC'[order[r].findIndex((i) => ROUNDS[r].options[i].kind === 'big')];
const caps = { andino: 1000, imperio: 1000, titan: 100 };
const out = resolve(0, order, caps, { andino: bestLetter(0), imperio: undefined, titan: undefined });
assert.equal(out.andino.amount, 180);
assert.equal(out.imperio.amount, -150);       // sin decisión = pérdida
assert.equal(out.titan.bankrupt, true);       // 100 - 150 <= 0
assert.equal(resolve(1, order, caps, {}).titan, undefined); // eliminado no juega
console.log('ok');

// ---- API: PIN, revelado automático y candado ----
const { default: handler } = await import('./api/game.js');
const call = async (method, body, query = {}) => { let out; const res = { status(c) { this.c = c; return this; }, json(j) { out = { c: this.c || 200, j }; } }; await handler({ method, body, query }, res); return out; };
assert.equal((await call('POST', { action: 'create', pin: 'mal' })).c, 403);
const { j: { room, hostToken } } = await call('POST', { action: 'create', pin: '2026' });
const tk = {};
for (const t of ['andino', 'imperio', 'titan']) tk[t] = (await call('POST', { action: 'join', room, team: t })).j.token;
await call('POST', { action: 'start', room, hostToken });
for (const t of ['andino', 'imperio']) await call('POST', { action: 'choose', room, team: t, token: tk[t], letter: 'A' });
let g = (await call('GET', null, { room })).j;
assert.equal(g.phase, 'decide');                       // falta titán
await call('POST', { action: 'choose', room, team: 'titan', token: tk.titan, letter: 'B' });
g = (await call('GET', null, { room })).j;
assert.equal(g.phase, 'reveal');                       // revelado automático al decidir todos
const capSum = () => Object.values(g.teams).reduce((a, t) => a + t.cap, 0);
const before = capSum();
await Promise.all(Array.from({ length: 5 }, () => call('GET', null, { room })));
g = (await call('GET', null, { room })).j;
assert.equal(capSum(), before);                        // candado: no se aplica dos veces
assert.equal(g.history.length, 1);
console.log('api ok');
