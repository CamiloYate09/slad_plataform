// node scripts/eventos.test.mjs — sin red; falla si se rompe el parseo, el filtro de ciudad, el escape o los duplicados.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { city, parseEvent, article, region, valid, curatedBy } from './eventos.mjs';

const ld = (o) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [o] })}</script>`;
const url = 'https://www.tuboleta.com/es/eventos/x';
const base = { name: 'Concierto', startDate: '2027-02-01', location: { name: 'Bogotá' } };

assert.equal(city('Bogotá D.C.'), 'Bogotá');
assert.equal(city('MEDELLIN'), 'Medellín');
assert.equal(city('Cali'), null);

const ev = parseEvent(ld({ ...base, '@type': 'Event', name: 'A &amp; B', startDate: '2027-02-01T20:00:00-0500' }), url);
assert.deepEqual(ev, { url, nombre: 'A & B', inicio: '2027-02-01', fin: '2027-02-01', ciudad: 'Bogotá', fuente: 'Tuboleta' });
assert.ok(parseEvent(ld({ ...base, '@type': 'MusicEvent' }), url), 'subtipos de Event');
assert.ok(parseEvent(ld({ ...base, '@type': ['Festival'] }), url), '@type en lista');
assert.equal(parseEvent(ld({ ...base, '@type': 'Place' }), url), null);
assert.equal(parseEvent(ld({ ...base, '@type': 'Event', startDate: 'mañana' }), url), null);
assert.equal(parseEvent(ld({ ...base, '@type': 'Event', location: { name: 'Cali' } }), url), null);
assert.equal(parseEvent(ld({ ...base, '@type': 'Event', name: ' - ' }), url), null, 'nombre vacío tras limpiar');
assert.equal(parseEvent('<p>sin JSON-LD</p>', url), null);

assert.ok(valid(ev));
assert.ok(!valid({ ...ev, url: 'javascript:alert(1)' }), 'eventos.json manipulado: enlace ajeno');
assert.ok(!valid({ ...ev, inicio: '2027-01-01" onmouseover="x' }), 'eventos.json manipulado: fecha');
assert.ok(!valid({ ...ev, ciudad: 'Cali' }));

const html = article({ ...ev, nombre: '<script>alert(1)</script>' });
assert.ok(!html.includes('<script>'), 'el nombre de terceros se escapa');
assert.ok(html.includes('class="blog-post__title"'), 'cover.js necesita el título');

const page = `<h2 class="blog-post__title"><a href="https://www.hayfestival.com/cartagena">Hay Festival Cartagena</a></h2>
  <!-- eventos:auto:grid -->
  <!-- /eventos:auto:grid -->`;
const isCurated = curatedBy(page);
assert.ok(isCurated({ ...ev, nombre: 'HAY FESTIVAL CARTAGENA 2027' }), 'duplicado de un curado por nombre');
assert.ok(!isCurated({ ...ev, nombre: 'Rock en Cartagena' }));
assert.equal(region(region(page, 'grid', html), 'grid', ''), page, 'reescribir la región es idempotente');

const blog = await readFile(new URL('../blog.html', import.meta.url), 'utf8');
region(region(blog, 'grid', ''), 'rank', ''); // lanza si falta alguna región
console.log('ok');
