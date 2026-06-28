## ADDED Requirements

### Requirement: AVIF como Primer Source en Picture
Todas las imagenes principales del landing (hero, features, experiences, value-prop, news) SHALL servirse con AVIF como primer `<source>` dentro del `<picture>`, manteniendo WebP y JPG como fallback para navegadores sin soporte AVIF.

#### Scenario: Navegador moderno carga imagen
- **WHEN** un navegador con soporte AVIF (Chrome 85+, Firefox 113+, Safari 16+) procesa un `<picture>`
- **THEN** selecciona la fuente `<source type="image/avif">` y descarga el archivo `.avif`
- **AND** el archivo descargado pesa al menos 30% menos que su equivalente WebP

#### Scenario: Safari antiguo cae a WebP
- **WHEN** un navegador sin soporte AVIF procesa el mismo `<picture>`
- **THEN** salta al siguiente `<source type="image/webp">` y carga el WebP
- **AND** ningun pixel del layout se rompe

### Requirement: Self-Hosted Geist Font Subset
La tipografia Geist SHALL servirse desde el propio dominio (`static/fonts/`) como subset latin (sin cirilico/griego/asiatico) en formato woff2 con `font-display: swap`, eliminando la dependencia de `fonts.googleapis.com` y `fonts.gstatic.com`.

#### Scenario: Carga inicial de la pagina
- **WHEN** la pagina carga en un navegador limpio
- **THEN** no se realizan requests a fonts.googleapis.com ni fonts.gstatic.com
- **AND** Geist se descarga desde `https://citystream.co/static/fonts/`
- **AND** el peso total transferido para fuentes es <100KB

#### Scenario: CSP refleja el cambio
- **WHEN** se inspecciona la meta CSP
- **THEN** `font-src` ya no incluye `https://fonts.gstatic.com` (a menos que otro recurso lo requiera)
- **AND** `style-src` ya no incluye `https://fonts.googleapis.com`

### Requirement: Speculation Rules para Prerender
La pagina SHALL incluir un `<script type="speculationrules">` que indique al navegador prerenderizar las secciones de alta probabilidad de interaccion (`#waitlist-form`, `#features`) cuando hay senal de intent (hover sostenido o moderate eagerness).

#### Scenario: Usuario muestra intent hacia waitlist
- **WHEN** el usuario hace hover sostenido sobre el link "Lista de espera" o "Comenzar"
- **THEN** el navegador inicia un prerender en background (verificable via DevTools > Application > Speculative Loads)
- **AND** al hacer clic, la navegacion a la seccion es instantanea

#### Scenario: Navegador sin soporte de Speculation Rules
- **WHEN** un navegador no soporta `<script type="speculationrules">`
- **THEN** la navegacion funciona normalmente sin prerender
- **AND** no se reporta error en consola

### Requirement: INP Monitoring con web-vitals v4
El sitio SHALL cargar `web-vitals` v4 desde CDN (con SRI) y reportar la metrica INP a Cloudflare Analytics via `navigator.sendBeacon`, permitiendo monitoreo continuo del p75 de INP en produccion.

#### Scenario: Usuario interactua con la pagina
- **WHEN** el usuario hace clic, tap, o key press y el navegador mide INP
- **THEN** `web-vitals` dispara el callback `onINP`
- **AND** un beacon JSON es enviado a Cloudflare con `{name: 'INP', value: <ms>, id: <attribution-id>}`
- **AND** el envio NO bloquea el thread principal (usa `sendBeacon`)

#### Scenario: Navegador sin soporte de Event Timing
- **WHEN** un navegador antiguo (Safari <16) carga la pagina
- **THEN** `web-vitals` no reporta INP pero no lanza error
- **AND** la pagina sigue funcionando sin degradacion

### Requirement: fetchpriority y preload Auditados
Los recursos del head SHALL usar `fetchpriority` y `<link rel="preload">` solo para el LCP candidato real (hero logo o hero title) y los recursos criticos sobre el fold, evitando over-preloading que degrada LCP.

#### Scenario: Auditoria de preload
- **WHEN** se inspecciona el `<head>`
- **THEN** solo recursos LCP-critical tienen `fetchpriority="high"` o `<link rel="preload">`
- **AND** no se preloadean fonts secundarios, imagenes below-the-fold, ni JS no-critico

#### Scenario: Lighthouse no reporta preload-warnings
- **WHEN** se ejecuta Lighthouse Performance audit
- **THEN** las auditorias `uses-rel-preload` y `preload-lcp-image` pasan en verde

### Requirement: Lighthouse CI en Pull Requests
El repositorio SHALL ejecutar Lighthouse CI en cada PR a main via GitHub Actions, fallando el check si Performance, Accessibility, Best Practices o SEO caen bajo umbrales definidos.

#### Scenario: PR introduce regresion de performance
- **WHEN** un PR baja el score de Lighthouse Performance bajo 95
- **THEN** el check de CI falla con mensaje claro indicando que metrica cayo
- **AND** el reviewer ve el reporte en los artifacts del workflow
