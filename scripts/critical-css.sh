#!/usr/bin/env bash
# ============================================================
#  critical-css.sh
#  Extrae el CSS critico (lo visible sin scroll, mobile y
#  desktop) de static/css/style.css y lo inyecta inline en
#  index.html entre <!-- critical:start --> y <!-- critical:end -->.
#  style.css se carga al final del <body> para no bloquear el
#  primer paint.
#
#  Ejecutar cada vez que cambie style.css o el hero de index.html:
#    ./scripts/critical-css.sh
#
#  Pre-requisitos: node 18+ y Google Chrome
#  (CHROME_PATH=/ruta/a/chrome si no esta en /usr/bin/google-chrome).
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

PUPPETEER_SKIP_DOWNLOAD=1 npm i --prefix "$TMP" --silent --no-audit --no-fund critical@7.2.1 >/dev/null

PUPPETEER_EXECUTABLE_PATH="${CHROME_PATH:-/usr/bin/google-chrome}" \
node --input-type=module - "$ROOT" "$TMP/node_modules/critical/index.js" <<'EOF'
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const [root, criticalPath] = process.argv.slice(2);
const { generate } = await import(pathToFileURL(criticalPath));

const htmlPath = `${root}/index.html`;
const START = '<!-- critical:start -->';
const END = '<!-- critical:end -->';
const html = readFileSync(htmlPath, 'utf8');
const a = html.indexOf(START), b = html.indexOf(END);
if (a < 0 || b < 0) throw new Error(`index.html no tiene los marcadores ${START} / ${END}`);

const fullCss = readFileSync(`${root}/static/css/style.css`, 'utf8');
// Penthouse descarta los @font-face que se usan via var(--font-*): se copian tal cual.
const fontFaces = (fullCss.match(/@font-face\s*{[^}]*}/g) || [])
  .map((r) => r.replace(/\s+/g, ' ').replaceAll("url('../", "url('static/"))
  .join('');

const { css } = await generate({
  base: root,
  html: html.slice(0, a) + html.slice(b + END.length),
  css: [`${root}/static/css/style.css`],
  dimensions: [{ width: 390, height: 844 }, { width: 1300, height: 900 }],
  // theme.js pone body.light-theme antes del primer paint; penthouse no lo ejecuta.
  include: [/\.light-theme\b/],
});

const block = `${START}\n  <style>${fontFaces}${css.replace(/@font-face\s*{[^}]*}/g, '')}</style>\n  `;
writeFileSync(htmlPath, html.slice(0, a) + block + html.slice(b));
console.log(`critical CSS: ${(fontFaces.length + css.length) / 1024 | 0} KB inline en index.html`);
EOF
