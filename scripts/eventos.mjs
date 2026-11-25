// Trae eventos de Tuboleta (sitemap + JSON-LD schema.org/Event) y los escribe
// en blog.html entre los comentarios <!-- eventos:auto:* -->, más eventos.json.
// Lo corre .github/workflows/pages.yml. Sin dependencias, Node >= 18.
//
//   node scripts/eventos.mjs            # scrapea (cron / manual)
//   SCRAPE=0 node scripts/eventos.mjs   # solo re-pinta desde el eventos.json publicado (push)
//   MAX=5 node scripts/eventos.mjs      # prueba local con pocas fichas (no hagas commit de blog.html así)
//
// Solo se guardan hechos (nombre, fechas, ciudad, enlace); ni textos ni imágenes de Tuboleta.
// ponytail: regex sobre el sitemap y el JSON-LD en vez de un parser; basta mientras Tuboleta use Drupal + schema.org
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const SITE = 'https://citystream.tech/eventos.json';
const SITEMAP = 'https://www.tuboleta.com/sitemap.xml';
const PREFIX = 'https://www.tuboleta.com/es/eventos/';
const UA = { 'user-agent': 'CityStreamBot/1.0 (+https://citystream.tech)' };
const SCRAPE = process.env.SCRAPE !== '0';
const MAX = Number(process.env.MAX || 120); // fichas por run: el primer run tiene ~500
const BUDGET = 8 * 60e3; // el job tiene 15 min: el scrape para a los 8 y publica lo que lleve
const GRID = 9; // eventos automáticos en la cuadrícula
const RANK = 5; // y en "Próximas fechas"
const CITIES = { bogota: 'Bogotá', medellin: 'Medellín', cartagena: 'Cartagena' };
const FORMA = /^\d{4}-\d{2}-\d{2}$/;
// AAAA-MM-DD que existe en el calendario (2027-02-30 no)
const FECHA = {
  test: (d) => {
    if (typeof d !== 'string' || !FORMA.test(d)) return false;
    const t = Date.parse(`${d}T12:00:00Z`);
    return !Number.isNaN(t) && new Date(t).toISOString().slice(0, 10) === d;
  },
};
const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIA = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (url) => fetch(url, { headers: UA, signal: AbortSignal.timeout(15000) });
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
// Entidades HTML en una sola pasada (así "&amp;quot;" queda "&quot;", no '"'): numéricas y las del español
const NAMED = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', iexcl: '¡', iquest: '¿', laquo: '«', raquo: '»', ntilde: 'ñ', Ntilde: 'Ñ', uuml: 'ü', Uuml: 'Ü' };
for (const v of 'aeiouAEIOU') NAMED[`${v}acute`] = `${v}\u0301`.normalize('NFC');
const unesc = (s) => String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, k) => {
  if (k[0] !== '#') return NAMED[k] ?? m;
  const n = k[1] === 'x' || k[1] === 'X' ? parseInt(k.slice(2), 16) : Number(k.slice(1));
  return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : m;
});
// name en JSON-LD puede ser texto, lista o {"@value": …}
const text = (v) => (typeof v === 'string' ? v : Array.isArray(v) ? text(v.find((x) => text(x))) : typeof v?.['@value'] === 'string' ? v['@value'] : '');
const plain = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const key = (s) => plain(s).replace(/[^a-z0-9]+/g, ' ').trim();
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }); // YYYY-MM-DD

// La ciudad como palabra en cualquier parte del texto: "Bogotá D.C.", "Teatro Colsubsidio, Bogotá"
export function city(name) {
  const k = ` ${key(name)} `;
  const hit = Object.keys(CITIES).find((c) => k.includes(` ${c} `));
  return hit ? CITIES[hit] : null;
}

// location puede ser City, Place con address, texto o una lista de ellos
function cityOf(location) {
  for (const loc of [].concat(location || [])) {
    const a = typeof loc === 'object' && loc ? loc.address : null;
    const texts = typeof loc === 'string' ? [loc] : [loc?.name, ...(typeof a === 'string' ? [a] : [a?.addressLocality, a?.addressRegion])];
    for (const t of texts) if (typeof t === 'string' && city(t)) return city(t);
  }
  return null;
}

// Las mismas reglas para lo recién leído y para lo que vuelve del eventos.json publicado
export const valid = (e) => Boolean(e) && typeof e.url === 'string' && e.url.startsWith(PREFIX)
  && FECHA.test(e.inicio) && FECHA.test(e.fin) && Object.values(CITIES).includes(e.ciudad)
  && typeof e.nombre === 'string' && e.nombre.length > 0 && e.nombre.length <= 120;

// Event y sus subtipos de schema.org (MusicEvent, TheaterEvent, Festival…), también en lista
const isEvent = (n) => Boolean(n) && [].concat(n['@type']).some((t) => typeof t === 'string' && (/Event$/.test(t) || t === 'Festival'));

// Fecha de schema.org -> YYYY-MM-DD en Bogotá. Con zona horaria (Z, -05:00, -0500) se convierte:
// las 8 p. m. de Bogotá en UTC ya son el día siguiente. Sin zona se toma tal cual.
export function day(value) {
  const s = String(value || '').trim();
  if (!/T.*(Z|[+-]\d{2}:?\d{2})$/.test(s)) return s.slice(0, 10);
  const t = Date.parse(s.replace(/([+-]\d{2})(\d{2})$/, '$1:$2'));
  return Number.isNaN(t) ? s.slice(0, 10) : new Date(t).toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
}

// Ficha HTML -> evento válido | null (hay Event pero no pasa: otra ciudad, sin fecha…)
// | undefined (no hay datos de Event: página que no es evento, o HTML que cambió o reto anti-bot)
export function parseEvent(html, url) {
  for (const [, raw] of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(raw); } catch { continue; }
    if (!data || typeof data !== 'object') continue;
    const nodes = Array.isArray(data) ? data : [data, ...[].concat(data['@graph'] || [])];
    const ev = nodes.find(isEvent);
    if (!ev) continue;
    const inicio = day(ev.startDate);
    const fin = day(ev.endDate);
    const e = {
      url,
      nombre: unesc(text(ev.name)).trim().replace(/[\s:–-]+$/, '').slice(0, 120),
      inicio,
      fin: FECHA.test(fin) && fin >= inicio ? fin : inicio, // "Por confirmar" o anterior al inicio -> un solo día
      ciudad: cityOf(ev.location),
      fuente: 'Tuboleta',
    };
    return valid(e) ? e : null;
  }
  return undefined;
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

// ¿Ya está a mano en blog.html? Por enlace exacto o porque el nombre contiene
// el título de un evento curado (las guías no cuentan)
export function curatedBy(html) {
  const curated = html.replace(/<!-- eventos:auto:(\w+) -->[\s\S]*?<!-- \/eventos:auto:\1 -->/g, '');
  const hrefs = new Set([...curated.matchAll(/href="([^"]+)"/g)].map(([, h]) => unesc(h)));
  const titles = [...curated.matchAll(/<article[^>]*data-kind="evento"[\s\S]*?<\/article>/g)]
    .map(([block]) => key(unesc(block.match(/class="blog-post__title">(?:<a[^>]*>)?([^<]+)/)?.[1] || '')))
    .filter((t) => t.length >= 8);
  return (e) => hrefs.has(e.url) || titles.some((t) => ` ${key(e.nombre)} `.includes(` ${t} `));
}

// El estado vive en el sitio publicado; se pide saltando la caché del CDN (max-age=600),
// o un push justo después de un cron publicaría el estado anterior.
// 404 = nunca se publicó: solo se acepta con INIT=1 (ejecución manual). En cron o push,
// un 404 o cualquier otro fallo detiene el build: mejor dejar el sitio como está que vaciarlo.
async function loadState() {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(`${SITE}?t=${Date.now()}`, { headers: { ...UA, 'cache-control': 'no-cache' }, signal: AbortSignal.timeout(15000) });
      if (r.status === 404 && process.env.INIT === '1') return { eventos: [], vistos: {} };
      if (!r.ok) throw new Error(`HTTP ${r.status}${r.status === 404 ? ' (primer run: lánzalo a mano desde Actions)' : ''}`);
      const data = await r.json();
      return { eventos: Array.isArray(data.eventos) ? data.eventos : [], vistos: data.vistos && typeof data.vistos === 'object' ? data.vistos : {} };
    } catch (err) {
      if (i === 3) throw new Error(`No se pudo leer ${SITE}: ${err.message}`);
      await sleep(5000);
    }
  }
}

async function scrape(state) {
  const deadline = Date.now() + BUDGET;
  const res0 = await get(SITEMAP);
  if (!res0.ok) throw new Error(`sitemap: HTTP ${res0.status}`);
  const xml = await res0.text();
  // Si Drupal parte el sitemap en varios (sitemapindex), este script no lo sabe leer: mejor no tocar nada
  if (/<sitemapindex/.test(xml)) throw new Error('el sitemap ahora es un índice de varios sitemaps: hay que adaptar el script');
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map(([, block]) => ({ loc: (block.match(/<loc>([^<]+)<\/loc>/)?.[1] || '').trim(), lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || '' }))
    .filter(({ loc }) => loc.startsWith(PREFIX));
  if (!urls.length) throw new Error('sitemap sin /es/eventos/');
  const live = new Set(urls.map(({ loc }) => loc));
  const known = Object.keys(state.vistos).length;
  if (known && live.size < known / 2) throw new Error(`sitemap incompleto: ${live.size} fichas frente a ${known} conocidas`);
  for (const loc of Object.keys(state.vistos)) if (!live.has(loc)) delete state.vistos[loc]; // fuera del sitemap: se olvida
  // Se quitan del blog: fichas que salieron del sitemap (canceladas) y las revisadas de nuevo que
  // están borradas (404/410) o cuyo Event ya no pasa (otra ciudad, sin fecha)
  const gone = new Set(state.eventos.map((e) => e.url).filter((u) => !live.has(u)));
  const time = (m) => Date.parse(m) || 0; // sin lastmod: al final
  const pending = urls
    .filter(({ loc, lastmod }) => state.vistos[loc] !== lastmod)
    .sort((a, b) => time(b.lastmod) - time(a.lastmod)) // lo recién cambiado primero
    .slice(0, MAX);
  const found = [];
  let done = 0;
  let odd = 0; // respuestas 200 seguidas que no parecen de Tuboleta (reto anti-bot)
  for (const { loc, lastmod } of pending) {
    if (Date.now() > deadline) { console.warn('Se acabó el tiempo del run; sigue en el próximo'); break; }
    try {
      const res = await get(loc);
      if (res.status === 403 || res.status === 429) { console.warn(`Tuboleta respondió ${res.status}; paro`); break; }
      // Vista = leída o borrada. Un 5xx se reintenta en el próximo run.
      if (res.status === 404 || res.status === 410) {
        gone.add(loc);
        state.vistos[loc] = lastmod;
      } else if (res.ok) {
        const html = await res.text();
        const ev = parseEvent(html, loc);
        if (ev) found.push(ev);
        else if (ev === null) gone.add(loc);
        // Sin datos de Event: si es una página real de Tuboleta (redirige a otra sección, como
        // /es/eventos/parquea-tuboleta, o se enlaza a sí misma) no es un evento y se marca vista.
        // Si no, puede ser un reto anti-bot o HTML cambiado: no se marca, el evento publicado
        // se conserva y se vuelve a pedir. 5 seguidas así = paro, como con 403/429.
        const real = ev !== undefined || (res.redirected && new URL(res.url).hostname.endsWith('tuboleta.com')) || html.includes(`href="${loc}"`);
        if (real) {
          state.vistos[loc] = lastmod;
          odd = 0;
        } else if (++odd >= 5) {
          console.warn('5 páginas seguidas sin datos de Tuboleta (¿reto anti-bot?); paro');
          break;
        }
      }
      done += 1;
    } catch (err) {
      console.warn(`${loc}: ${err.message}`);
    }
    await sleep(1000);
  }
  console.log(`${urls.length} fichas en el sitemap, ${done}/${pending.length} revisadas, ${found.length} eventos válidos`);
  return { found, gone };
}

async function main() {
  const state = await loadState();
  let found = [];
  let gone = new Set();
  if (SCRAPE) {
    try { ({ found, gone } = await scrape(state)); } catch (err) { console.warn(`Sin datos nuevos: ${err.message}`); }
  }

  const old = state.eventos.filter((e) => valid(e) && !gone.has(e.url)); // lo publicado también se revalida
  const eventos = [...new Map([...old, ...found].map((e) => [e.url, e])).values()]
    .filter((e) => e.fin >= today)
    .sort((a, b) => a.inicio.localeCompare(b.inicio) || a.nombre.localeCompare(b.nombre));

  // eventos.json guarda todo lo próximo; solo al pintar se quita lo que ya está a mano
  const html = await readFile('blog.html', 'utf8');
  const isCurated = curatedBy(html);
  const shown = eventos.filter((e) => !isCurated(e));
  let out = region(html, 'grid', shown.slice(0, GRID).map(article).join('\n'));
  out = region(out, 'rank', shown.slice(0, RANK).map(rankItem).join('\n'));
  await writeFile('blog.html', out);
  await writeFile('eventos.json', `${JSON.stringify({ generado: new Date().toISOString(), eventos, vistos: state.vistos }, null, 1)}\n`);
  console.log(`${eventos.length} eventos próximos; ${Math.min(shown.length, GRID)} en el blog`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
