// node scripts/eventos.test.mjs — sin red; falla si se rompe el parseo, el filtro de ciudad, el escape o los duplicados.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { city, day, parseEvent, article, region, valid, curatedBy } from './eventos.mjs';

const ld = (o) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [o] })}</script>`;
const url = 'https://www.tuboleta.com/es/eventos/x';
const base = { name: 'Concierto', startDate: '2027-02-01', location: { name: 'Bogotá' } };

assert.equal(city('Bogotá D.C.'), 'Bogotá');
assert.equal(city('MEDELLIN'), 'Medellín');
assert.equal(city('Cali'), null);
assert.equal(city('Teatro Colsubsidio, Bogotá'), 'Bogotá');
assert.equal(city('Movistar Arena'), null);

const ev = parseEvent(ld({ ...base, '@type': 'Event', name: 'A &amp; B', startDate: '2027-02-01T20:00:00-0500' }), url);
assert.deepEqual(ev, { url, nombre: 'A & B', inicio: '2027-02-01', fin: '2027-02-01', ciudad: 'Bogotá', fuente: 'Tuboleta' });
assert.ok(parseEvent(ld({ ...base, '@type': 'MusicEvent' }), url), 'subtipos de Event');
assert.ok(parseEvent(ld({ ...base, '@type': ['Festival'] }), url), '@type en lista');
assert.equal(parseEvent(ld({ ...base, '@type': 'Place' }), url), undefined, 'sin Event: no es un evento borrado');
assert.equal(parseEvent(ld({ ...base, '@type': 'Event', startDate: 'mañana' }), url), null);
assert.equal(parseEvent(ld({ ...base, '@type': 'Event', location: { name: 'Cali' } }), url), null);
assert.equal(parseEvent(ld({ ...base, '@type': 'Event', name: ' - ' }), url), null, 'nombre vacío tras limpiar');
assert.equal(parseEvent('<p>sin JSON-LD</p>', url), undefined);
assert.equal(parseEvent('<script type="application/ld+json">null</script>', url), undefined, 'JSON-LD null');
const event = { ...base, '@type': 'Event' };
assert.ok(parseEvent(`<script type="application/ld+json">${JSON.stringify({ '@graph': event })}</script>`, url), '@graph como objeto');
assert.ok(parseEvent(`<script type="application/ld+json">${JSON.stringify([event])}</script>`, url), 'JSON-LD como lista');
assert.ok(parseEvent(`<script data-x="1" type="application/ld+json">${JSON.stringify(event)}</script>`, url), 'script con más atributos');
assert.equal(parseEvent(ld({ ...event, endDate: 'Por confirmar' }), url)?.fin, '2027-02-01', 'fin inválido -> un día');

assert.equal(day('2027-02-02T01:00:00Z'), '2027-02-01', 'UTC -> día en Bogotá');
assert.equal(day('2025-09-20T07:00:00-0500'), '2025-09-20', 'desfase sin dos puntos (Tuboleta)');
assert.equal(day('2027-02-01T23:30:00'), '2027-02-01', 'sin zona: tal cual');
assert.equal(day('2027-02-01'), '2027-02-01');

const nombre = (name) => parseEvent(ld({ ...event, name }), url)?.nombre;
assert.equal(nombre('Canci&oacute;n &ntilde; &#8211; &#xE9;'), 'Canción ñ – é', 'entidades del español y numéricas');
assert.equal(nombre('A &amp;quot; B'), 'A &quot; B', 'una sola pasada');
assert.equal(nombre({ '@value': 'Festival X', '@language': 'es' }), 'Festival X', 'name como objeto');
assert.equal(nombre(['', 'Festival Y']), 'Festival Y', 'name como lista');
assert.equal(parseEvent(ld({ ...event, name: { foo: 1 } }), url), null, 'name sin texto');
assert.equal(parseEvent(ld({ ...event, startDate: '2027-02-30' }), url), null, 'fecha que no existe');
assert.ok(!valid({ ...ev, fin: '2027-13-01' }));
const venue = { '@type': 'Place', name: 'Movistar Arena', address: { addressLocality: 'Bogotá D.C.' } };
assert.equal(parseEvent(ld({ ...base, '@type': 'Event', location: venue }), url)?.ciudad, 'Bogotá', 'ciudad en address');
assert.equal(parseEvent(ld({ ...base, '@type': 'Event', location: [venue] }), url)?.ciudad, 'Bogotá', 'location en lista');

assert.ok(valid(ev));
assert.ok(!valid({ ...ev, url: 'javascript:alert(1)' }), 'eventos.json manipulado: enlace ajeno');
assert.ok(!valid({ ...ev, inicio: '2027-01-01" onmouseover="x' }), 'eventos.json manipulado: fecha');
assert.ok(!valid({ ...ev, ciudad: 'Cali' }));

const html = article({ ...ev, nombre: '<script>alert(1)</script>' });
assert.ok(!html.includes('<script>'), 'el nombre de terceros se escapa');
assert.ok(html.includes('class="blog-post__title"'), 'cover.js necesita el título');

const page = `<article class="blog-post" data-kind="evento"><h2 class="blog-post__title"><a href="${url}-largo">Hay Festival Cartagena</a></h2></article>
  <article class="blog-post" data-kind="evento"><h2 class="blog-post__title">Rock &amp; Roll Fest</h2></article>
  <article class="blog-post" data-kind="guía"><h2 class="blog-post__title">Amanecer en Monserrate</h2></article>
  <!-- eventos:auto:grid -->
  <!-- /eventos:auto:grid -->`;
const isCurated = curatedBy(page);
assert.ok(isCurated({ ...ev, nombre: 'HAY FESTIVAL CARTAGENA 2027' }), 'duplicado de un curado por nombre');
assert.ok(!isCurated({ ...ev, nombre: 'Rock en Cartagena' }));
assert.ok(isCurated({ ...ev, url: `${url}-largo`, nombre: 'Otro' }), 'mismo enlace exacto');
assert.ok(!isCurated(ev), 'un enlace que es prefijo de otro no cuenta');
assert.ok(!isCurated({ ...ev, nombre: 'Concierto Amanecer en Monserrate' }), 'las guías no cuentan');
assert.ok(isCurated({ ...ev, nombre: 'Rock & Roll Fest 2027' }), 'título curado con &amp;');
const pasado = curatedBy(`<article class="blog-post" data-kind="evento" data-date="2020-01-01" data-end="2020-01-02"><h2 class="blog-post__title">Hay Festival Cartagena</h2></article>`);
assert.ok(!pasado({ ...ev, nombre: 'Hay Festival Cartagena 2028' }), 'un curado terminado no tapa la edición nueva');
assert.equal(region(region(page, 'grid', html), 'grid', ''), page, 'reescribir la región es idempotente');

const blog = await readFile(new URL('../blog.html', import.meta.url), 'utf8');
region(region(blog, 'grid', ''), 'rank', ''); // lanza si falta alguna región
console.log('ok');
