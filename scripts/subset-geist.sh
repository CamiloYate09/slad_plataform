#!/usr/bin/env bash
# ============================================================
#  subset-geist.sh
#  Genera subset latin de Geist Variable y lo guarda en
#  static/fonts/. Resultado: woff2 con solo glifos
#  latin/latin-ext (sin cirilico/griego/asiatico).
#
#  Pre-requisitos:
#    pip3 install fonttools brotli zopfli
#
#  Geist source: https://github.com/vercel/geist-font
#  Descarga Geist[wght].ttf (variable) y ponlo en /tmp/Geist.ttf
#  o ajusta SRC_FONT abajo.
# ============================================================
set -euo pipefail

SRC_FONT="${1:-/tmp/Geist[wght].ttf}"
OUT_DIR="$(dirname "$0")/../static/fonts"

if ! python3 -c "import fontTools" 2>/dev/null; then
  echo "[error] fontTools no encontrado. Instala con: pip3 install fonttools brotli zopfli"
  exit 1
fi

if [[ ! -f "$SRC_FONT" ]]; then
  echo "[error] No se encontro $SRC_FONT"
  echo "        Descarga Geist desde https://github.com/vercel/geist-font/raw/main/fonts/geist/Geist-Variable.ttf"
  exit 1
fi

mkdir -p "$OUT_DIR"

# Unicode ranges para latin + latin-ext
# Ref: https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap
LATIN_RANGE="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
LATIN_EXT_RANGE="U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"

echo "[subset] Generando latin (Geist-latin.woff2)"
python3 -m fontTools.subset \
  "$SRC_FONT" \
  --unicodes="$LATIN_RANGE" \
  --layout-features='*' \
  --flavor=woff2 \
  --output-file="$OUT_DIR/Geist-latin.woff2"

echo "[subset] Generando latin-ext (Geist-latin-ext.woff2)"
python3 -m fontTools.subset \
  "$SRC_FONT" \
  --unicodes="$LATIN_EXT_RANGE" \
  --layout-features='*' \
  --flavor=woff2 \
  --output-file="$OUT_DIR/Geist-latin-ext.woff2"

echo ""
echo "[done] Subsets generados:"
ls -lh "$OUT_DIR"/Geist-*.woff2

echo ""
echo "[next] Reemplaza en index.html:"
echo "  <link rel='preload' href='static/fonts/Geist-latin.woff2' as='font' type='font/woff2' crossorigin>"
echo ""
echo "[next] Agrega en style.css:"
cat <<'CSS'
@font-face {
  font-family: 'Geist';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('../fonts/Geist-latin.woff2') format('woff2-variations');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+2C60-2C7F;
}
@font-face {
  font-family: 'Geist';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('../fonts/Geist-latin-ext.woff2') format('woff2-variations');
  unicode-range: U+0100-02AF, U+1E00-1E9F, U+2020;
}
CSS
