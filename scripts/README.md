# scripts/

Scripts locales para tareas de la **Fase 1** de `add-launch-readiness-2026` que requieren binarios no instalados en este entorno.

## 1. AVIF — convertir imagenes (`convert-to-avif.sh`)

Convierte todas las `.jpg`/`.png` en `static/img/` a `.avif` con q=50.

```bash
# Pre-requisito (macOS):
brew install libavif

# Ejecutar:
./scripts/convert-to-avif.sh
```

**Despues de ejecutar**: edita `index.html` y agrega un `<source type="image/avif">` antes de cada `<source type="image/webp">` en los `<picture>`. Patron:

```html
<picture>
  <source srcset="static/img/img-01.avif" type="image/avif" />
  <source srcset="static/img/img-01.webp" type="image/webp" />
  <img src="static/img/img-01.jpg" alt="..." />
</picture>
```

## 2. Geist font subset (`subset-geist.sh`)

Genera subset latin/latin-ext de Geist Variable y los guarda en `static/fonts/`.

```bash
# Pre-requisitos:
pip3 install fonttools brotli zopfli

# Descarga Geist Variable:
curl -L -o /tmp/'Geist[wght].ttf' \
  https://github.com/vercel/geist-font/raw/main/fonts/geist/Geist-Variable.ttf

# Ejecutar:
./scripts/subset-geist.sh
```

**Despues de ejecutar**:

1. En `index.html`, eliminar las 3 lineas que cargan Geist desde Google Fonts (preconnect, preload, link rel=stylesheet).
2. Agregar:
   ```html
   <link rel="preload" href="static/fonts/Geist-latin.woff2" as="font" type="font/woff2" crossorigin />
   ```
3. En `static/css/style.css`, agregar las dos reglas `@font-face` que el script imprime al final.
4. Actualizar la CSP: eliminar `https://fonts.googleapis.com` de `style-src` y `https://fonts.gstatic.com` de `font-src` (si no hay otro recurso que las requiera).

## 3. Permissions Policy header (Cloudflare)

El `<meta http-equiv="Permissions-Policy">` agregado en `index.html` es best-effort — el spec del header solo aplica via HTTP response header real. Para configurarlo correctamente, en Cloudflare:

**Dashboard > tu zona > Rules > Transform Rules > Modify Response Header > Create rule**

| Campo | Valor |
|---|---|
| When incoming requests match | All incoming requests |
| Set static header | `Permissions-Policy` |
| Value | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()` |

Equivalente para `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (ya cubiertos por CSP `frame-ancestors`), `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
