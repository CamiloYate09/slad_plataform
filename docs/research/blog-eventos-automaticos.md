# Blog con eventos automáticos cada 3 horas: ¿hace falta un backend?

Investigación del 2026-11-24. Pregunta: hoy `blog.html` tiene los eventos escritos a mano. ¿Se pueden traer eventos nuevos cada 3 horas con una función o un script, o hace falta un backend?

**Respuesta corta:** no hace falta un backend propio. Basta un workflow de GitHub Actions programado que lea las fuentes, escriba los eventos en el HTML de `blog.html` y publique en GitHub Pages. Así la página sigue funcionando sin JS. Hay una trampa que obliga a cambiar un ajuste de Pages (ver §1a). La parte difícil es legal: de dónde salen los datos (ver §2).

Este documento no es asesoría legal. Todo lo que no se pudo comprobar está marcado como **no verificado**.

---

## 0. Lo que hay hoy en el repo (verificado leyendo el código)

| Pieza | Estado | Implicación |
|---|---|---|
| `blog.html` | 5 `<article class="blog-post" data-city data-kind data-date data-end>` escritos a mano, sin front matter de Jekyll y sin `{{`/`{%` | Se puede generar HTML en el build. Sin JS, la página muestra el HTML tal cual |
| `static/js/blog.js` | Solo ordena (baja los terminados), reparte destacados y crea los filtros de ciudad a partir de `data-city` | Los eventos generados con el mismo marcado entran solos en el filtro y en el orden |
| `static/js/cover.js` | Dibuja la portada a partir del título, la categoría y la ciudad | Los eventos automáticos no necesitan imagen; mejor así (ver §2, derechos) |
| CSP de `blog.html` (`<meta>`) | `connect-src 'self' https://cloudflareinsights.com` | Un `fetch` en tiempo de ejecución a Supabase, a un Worker en `*.workers.dev` o a Tuboleta **queda bloqueado** salvo que se cambie la CSP |
| `sw.js` | Mismo origen = *cache-first* con actualización en segundo plano (`return cached \|\| fetchPromise`) | Quien ya visitó el blog ve la versión nueva **una visita tarde**, con cualquier opción |
| `.github/workflows/lighthouse.yml` | Único workflow; ninguno publica Pages | Pages casi seguro se publica "desde una rama" (build clásico de Jekyll). Es una **inferencia**: `GET /repos/.../pages` responde 404 sin autenticación |
| `cloudflare/security-headers-worker.js` + `wrangler.toml` | Ruta `citystream.tech/*` | **Observado el 2026-11-24:** `curl -I https://citystream.tech/blog.html` responde `server: GitHub.com` con cabeceras de Fastly, sin `cf-ray` y sin cabecera CSP. **Inferencia a partir de esas cabeceras** (la consulta DNS no devolvió nada): el Worker no está delante del dominio porque el DNS no pasa por el proxy de Cloudflare |
| `supabase/` | Proyecto `zeqnlntgimxtjuffoilg`, tablas de waitlist y `push_subs` | Disponible, pero obliga a leer en tiempo de ejecución (ver §1c) |
| Repositorio | `CamiloYate09/slad_plataform` es **público** (API pública de GitHub, `visibility: public`) | Aplica la regla de los 60 días de inactividad (§1a) |
| Respuesta de Pages | `cache-control: max-age=600` | Tras publicar, el CDN puede tardar hasta 10 min en servir lo nuevo |

Fuera de este repo existe `../../backend-go/citystreamapi` (API en `api.citystream.tech`, que usa `static/js/auth.js`). No tiene nada de eventos ni de cron. Se podría usar, pero no hace falta.

---

## 1. Opciones sin backend propio

### 1a. GitHub Actions con `schedule` (cron) → **recomendada**

- **Sintaxis:** cron POSIX de 5 campos, en UTC por defecto, con zona IANA opcional ([workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)). Cada 3 h: `17 */3 * * *`.
- **Intervalo mínimo:** 5 minutos ([eventos que disparan workflows, `schedule`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)).
- **Retrasos y descartes:** "The `schedule` event can be delayed during periods of high loads". La carga alta incluye "the start of every hour", y "some queued jobs may be dropped" ([misma página](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)). Por eso se usa el minuto 17 y no el 0. Un run perdido no importa: el siguiente llega 3 h después.
- **Solo en la rama por defecto,** sobre su último commit ([misma página](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)).
- **Se apaga solo:** "In a public repository, scheduled workflows are automatically disabled when no repository activity has occurred in 60 days" ([misma página](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)). El repo es público, así que si nadie hace push en 60 días el cron se apaga. **No verificado:** si los commits de un bot con `GITHUB_TOKEN` cuentan como "actividad". Se vuelve a activar a mano desde la pestaña Actions.
- **LA TRAMPA:** "Commits pushed by a GitHub Actions workflow that uses the `GITHUB_TOKEN` do not trigger a GitHub Pages build" ([GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token); lo repite [configurar la fuente de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)). El plan "cron → commit → Pages se vuelve a publicar" **no funciona** con la configuración actual de publicar desde una rama.
  - **Solución documentada:** en Settings → Pages → Source, elegir **"GitHub Actions"**. Luego un solo workflow construye con `actions/jekyll-build-pages`, sube con `actions/upload-pages-artifact` y publica con `actions/deploy-pages` ([workflows personalizados para Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages); [workflow de ejemplo oficial para Jekyll](https://github.com/actions/starter-workflows/blob/main/pages/jekyll-gh-pages.yml)). **Este cambio lo tiene que hacer a mano alguien con permisos de admin.**
  - **Alternativa no verificada:** hacer push con `GITHUB_TOKEN` y luego llamar a `POST /repos/{owner}/{repo}/pages/builds` ([REST Pages](https://docs.github.com/en/rest/pages/pages#request-a-github-pages-build)). La sintaxis de workflows dice que `pages: write` "permite solicitar un build de Pages" ([workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)), pero la página del endpoint no confirma que funcione con `GITHUB_TOKEN`. No se probó.
- **Permisos de `GITHUB_TOKEN`:** el job que publica necesita "a minimum of `pages: write` and `id-token: write`" ([workflows personalizados](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)). `contents: write` solo hace falta si el workflow hace commit. En cuanto se declara un permiso, los que no se listan quedan en `none` ([workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)).
- **Límites de Pages:** sitio ≤ 1 GB, ancho de banda blando de 100 GB/mes, despliegue con tiempo máximo de 10 min. El límite blando de 10 builds/hora "does not apply if you build and publish your site with a custom GitHub Actions workflow" ([límites de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)). 8 despliegues al día no se acercan a ningún límite.
- **Coste:** repo público. No se buscó en la documentación de facturación de Actions la cifra de minutos para repos públicos (**no verificado** aquí).

### 1b. Cloudflare Workers con Cron Triggers + KV/D1/R2

- **Cómo funciona:** `[triggers] crons = [...]` en `wrangler.toml` y un handler `scheduled(controller, env, ctx)`. Corre en UTC. Los cambios de cron tardan hasta 15 min en propagarse ([Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)).
- **Plan gratuito** ([límites de Workers](https://developers.cloudflare.com/workers/platform/limits/)):
  - **10 ms de CPU** por ejecución de cron.
  - **50 subrequests** por invocación.
  - 5 Cron Triggers por cuenta.
  - 15 min de duración (tiempo de pared).
  - 128 MB de memoria.
  - 100.000 peticiones al día.
- **KV gratuito:** 1.000 escrituras/día a claves distintas, 1 escritura/s a la misma clave, 100.000 lecturas/día ([límites de KV](https://developers.cloudflare.com/kv/platform/limits/)).
- **Por qué no encaja aquí:**
  1. Con 50 subrequests no se pueden leer las ~509 fichas de eventos del sitemap de Tuboleta (§2). Parsear HTML con 10 ms de CPU es justo.
  2. El Worker **no está delante de citystream.tech** (§0). Servir el JSON en el mismo origen exige antes pasar el DNS por el proxy de Cloudflare. Servirlo desde `*.workers.dev` choca con la CSP `connect-src 'self'`.
  3. Leer en tiempo de ejecución rompe la versión sin JS.

### 1c. Supabase: `pg_cron` + `pg_net` o Edge Function programada

- **Cómo funciona:** `cron.schedule(...)` ejecuta `net.http_post` hacia `/functions/v1/<función>`, con la URL y la clave guardadas en Vault ([programar Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions)). Advertencia de la misma página: "pg_net writes the decrypted key to net.http_request_queue".
- **Límites de Edge Functions:** 256 MB, 2 s de CPU por petición, 150 s de tiempo de pared en el plan Free ([límites](https://supabase.com/docs/guides/functions/limits)).
- **Plan Free:** 500.000 invocaciones de Edge Functions, 500 MB de base de datos, 5 GB de egress, 2 proyectos gratis ([facturación](https://supabase.com/docs/guides/platform/billing-on-supabase)).
- **Pausa por inactividad:** un proyecto Free "is considered inactive if it does not receive sufficient user database activity over the past week". Se puede restaurar hasta 1 año después ([pausa de proyectos](https://supabase.com/docs/guides/platform/free-project-pausing)). **No verificado:** si la actividad de `pg_cron` cuenta.
- **Por qué no encaja aquí:**
  1. El navegador tendría que leer la tabla vía REST, lo que rompe la versión sin JS.
  2. Habría que añadir `https://zeqnlntgimxtjuffoilg.supabase.co` a `connect-src`.
  3. El *cache-first* de `sw.js` no cubre peticiones a otro origen, así que cada visita pega a Supabase.
  4. Hay que diseñar RLS de solo lectura para `anon`.
  5. Sirve si algún día los eventos tienen que ser dinámicos por usuario. Hoy no.

### 1d. Pedir los sitios de terceros directamente desde el navegador → no funciona

- `fetch()` sigue la política del mismo origen. El script solo puede leer la respuesta de otro origen si ese servidor envía `Access-Control-Allow-Origin` ([MDN, CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)). Tuboleta no tiene por qué enviarla para citystream.tech. La petición sale, pero el navegador no deja leer la respuesta.
- Además, la CSP propia (`connect-src 'self' https://cloudflareinsights.com`) bloquea la petición antes de salir.
- Y cada visitante lanzaría peticiones a Tuboleta, peor para ellos que un solo bot cada 3 h.

---

## 2. Fuentes de eventos y restricciones

| Fuente | API/feed oficial | robots.txt / términos | Veredicto |
|---|---|---|---|
| **Tuboleta** (Ticket Fast S.A.S.) | Sin API pública (**no verificado**: no se encontró ninguna). Sí tiene datos estructurados: `https://www.tuboleta.com/sitemap.xml` (sitemap con `<lastmod>`, 509 URLs únicas `/es/eventos/...` el 2026-11-24, incluidos eventos pasados). Cada ficha trae JSON-LD `schema.org/Event` con `name`, `startDate`, `endDate`, `location.name` (ciudad), `url` e `image` (comprobado en `/es/eventos/danny-marin-y-sus-amigos`) | [robots.txt](https://www.tuboleta.com/robots.txt) es el de Drupal por defecto: no prohíbe `/es/eventos/`. `web.tuboleta.com/robots.txt` devuelve la app HTML, es decir, **no hay robots.txt** en ese host. Los [términos de uso](https://www.tuboleta.com/es/terminos-de-uso-tuboleta) no mencionan scraping ni acceso automatizado, pero dicen: "Todo el contenido disponible en nuestro sitio web, es propiedad de TICKET FAST o de los Promotores…" y que sus marcas "no pueden ser utilizadas en productos o servicios ajenos a TICKET FAST por terceros sin autorización" | Usable con cuidado: solo **hechos** (nombre, fechas, ciudad, enlace), texto propio, sin imágenes ni descripciones copiadas (ver abajo). Lo ideal es pedirles permiso por escrito o un feed |
| **Eticket** | Pasó a ser Ticketmaster Colombia: "Eticket completes its transition to Ticketmaster" ([nota de prensa de Ticketmaster, 8 abr 2025](https://business.ticketmaster.com/press-release/ticketmaster-colombia-launch/)) | `eticket.co/robots.txt` dice `Allow: /`, pero **el dominio `eticket.co` sirve hoy spam de casinos en indonesio** (observado el 2026-11-24) | **No usar ni enlazar `eticket.co`** |
| **Ticketmaster Discovery API** | Sí, oficial con API key. 5.000 llamadas/día, 5 por segundo, paginación hasta el ítem 1.000. `CO (Colombia)` aparece en "Supported Country Codes", pero las fuentes listadas son `ticketmaster`, `tmr`, `universe` y `frontgate` ([Discovery API v2](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)) | [Términos de la API](https://developer.ticketmaster.com/support/terms-of-use/): no guardar en caché "other than for reasonable periods", retirar contenido en 24 h si el dueño lo pide, no "derive revenues from the use or provision of the Ticketmaster API" | La mejor opción oficial **si** trae inventario colombiano. **No verificado:** hay que probar `GET /discovery/v2/events.json?countryCode=CO&apikey=…`. Ojo con la cláusula de ingresos si CityStream monetiza el blog |
| **Eventbrite** | La búsqueda pública de eventos (`/v3/events/search`) se cerró en dic. 2019 ([anuncio en el grupo oficial eventbrite-api](https://groups.google.com/g/eventbrite-api/c/FT2MsDswdrA); **verificado solo en parte**, no se pudo leer el changelog oficial). La API actual solo da eventos de organizaciones propias o por ID | [robots.txt](https://www.eventbrite.co/robots.txt) prohíbe `/api/v3/destination/events/`, el endpoint interno que usan los scrapers | Solo sirve para eventos que CityStream organice. No raspar |
| **Songkick** | API de pago: "subject to the standard terms of our partnership agreement and a license fee"; "not approving API requests for student projects, educational purposes or hobbyist purposes" ([Songkick developer](https://www.songkick.com/developer)) | — | Descartada salvo acuerdo comercial |
| **Bandsintown** | Solo por artista. Las plataformas con varios artistas deben enviar un formulario de acceso; "We do not accept requests for personal or educational projects, and we do not offer public keys" ([¿Qué es la API de Bandsintown?](https://help.artists.bandsintown.com/en/articles/7053475-what-is-the-bandsintown-api)). No hay búsqueda por ciudad, solo `/artists/{name}/events` ([documentación](https://help.artists.bandsintown.com/en/articles/9186477-api-documentation)) | Términos en `corp.bandsintown.com/termsprivacy`: **no verificado** (403 al descargarlos) | Descartada para "eventos por ciudad" |
| **Google (eventos en el buscador)** | No se encontró API pública para leer los eventos de Google (**no verificado**). La documentación es para *publicar* eventos con datos estructurados ([Event structured data](https://developers.google.com/search/docs/appearance/structured-data/event)) | Los [términos de Google](https://policies.google.com/terms?hl=en) prohíben "using automated means to access content from any of our services in violation of the machine-readable instructions" | No raspar Google. Al revés, CityStream podría *publicar* JSON-LD `Event` en su blog |

**Restricciones legales y éticas:**

- **robots.txt no es una licencia.** Que no prohíba una ruta no autoriza a copiar contenido. Lo que manda son los términos y el derecho de autor.
- **Derecho de autor (Comunidad Andina, aplica a Colombia):** "Queda protegida exclusivamente la forma mediante la cual las ideas del autor son descritas, explicadas, ilustradas o incorporadas a las obras" ([Decisión 351, art. 7](https://www.acinpro.org.co/docs/Leyes/Norm-comu-trata-inter/351.1993.Com.And.pdf)).
  - Por eso: guardar solo hechos (nombre del evento, fechas, ciudad, enlace) y escribir el texto propio.
  - **No copiar** descripciones, carteles ni fotos. El `image` del JSON-LD es de Tuboleta o del promotor. Las portadas ya se dibujan con `cover.js`.
- **Marcas:** citar "Fuente: Tuboleta" con un enlace a la ficha es uso descriptivo. No usar su logo. Interpretar los términos de Tuboleta sobre marcas: **no verificado / consultar a un abogado**.
- **Ser buen ciudadano:**
  - Un User-Agent que identifique al bot (p. ej. `CityStreamBot/1.0 (+https://citystream.tech)`).
  - Como máximo 1 petición por segundo.
  - Pedir solo las fichas nuevas o cambiadas según el `<lastmod>` del sitemap. Ignorar las URLs `/en/` duplicadas.
  - Parar si responden 403 o 429.

---

## 3. Recomendación: un workflow de GitHub Actions que genera HTML en el build

**Por qué esta opción:**

- El sitio ya es Jekyll en Pages, ya hay workflows en el repo y el blog debe funcionar sin JS.
- El HTML generado en el build no toca la CSP, ni `blog.js`, ni `sw.js`.
- No añade infraestructura: nada de tokens nuevos, base de datos ni Worker.
- No se hace commit de datos. El propio sitio publicado guarda el estado (ver el paso 4 abajo).

**Pasos:**

1. **(Manual, admin)** Settings → Pages → Source: **GitHub Actions**.
2. **El workflow debe incluir `on: push` a `main`.** Al cambiar la fuente, Pages ya no se publica solo con cada push: sin `on: push`, los commits normales dejarían de publicarse.
3. Añadir a `blog.html`, después de los `<article>` curados (el primero sigue siendo la portada), una región marcada `<!-- eventos:auto:inicio -->…<!-- eventos:auto:fin -->`, y otra dentro de `<ol class="blog-rank">`. Un script de Node sin dependencias reescribe solo esas regiones.
   - Se elige esto en vez de Liquid + `_data/` porque `blog.html` no tiene front matter. Añadirlo activaría Liquid en todo el archivo, y hoy funciona sin él.
4. El script lee `https://citystream.tech/eventos.json` (lo publicado en el run anterior) como estado. Pide el sitemap y descarga solo las fichas `/es/eventos/` nuevas o con `<lastmod>` distinto. Se queda con las que tienen JSON-LD `@type: Event` y `startDate` futura, y escribe `eventos.json` + el HTML.
   - **`vistos` guarda todas las URLs revisadas,** también las descartadas (pasadas, sin `Event`, con error). Si no, cada run volvería a bajar los ~400 eventos pasados y páginas como `parquea-tuboleta`.
   - **Máximo ~120 fichas nuevas por run.** El primer run sin estado tendría 509 fichas: a 1 petición/s pasaría de 8,5 min y rozaría el `timeout`. Con el tope, cada run publica su avance y el siguiente continúa.
   - Si Tuboleta falla, el script reutiliza el `eventos.json` anterior. Un fallo de la fuente no vacía el blog.

**Esquema de datos (`/eventos.json`, publicado y en el mismo origen).** El ejemplo usa datos reales de una ficha ya pasada, solo para mostrar la forma:

```json
{
  "generado": "2026-11-24T18:17:00Z",
  "eventos": [
    {
      "url": "https://www.tuboleta.com/es/eventos/danny-marin-y-sus-amigos",
      "nombre": "DANNY MARIN Y SUS AMIGOS",
      "inicio": "2025-09-20",
      "fin": "2025-09-20",
      "ciudad": "Bogotá",
      "fuente": "Tuboleta",
      "lastmod": "2026-01-20T16:53:49-05:00"
    }
  ],
  "vistos": {
    "https://www.tuboleta.com/es/eventos/parquea-tuboleta": "2026-11-24T16:13:58-05:00"
  }
}
```

- `inicio` y `fin` = `startDate.slice(0, 10)`. Tuboleta usa el desfase `-0500` sin dos puntos, que no es ISO 8601 estricto, y `Date.parse` puede fallar con él.
- `url`: usar la del sitemap (`https`), no la del JSON-LD (viene en `http://`). Aceptar solo URLs que empiecen por `https://www.tuboleta.com/es/eventos/`.
- Deduplicar por `url` contra los `<article>` curados.

**Seguridad:** el JSON-LD de terceros es una frontera de confianza: un `name` con `<script>` acabaría servido en citystream.tech.
- Todo texto de terceros se escapa (`& < > " '`) antes de escribirlo en el HTML.
- `inicio` y `fin` se validan con `/^\d{4}-\d{2}-\d{2}$/`, y el evento se descarta si no cumplen.

**Sketch del workflow** (fijar cada `uses:` por SHA, como en `lighthouse.yml`; las etiquetas son las últimas publicadas el 2026-11-24):

```yaml
name: Pages (build + eventos)

on:
  push:
    branches: [main]          # sin esto, los commits normales dejan de publicarse
  schedule:
    - cron: '17 */3 * * *'    # cada 3 h, fuera del minuto 0 (UTC)
  workflow_dispatch:

permissions:
  contents: read              # no hace commit
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7          # fijar por SHA
        with: { persist-credentials: false }
      - uses: actions/setup-node@v7        # fijar por SHA
        with: { node-version: '22' }
      - name: Traer eventos (Tuboleta: sitemap + JSON-LD)
        run: node scripts/eventos.mjs      # reescribe blog.html y crea eventos.json
        timeout-minutes: 10
      - uses: actions/configure-pages@v6
      - uses: actions/jekyll-build-pages@v1
        with: { source: ./, destination: ./_site }
      - uses: actions/upload-pages-artifact@v5

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

`scripts/` ya está en `exclude:` de `_config.yml`, así que el script no se publica. `eventos.json` en la raíz sí se publica, y debe publicarse porque es el estado del run siguiente.

**Esqueleto del script** (`scripts/eventos.mjs`, Node ≥ 18 trae `fetch`):

```js
// ponytail: regex sobre el sitemap y el JSON-LD en vez de un parser; basta mientras Tuboleta use Drupal + schema.org
const UA = { 'user-agent': 'CityStreamBot/1.0 (+https://citystream.tech)' };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const VACIO = { eventos: [], vistos: {} };
const prev = await fetch('https://citystream.tech/eventos.json').then((r) => r.ok ? r.json() : VACIO).catch(() => VACIO);
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
// 1. sitemap -> [{url, lastmod}] solo /es/eventos/; pendientes = las que no están en prev.vistos con el mismo lastmod
// 2. tomar como máximo 120 pendientes; para cada una: fetch, esperar 1 s, extraer <script type="application/ld+json">, buscar @graph[@type=Event]
//    registrar SIEMPRE vistos[url] = lastmod (también pasadas, no-Event y errores)
// 3. quedarse con FECHA.test(inicio) && inicio >= hoy; fusionar con prev.eventos (quitar los ya terminados); si todo falla, usar prev tal cual
// 4. escribir eventos.json y reemplazar las regiones <!-- eventos:auto:* --> de blog.html con
//    <article class="blog-post" data-city="${esc(ciudad)}" data-kind="evento" data-date="${inicio}" data-end="${fin}"> ... </article>
```

**Costes de esta opción:**

| A favor | En contra |
|---|---|
| Funciona sin JS; no toca CSP, `blog.js`, `cover.js` ni `sw.js` | Hay que cambiar a mano la fuente de Pages (§1a) |
| Cero infraestructura nueva y cero secretos | Retraso real: de 0 a 3 h de cron, más la cola de Actions, más hasta 10 min del CDN (`max-age=600`), más una visita de `sw.js` |
| Si la fuente falla, el blog conserva lo último publicado | El cron se apaga tras 60 días sin actividad en el repo público |
| Fácil de añadir Ticketmaster Discovery después (mismo script, otra fuente) | El scraping de Tuboleta depende de su marcado y de su tolerancia. Lo correcto a medio plazo es pedirles un feed o permiso |
| | Los eventos automáticos tendrán texto genérico (ciudad + fecha + "Ver en Tuboleta"), no la ficha rica de los curados |

**Primer paso sin código:** pedir una API key de Ticketmaster y probar `countryCode=CO`. Si trae inventario colombiano, es la fuente oficial y con términos claros. Tuboleta quedaría para lo que Ticketmaster no cubra, idealmente con su permiso.
