// Trae eventos de Tuboleta (sitemap + JSON-LD schema.org/Event) y los escribe
// en blog.html entre los comentarios <!-- eventos:auto:* -->, más eventos.json.
// Lo corre .github/workflows/pages.yml. Sin dependencias, Node >= 18.
//
//   node scripts/eventos.mjs            # scrapea (cron / manual)
//   SCRAPE=0 node scripts/eventos.mjs   # solo re-pinta desde el eventos.json publicado (push)
//   MAX=5 node scripts/eventos.mjs      # prueba local con pocas fichas
//
// Solo se guardan hechos (nombre, fechas, ciudad, enlace); ni textos ni imágenes de Tuboleta.
// ponytail: regex sobre el sitemap y el JSON-LD en vez de un parser; basta mientras Tuboleta use Drupal + schema.org
import { readFile, writeFile } from 'node:fs/promises';

const SITE = 'https://citystream.tech/eventos.json';
const SITEMAP = 'https://www.tuboleta.com/sitemap.xml';
const PREFIX = 'https://www.tuboleta.com/es/eventos/';
const UA = { 'user-agent': 'CityStreamBot/1.0 (+https://citystream.tech)' };
const SCRAPE = process.env.SCRAPE !== '0';
const MAX = Number(process.env.MAX || 120); // fichas por run: el primer run tiene ~500
const GRID = 9; // eventos automáticos en la cuadrícula
const RANK = 5; // y en "Próximas fechas"
const CITIES = { bogota: 'Bogotá', medellin: 'Medellín', cartagena: 'Cartagena' };
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIA = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (url) => fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const unesc = (s) => String(s).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }); // YYYY-MM-DD

export function city(name) {
  const key = String(name).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const hit = Object.keys(CITIES).find((c) => key === c || key.startsWith(`${c} `) || key.startsWith(`${c},`));
  return hit ? CITIES[hit] : null;
}

// Las mismas reglas para lo recién leído y para lo que vuelve del eventos.json publicado
export const valid = (e) => Boolean(e) && typeof e.url === 'string' && e.url.startsWith(PREFIX)
  && FECHA.test(e.inicio) && FECHA.test(e.fin) && Object.values(CITIES).includes(e.ciudad)
  && typeof e.nombre === 'string' && e.nombre.length > 0 && e.nombre.length <= 120;

// Ficha HTML -> evento o null
export function parseEvent(html, url) {
  for (const [, raw] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(raw); } catch { continue; }
    const ev = [data, ...(data['@graph'] || [])].find((n) => n && n['@type'] === 'Event');
    if (!ev) continue;
    const inicio = String(ev.startDate || '').slice(0, 10);
    const fin = String(ev.endDate || ev.startDate || '').slice(0, 10);
    const ciudad = city(ev.location?.name || '');
    if (!FECHA.test(inicio) || !FECHA.test(fin) || !ciudad || !ev.name) return null;
    return { url, nombre: unesc(ev.name).trim().replace(/[\s:–-]+$/, '').slice(0, 120), inicio, fin: fin < inicio ? inicio : fin, ciudad, fuente: 'Tuboleta' };
  }
  return null;
}

function cuando({ inicio, fin }) {
  const [a, b] = [inicio, fin].map((d) => new Date(`${d}T12:00:00Z`));
  const d = (x) => x.getUTCDate();
  const m = (x) => MES[x.getUTCMonth()];
  const y = (x) => x.getUTCFullYear();
  if (inicio === fin) return { meta: `${d(a)} ${m(a)} ${y(a)}`, big: d(a), mes: m(a), small: `${DIA[a.getUTCDay()]} · ${y(a)}` };
  if (m(a) === m(b) && y(a) === y(b)) return { meta: `${d(a)}–${d(b)} ${m(a)} ${y(a)}`, big: `${d(a)}–${d(b)}`, mes: m(a), small: y(a) };
  return { meta: `${d(a)} ${m(a)} – ${d(b)} ${m(b)} ${y(b)}`, big: d(a), mes: m(a), small: y(a) };
}

export function article(e) {
  const w = cuando(e);
  const c = esc(e.ciudad);
  return `        <article class="blog-post" data-city="${c}" data-kind="evento" data-date="${e.inicio}" data-end="${e.fin}">
          <div class="blog-date" aria-hidden="true"><b>${w.big}</b><span>${w.mes}</span><small>${w.small}</small></div>
          <div class="blog-post__img">
          </div>
          <div class="blog-post__body">
            <div class="blog-meta"><span class="blog-chip">Evento</span><span>${c} · ${w.meta}</span></div>
            <h2 class="blog-post__title"><a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${esc(e.nombre)}</a></h2>
            <p class="blog-post__text">Fechas, boletas y detalles en Tuboleta.</p>
            <dl class="blog-facts"><div><dt>Ciudad</dt><dd>${c}</dd></div><div><dt>Fuente</dt><dd>Tuboleta</dd></div></dl>
            <span class="blog-cta" aria-hidden="true">Ver en Tuboleta <i class="ri-arrow-right-line"></i></span>
          </div>
        </article>`;
}

function rankItem(e) {
  return `        <li data-date="${e.inicio}" data-end="${e.fin}">
          <span class="blog-rank__n" aria-hidden="true"></span>
          <div><a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${esc(e.nombre)}</a><small>${esc(e.ciudad)} · <span class="blog-rank__when">${cuando(e).meta}</span></small></div>
        </li>`;
}

export function region(html, name, body) {
  const re = new RegExp(`(<!-- eventos:auto:${name} -->)[\\s\\S]*?(\\s*<!-- /eventos:auto:${name} -->)`);
  if (!re.test(html)) throw new Error(`blog.html sin la región eventos:auto:${name}`);
  return html.replace(re, (_, open, close) => `${open}${body ? `\n${body}` : ''}${close}`);
}

async function scrape(prev) {
  const xml = await (await get(SITEMAP)).text();
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map(([, block]) => ({ loc: (block.match(/<loc>([^<]+)<\/loc>/)?.[1] || '').trim(), lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || '' }))
    .filter(({ loc }) => loc.startsWith(PREFIX));
  if (!urls.length) throw new Error('sitemap sin /es/eventos/');
  const pending = urls
    .filter(({ loc, lastmod }) => prev.vistos[loc] !== lastmod)
    .sort((a, b) => Date.parse(b.lastmod || 0) - Date.parse(a.lastmod || 0)) // lo recién cambiado primero
    .slice(0, MAX);
  const found = [];
  for (const { loc, lastmod } of pending) {
    try {
      const res = await get(loc);
      if (res.status === 403 || res.status === 429) { console.warn(`Tuboleta respondió ${res.status}; paro`); break; }
      if (res.ok) {
        const ev = parseEvent(await res.text(), loc);
        if (ev) found.push(ev);
      }
      prev.vistos[loc] = lastmod; // también las descartadas, para no volver a pedirlas
    } catch (err) {
      console.warn(`${loc}: ${err.message}`);
    }
    await sleep(1000);
  }
  console.log(`${urls.length} fichas en el sitemap, ${pending.length} revisadas, ${found.length} eventos válidos`);
  return found;
}

async function main() {
  const empty = { eventos: [], vistos: {} };
  const prev = await get(SITE).then((r) => (r.ok ? r.json() : empty)).catch(() => empty);
  prev.vistos ||= {};
  let found = [];
  if (SCRAPE) {
    try { found = await scrape(prev); } catch (err) { console.warn(`Sin datos nuevos: ${err.message}`); }
  }

  const old = Array.isArray(prev.eventos) ? prev.eventos.filter(valid) : []; // lo publicado también se revalida
  const byUrl = new Map([...old, ...found].map((e) => [e.url, e]));
  const html = await readFile('blog.html', 'utf8');
  const curated = html.replace(/<!-- eventos:auto:(\w+) -->[\s\S]*?<!-- \/eventos:auto:\1 -->/g, '');
  const eventos = [...byUrl.values()]
    .filter((e) => e.fin >= today && !curated.includes(e.url))
    .sort((a, b) => a.inicio.localeCompare(b.inicio) || a.nombre.localeCompare(b.nombre));

  let out = region(html, 'grid', eventos.slice(0, GRID).map(article).join('\n'));
  out = region(out, 'rank', eventos.slice(0, RANK).map(rankItem).join('\n'));
  await writeFile('blog.html', out);
  await writeFile('eventos.json', `${JSON.stringify({ generado: new Date().toISOString(), eventos, vistos: prev.vistos }, null, 1)}\n`);
  console.log(`${eventos.length} eventos próximos; ${Math.min(eventos.length, GRID)} en el blog`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
