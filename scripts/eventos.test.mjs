// node scripts/eventos.test.mjs — sin red; falla si se rompe el parseo, el filtro de ciudad o el escape.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { city, parseEvent, article, region, valid } from './eventos.mjs';

const ld = (o) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [o] })}</script>`;
const url = 'https://www.tuboleta.com/es/eventos/x';

assert.equal(city('Bogotá D.C.'), 'Bogotá');
assert.equal(city('MEDELLIN'), 'Medellín');
assert.equal(city('Cali'), null);

const ev = parseEvent(ld({ '@type': 'Event', name: 'A &amp; B', startDate: '2027-02-01T20:00:00-0500', location: { name: 'Bogotá' } }), url);
assert.deepEqual(ev, { url, nombre: 'A & B', inicio: '2027-02-01', fin: '2027-02-01', ciudad: 'Bogotá', fuente: 'Tuboleta' });
assert.equal(parseEvent(ld({ '@type': 'Event', name: 'x', startDate: 'mañana', location: { name: 'Bogotá' } }), url), null);
assert.equal(parseEvent(ld({ '@type': 'Event', name: 'x', startDate: '2027-02-01', location: { name: 'Cali' } }), url), null);
assert.equal(parseEvent('<p>sin JSON-LD</p>', url), null);

assert.ok(valid(ev));
assert.ok(!valid({ ...ev, url: 'javascript:alert(1)' }), 'eventos.json manipulado: enlace ajeno');
assert.ok(!valid({ ...ev, inicio: '2027-01-01" onmouseover="x' }), 'eventos.json manipulado: fecha');
assert.ok(!valid({ ...ev, ciudad: 'Cali' }));

const html = article({ ...ev, nombre: '<script>alert(1)</script>' });
assert.ok(!html.includes('<script>'), 'el nombre de terceros se escapa');
assert.ok(html.includes('class="blog-post__title"'), 'cover.js necesita el título');

const blog = await readFile(new URL('../blog.html', import.meta.url), 'utf8');
const once = region(blog, 'grid', html);
assert.equal(region(once, 'grid', ''), blog, 'reescribir la región es idempotente');
console.log('ok');
