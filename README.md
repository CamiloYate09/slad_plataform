# CityStream — sitio web

Landing page y páginas de cuenta de [CityStream](https://citystream.tech), la red social de
conexiones locales hecha en Colombia. Es un sitio estático, sin paso de build, publicado con
GitHub Pages en el dominio `citystream.tech` (archivo `CNAME`).

## Qué se publica

| Ruta | Contenido |
|---|---|
| `index.html` | Landing (ciudades, eventos, personas, conciertos) |
| `login.html`, `registro.html`, `cuenta.html`, `olvide-password.html`, `reset-password/` | Cuenta de usuario. Hablan con `https://api.citystream.tech/api/v1/auth` (`static/js/auth.js`) |
| `privacidad.html`, `terminos.html` | Textos legales |
| `offline.html`, `sw.js`, `manifest.webmanifest` | PWA: service worker y página sin conexión |
| `static/` | CSS, JS propio, fuentes, imágenes, video y librerías de terceros (`static/vendor/`) |
| `image/` | Favicons e iconos de la PWA |
| `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `speculation-rules.json` | SEO y descubrimiento |

Lo que **no** se publica está listado en `_config.yml` (`exclude`): `openspec/`, `supabase/`,
`cloudflare/`, `scripts/`, `factory/` y este README. Jekyll ya omite las carpetas que empiezan por
punto. Al añadir documentación o herramientas internas, agrégalas a esa lista.

## Desarrollo local

```bash
npx http-server . -p 8080 -s     # o: python3 -m http.server 8080
```

Abre `http://localhost:8080`. Las páginas de cuenta usan `http://localhost:8080` como API cuando el
host es `localhost` (ver `API_BASE` en `static/js/auth.js`). Sirve el sitio en otro puerto si el
backend local ocupa el 8080.

El service worker solo se registra en `https`. En local no interviene.

## Despliegue

- **Sitio:** un push a `main` publica en GitHub Pages.
- **Cabeceras de seguridad:** GitHub Pages no permite cabeceras propias. HSTS, CSP con
  `frame-ancestors`, `nosniff`, COOP y CORP las añade el Worker de `cloudflare/`
  (`cd cloudflare && npx wrangler deploy`). Las CSP del Worker deben coincidir con las `<meta>` de
  cada página: el navegador aplica las dos a la vez.
  Comprobar: `curl -sI https://citystream.tech/login.html | grep -i strict-transport`.
- **Base de datos:** migraciones de Supabase en `supabase/migrations/` (ver `supabase/README.md`).

## Convenciones de seguridad

- Sin scripts de CDN: las librerías van en `static/vendor/` con su hash SRI (ver
  `static/vendor/README.md`), así la CSP puede ser `script-src 'self'`.
- Sin `onclick=` ni `<script>` inline en las páginas: la CSP los bloquea.
- La sesión vive en una cookie HttpOnly que pone el API. Nunca guardar tokens en `localStorage`.
- El service worker solo cachea recursos del mismo origen y nunca las páginas de cuenta (`sw.js`).
  Al cambiar archivos cacheados, sube `CACHE_VERSION`.

## Herramientas

- `scripts/`: conversión a AVIF, subset de fuentes, auditoría de contraste y comprobación del
  cableado del tema (ver `scripts/README.md`).
- `.github/workflows/lighthouse.yml`: Lighthouse CI en cada PR a `main`.
- `openspec/`: propuestas y especificaciones de cambios (flujo OpenSpec).
