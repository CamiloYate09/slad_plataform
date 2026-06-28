#!/usr/bin/env bash
# ============================================================
#  convert-to-avif.sh
#  Convierte todas las JPG/PNG en static/img/ a AVIF (q=50).
#  Mantiene WebP y JPG existentes como fallback en <picture>.
#
#  Pre-requisito:
#    macOS: brew install libavif
#    Linux: apt-get install libavif-bin    (o equivalente)
# ============================================================
set -euo pipefail

if ! command -v avifenc >/dev/null 2>&1; then
  echo "[error] avifenc no encontrado. Instala con: brew install libavif"
  exit 1
fi

cd "$(dirname "$0")/../static/img"

shopt -s nullglob
count=0
for src in *.jpg *.png; do
  [[ -f "$src" ]] || continue
  base="${src%.*}"
  out="${base}.avif"
  if [[ -f "$out" && "$out" -nt "$src" ]]; then
    echo "[skip] $out ya existe y es mas reciente que $src"
    continue
  fi
  echo "[encode] $src -> $out"
  avifenc \
    --min 30 --max 50 \
    --speed 4 \
    --jobs 4 \
    "$src" "$out" >/dev/null
  count=$((count + 1))
done

echo ""
echo "[done] $count imagenes convertidas. Total AVIF en static/img/:"
ls -1 static/img/*.avif 2>/dev/null | wc -l
