#!/usr/bin/env bash
# Toda pagina que use style.css tiene que cargar theme.js y tener el boton:
# si no, la pagina se queda en oscuro aunque el usuario haya elegido claro.
set -u
cd "$(dirname "$0")/.."
fail=0
for f in $(grep -rl "css/style.css" --include='*.html' .); do
  grep -q "js/theme.js" "$f"    || { echo "FALTA theme.js: $f"; fail=1; }
  grep -q "class=\"theme-toggle\"" "$f" || { echo "FALTA .theme-toggle: $f"; fail=1; }
done
[ $fail -eq 0 ] && echo "theme wiring OK"
exit $fail
