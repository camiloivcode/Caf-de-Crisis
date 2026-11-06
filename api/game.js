import { ROUNDS } from './_rounds.js';

export const TEAMS = { andino: 'Café Andino', imperio: 'Café Imperio', titan: 'Café Titán' };
const START = 1000;
const HOST_PIN = '2026'; // PIN del docente para crear partidas
const ROUND_MS = Number(process.env.ROUND_MS) || 90_000; // cuenta regresiva por ronda
const L = ['A', 'B', 'C'];

// ---------- almacenamiento: Neon Postgres (HTTP, sin dependencias) o memoria local ----------
const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const mem = globalThis.__mem ||= new Map(); // ponytail: solo dev local, en Vercel se usa Neon

async function sql(query, params = []) {
  const host = new URL(DB_URL).host.replace('-pooler', '');
  const r = await fetch(`https://${host}/sql`, {
    method: 'POST',
    headers: { 'Neon-Connection-String': DB_URL, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, params }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.message || 'Error de base de datos');
  return j.rows;
}
let ready;
const init = () => (ready ||= sql('create table if not exists kv (k text, f text, v text, primary key (k, f))'));

export const db = {
  async hgetall(k) {
    if (!DB_URL) return { ...(mem.get(k) || {}) };
    await init();
    return Object.fromEntries((await sql('select f, v from kv where k = $1', [k])).map((x) => [x.f, x.v]));
  },
  async hset(k, f, v) {
    if (!DB_URL) { mem.set(k, { ...(mem.get(k) || {}), [f]: String(v) }); return; }
    await init();
    await sql('insert into kv (k, f, v) values ($1, $2, $3) on conflict (k, f) do update set v = excluded.v', [k, f, String(v)]);
  },
  async hsetnx(k, f, v) { // true si lo escribió
    if (!DB_URL) { const o = mem.get(k) || {}; if (f in o) return false; o[f] = String(v); mem.set(k, o); return true; }
    await init();
    return (await sql('insert into kv (k, f, v) values ($1, $2, $3) on conflict do nothing returning f', [k, f, String(v)])).length === 1;
  },
};

// ---------- lógica pura ----------
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const newOrder = () => ROUNDS.map(() => shuffle([0, 1, 2]));
const rand = (n) => Array.from({ length: n }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)]).join('');

// Aplica el resultado de la ronda r. caps: {team: capital}, picks: {team: 'A'|'B'|'C'|undefined}
export function resolve(r, order, caps, picks) {
  const opts = ROUNDS[r].options;
  const out = {};
  for (const t of Object.keys(TEAMS)) {
    if (!(caps[t] > 0)) continue; // quebró o no está jugando
    // sin decisión = peor opción (la indecisión también cuesta)
    const opt = picks[t] ? opts[order[r][L.indexOf(picks[t])]] : opts.find((o) => o.kind === 'lose');
    caps[t] += opt.amount;
    out[t] = { letter: picks[t] || null, kind: opt.kind, amount: opt.amount, cap: caps[t], bankrupt: caps[t] <= 0 };
  }
  return out;
}

// ---------- estado público ----------
async function load(room) {
  const h = await db.hgetall('room:' + room);
  if (!h.meta) return null;
  const meta = JSON.parse(h.meta);
  const teams = {};
  for (const t of Object.keys(TEAMS)) {
    teams[t] = { name: TEAMS[t], cap: Number(h['cap:' + t] ?? START), claimed: !!h['tok:' + t], tok: h['tok:' + t], pick: h[`ch:${t}:${meta.round}`] };
  }
  return { meta, teams };
}

function view({ meta, teams }, who) {
  const r = meta.round, revealed = meta.phase === 'reveal' || meta.phase === 'final';
  const v = {
    phase: meta.phase, round: r, total: ROUNDS.length,
    endsIn: meta.phase === 'decide' ? Math.max(0, meta.deadline - Date.now()) : 0,
    teams: Object.fromEntries(Object.entries(teams).map(([t, x]) => [t, {
      name: x.name, cap: x.cap, claimed: x.claimed, bankrupt: x.cap <= 0,
      decided: !!x.pick, ...(who === t || who === 'host' ? { pick: x.pick || null } : {}),
    }])),
    history: meta.history.map((h) => ({ round: h.round, title: ROUNDS[h.round].title, results: h.results })),
  };
  if (meta.phase !== 'lobby' && r < ROUNDS.length) {
    const R = ROUNDS[r];
    v.current = {
      title: R.title, story: R.story,
      options: L.map((letter, i) => {
        const o = R.options[meta.order[r][i]];
        return revealed ? { letter, text: o.text, kind: o.kind, amount: o.amount, why: o.why } : { letter, text: o.text };
      }),
    };
  }
  return v;
}

// Revela la ronda una sola vez aunque lleguen varias peticiones a la vez (candado HSETNX).
async function doReveal(key, { meta, teams }) {
  if (meta.phase !== 'decide' || !(await db.hsetnx(key, 'rev:' + meta.round, 1))) return false;
  const played = Object.entries(teams).filter(([, x]) => x.claimed); // equipos sin conectar no juegan
  const caps = Object.fromEntries(played.map(([t, x]) => [t, x.cap]));
  const picks = Object.fromEntries(played.map(([t, x]) => [t, x.pick]));
  const results = resolve(meta.round, meta.order, caps, picks);
  for (const t of Object.keys(results)) await db.hset(key, 'cap:' + t, caps[t]);
  meta.history.push({ round: meta.round, results });
  const alive = Object.values(caps).filter((c) => c > 0).length;
  meta.phase = meta.round === ROUNDS.length - 1 || alive === 0 ? 'final' : 'reveal';
  await db.hset(key, 'meta', JSON.stringify(meta));
  return true;
}

// Revelado automático: se acabó el tiempo o todos los equipos vivos ya decidieron.
async function maybeReveal(key, s) {
  if (s.meta.phase !== 'decide') return s;
  const alive = Object.values(s.teams).filter((t) => t.cap > 0 && t.claimed);
  if (Date.now() < s.meta.deadline && !alive.every((t) => t.pick)) return s;
  await doReveal(key, s);
  return load(key.slice(5));
}

// ---------- handler ----------
const bad = (res, code, error) => res.status(code).json({ error });

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { room, team, token } = req.query;
      let s = room && (await load(room.toUpperCase()));
      if (!s) return bad(res, 404, 'Partida no encontrada');
      s = await maybeReveal('room:' + room.toUpperCase(), s);
      const who = token === s.meta.hostToken ? 'host' : team && s.teams[team]?.tok === token ? team : null;
      return res.json(view(s, who));
    }
    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    if (b.action === 'create') {
      if (String(b.pin || '') !== HOST_PIN) return bad(res, 403, 'PIN incorrecto');
      const room = rand(4), hostToken = rand(16);
      const meta = { round: 0, phase: 'lobby', order: newOrder(), hostToken, history: [] };
      await db.hset('room:' + room, 'meta', JSON.stringify(meta));
      return res.json({ room, hostToken });
    }

    const room = String(b.room || '').toUpperCase();
    const s = await load(room);
    if (!s) return bad(res, 404, 'Partida no encontrada');
    const { meta, teams } = s;
    const key = 'room:' + room;

    if (b.action === 'join') {
      if (!teams[b.team]) return bad(res, 400, 'Equipo inválido');
      const token = rand(16);
      if (await db.hsetnx(key, 'tok:' + b.team, token)) return res.json({ token });
      if (b.token && b.token === teams[b.team].tok) return res.json({ token: b.token }); // reconexión
      return bad(res, 409, 'Ese equipo ya fue tomado por otro dispositivo');
    }

    if (b.action === 'choose') {
      const t = teams[b.team];
      if (!t || t.tok !== b.token) return bad(res, 403, 'Sin permiso');
      if (meta.phase !== 'decide') return bad(res, 400, 'La ronda no está abierta');
      if (t.cap <= 0) return bad(res, 400, 'Tu empresa quebró');
      if (!L.includes(b.letter)) return bad(res, 400, 'Opción inválida');
      await db.hset(key, `ch:${b.team}:${meta.round}`, b.letter);
      await maybeReveal(key, await load(room));
      return res.json({ ok: true });
    }

    // acciones del docente
    if (b.hostToken !== meta.hostToken) return bad(res, 403, 'Solo el docente');
    if (b.action === 'start' || b.action === 'next') {
      if (b.action === 'start' ? meta.phase !== 'lobby' : meta.phase !== 'reveal') return bad(res, 400, 'Acción no válida ahora');
      if (b.action === 'next') meta.round++;
      meta.phase = 'decide';
      meta.deadline = Date.now() + ROUND_MS;
    } else if (b.action === 'reveal') {
      if (!(await doReveal(key, s))) return bad(res, 400, 'Acción no válida ahora');
      return res.json({ ok: true });
    } else return bad(res, 400, 'Acción desconocida');
    await db.hset(key, 'meta', JSON.stringify(meta));
    return res.json({ ok: true });
  } catch (e) {
    return bad(res, 500, e.message);
  }
}
