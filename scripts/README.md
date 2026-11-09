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

## CSS critico del hero y hoja minificada (`critical-css.sh`)

`index.html` lleva inline el CSS de lo visible sin scroll (entre
`<!-- critical:start -->` y `<!-- critical:end -->`) y carga `static/css/style.min.css`
al final del `<body>`, para que la hoja completa no bloquee el primer paint. Todas las
paginas cargan `style.min.css`; `style.css` es la fuente que se edita.

**Regenerar cada vez que cambie `style.css` o el hero/nav de `index.html`**; si no,
las paginas siguen con la hoja vieja. El mismo script escribe el CSS critico y
`style.min.css`:

```bash
# Pre-requisitos: node 18+ y Google Chrome (CHROME_PATH si no esta en /usr/bin/google-chrome)
./scripts/critical-css.sh
```

## Video del showcase (`encode-video.swift`)

Recodifica un video para la web: H.264 al ancho al que se muestra, sin pista de audio (para
videos que se reproducen silenciados) y con fast start. Con el video de la seccion que hubo
en index.html, 1920px y 11,6 MB pasaron a 960px y 2,6 MB sin diferencia visible.

Sin instalar nada (usa AVFoundation de macOS):

```bash
swift scripts/encode-video.swift original.mp4 static/video/nombre-960.mp4 960 1400000
# argumentos: entrada, salida, ancho en px, bitrate en bits/s
```
