import http from 'node:http';
import fs from 'node:fs';
import h from './api/game.js';
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/api/game') {
    let body = ''; for await (const c of req) body += c;
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (j) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(j)); };
    return h({ method: req.method, body, query: Object.fromEntries(u.searchParams) }, res);
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(fs.readFileSync(new URL('./index.html', import.meta.url)));
}).listen(3000, '0.0.0.0', () => console.log('http://localhost:3000'));
