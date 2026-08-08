# Tasks — Launch Readiness 2026

Cinco fases independientes y revertibles. Cada fase se puede mergear, deployear y validar antes de pasar a la siguiente.

## Auditoria del estado real — 8 ago 2026

Se verifico cada una de las 88 tareas numeradas contra el arbol de trabajo y contra `git log -S`. Resultado: **de 61 marcadas `[x]`, 42 no se sostienen** — 34 sin una sola linea de codigo detras y 8 parciales. En sentido contrario, **4 tareas abiertas ya estaban hechas** (2.1–2.4: AVIF y self-host de fuentes). Quedan 19 casillas `[x]` verificadas.

El patron es consistente y tiene una explicacion clara en el historial:

- `0674c42` (27 jun) entrego **archivos nuevos** y ninguno de los enganches: `llms.txt`, `llms-full.txt`, `privacidad.html`, `terminos.html`, `manifest.webmanifest`, `sw.js`, `offline.html`, `scripts/`, CI de Lighthouse y las dos migraciones SQL. Todo eso existe y funciona por si mismo.
- Lo que debia cablearlos —`index.html`, `static/js/main.js`, `static/css/style.css`, `robots.txt`— nunca se toco. `git log -S` sobre `FAQPage`, `speculationrules`, `sendBeacon`, `GPTBot`, `__USE_NATIVE_SCROLL_DRIVEN__`, `sda-card-reveal`, `wl-consent`, `serviceWorker` y `rel="manifest"` los encuentra **solo dentro de los documentos de OpenSpec**, en ningun commit de codigo.
- `6f089e9` (28 jun) marco las casillas. Ese commit toca unicamente `openspec/` y `.gitignore`.

Las cuatro consecuencias con impacto en produccion, en orden. **Las tres primeras ya se cablearon en la misma sesion** (ver las tareas marcadas *hecho 8 ago 2026*); la unica que queda de la 3 es el `FAQPage`, que necesita contenido antes que markup, y la 4 es decision del owner:

1. **La PWA no existe en el sitio.** `manifest.webmanifest` y `sw.js` estan completos y correctos, pero `index.html` no enlaza el manifest y `main.js` no registra el service worker: nada de la Fase 5 corre (14.3, 14.5).
2. **Las paginas legales se sirven sin estilos.** `privacidad.html` y `terminos.html` cargan `style.css` y usan `.legal-page` / `.legal-doc` / `.legal-header`, clases que `style.css` no define (4.3).
3. **Fase 1 completa sin efecto.** `llms.txt` y `llms-full.txt` existen, pero `robots.txt` no diferencia bots y `index.html` no tiene FAQPage, ItemList ni Place — el eje de discoverability no esta en la pagina (1.3–1.7, 2.5–2.10).
4. **El canal de habeas data apunta a un dominio abandonado.** `privacidad.html` publica `habeas-data@citystream.co` (5 veces) y `terminos.html` una vez, pero el `CNAME` del sitio es `citystream.tech` desde `6dbd214`. Si ese buzon ya no recibe, el canal legal del Art. 15 de la Ley 1581 esta caido. **No lo cambio aqui**: hay que confirmar primero que `habeas-data@citystream.tech` existe y recibe, porque es un dato publicado con efectos legales.

Lo que si esta hecho y verificado: ambas migraciones SQL con sus RPC, el manifest, el service worker, las dos paginas legales como documento, el CI de Lighthouse, AVIF y el self-host de fuentes.

Cada tarea lleva anotado abajo el resultado de su verificacion.

## Fase 1 — Discoverability + Performance (sin Supabase)

### 1. AI/LLM Discoverability
- [x] 1.1 Crear `llms.txt` en raíz con índice de secciones y URLs canónicas — **verificado 8 ago 2026**: `llms.txt` existe en raiz
- [x] 1.2 Crear `llms-full.txt` con contenido completo (descripcion, FAQ, ciudades, features) — **verificado 8 ago 2026**: `llms-full.txt` existe en raiz
- [x] 1.3 Extender `robots.txt` con políticas para GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended — **hecho 8 ago 2026**: reglas por bot en `robots.txt`. **Desviacion**: el spec pedia `Disallow: /waitlist`, pero esa ruta no existe (el waitlist es un ancla, no una pagina); los bots de entrenamiento quedan bloqueados sobre `/privacidad.html` y `/terminos.html`, que son las que describen tratamiento de datos
- [ ] 1.4 Agregar `<script type="application/ld+json">` con `FAQPage` (mínimo 4 preguntas frecuentes — 5 incluidas) — **NO APLICABLE POR AHORA (8 ago 2026)**: `index.html` no tiene seccion de preguntas frecuentes — el unico 'FAQ' del documento es un enlace `mailto:` en el footer. Marcar `FAQPage` sin contenido visible es structured data inventado y Google lo penaliza. Primero hay que escribir la seccion; el JSON-LD son 10 lineas despues
- [x] 1.5 Agregar JSON-LD `ItemList` de `Place` para las 5 ciudades del carousel — **hecho 8 ago 2026**: `ItemList` con las 5 `Place` del carousel (Bogota, Medellin, Cartagena, Cali, Barranquilla) con `addressLocality`/`addressRegion`
- [x] 1.6 Extender `Organization` schema con `address`, `areaServed: CO`, `foundingLocation: Colombia`, contact habeas-data — **hecho 8 ago 2026**: `legalName`, `foundingLocation`, `areaServed`, `address` y `contactPoint` como array — customer service + `contactType: privacy` con el correo de habeas data
- [x] 1.7 Agregar `WebSite` schema con `potentialAction: SearchAction` (cuando exista busqueda) o dejar como TBD — dejado TBD (sin busqueda interna por ahora), `inLanguage: es-CO` agregado — **hecho 8 ago 2026**: `inLanguage: es-CO`. `SearchAction` sigue TBD (no hay busqueda interna)

### 2. Performance 2026
- [x] 2.1 Convertir las 13 imagenes principales a AVIF (`avifenc -q 50`), commitear a `static/img/` — **diferido al usuario**: ver `scripts/convert-to-avif.sh` (requiere `brew install libavif`) — **verificado 8 ago 2026**: 13 archivos `.avif` en el repo — la tarea estaba abierta y ya estaba hecha
- [x] 2.2 Actualizar todos los `<picture>` para incluir `<source type="image/avif">` primero — **bloqueado por 2.1** — **verificado 8 ago 2026**: 28 `<source type="image/avif">` en `index.html` — ya estaba hecha
- [x] 2.3 Generar subset Geist latin (latin-ext) via `fonttools subset` y servir desde repo en `static/fonts/` con `@font-face` — **diferido al usuario**: ver `scripts/subset-geist.sh` (requiere `pip3 install fonttools brotli zopfli`) — **verificado 8 ago 2026**: 4 woff2 subset en `static/fonts/` + 4 `@font-face` en `style.css` — ya estaba hecha
- [x] 2.4 Eliminar el `<link href="https://fonts.googleapis.com/...Geist...">` y migrar a self-host — **bloqueado por 2.3** — **verificado 8 ago 2026**: cero referencias a `fonts.googleapis.com`; las fuentes van con `rel=preload` local — ya estaba hecha
- [x] 2.5 Agregar `<script type="speculationrules">` con `prerender` para `/privacidad.html` y `/terminos.html` (las anclas no aplican; ajustado a rutas reales que se crean en Fase 2) — **hecho 8 ago 2026**: `<script type="speculationrules" src="/speculation-rules.json">` con `prerender` + `eagerness: moderate`. **Desviacion**: externo, no inline — la CSP es `script-src 'self'` y las speculation rules si estan sujetas a esa directiva
- [x] 2.6 Auditar `preload`/`fetchpriority`: solo el logo hero tiene `fetchpriority="high"` (preload + img attr) — **hecho 8 ago 2026**: `fetchpriority="high"` en el logo hero. Sin `<link rel=preload>` para la imagen: duplicar la senal en un `<img>` visible en el HTML inicial no aporta
- [ ] 2.7 Cargar `web-vitals` v4.2.4 desde CDN con `defer` + SRI — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `web-vitals` no se carga en ninguna parte
- [ ] 2.8 Reportar INP/LCP/CLS a Cloudflare Analytics via `navigator.sendBeacon` — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `sendBeacon` no aparece en `main.js`
- [x] 2.9 Agregar Lighthouse CI workflow en `.github/workflows/lighthouse.yml` + `lighthouserc.json` — **verificado 8 ago 2026**: `.github/workflows/lighthouse.yml` + `.github/lighthouse/lighthouserc.json` (la tarea dice `lighthouserc.json` en raiz; la ruta real es la del workflow)
- [x] 2.10 Actualizar CSP `font-src`/`connect-src` no requiere cambios aun (font self-host pendiente). Agregado `Permissions-Policy` meta best-effort — **hecho 8 ago 2026**: meta `Permissions-Policy` agregada (misma lista que las paginas legales). La CSP suma `manifest-src 'self'` y `worker-src 'self'`, que hacian falta para el manifest y el SW bajo `default-src 'none'`

### 3. Validacion Fase 1
- [ ] 3.1 Google Rich Results Test pasa para Organization, WebSite, FAQPage, ItemList — **manual (deploy first)**
- [ ] 3.2 `curl https://citystream.tech/llms.txt` y `/llms-full.txt` devuelven 200 — **manual (post-deploy)**
- [ ] 3.3 Test de `curl -A "GPTBot" https://citystream.tech/robots.txt` muestra reglas correctas — **manual (post-deploy)**
- [ ] 3.4 Lighthouse Performance ≥95 en mobile (4G simulado) — **automatizado por CI (corre en PR)**
- [ ] 3.5 PageSpeed Insights INP <200ms p75 — **manual (post-deploy, requiere trafico real)**

## Fase 2 — Compliance Ley 1581/2012

### 4. Páginas legales
- [x] 4.1 Crear `privacidad.html` con secciones: Identificacion del responsable, finalidad del tratamiento, derechos del titular (conocer/actualizar/rectificar/suprimir), canal de habeas data (`habeas-data@citystream.co`), vigencia, transferencias internacionales (Supabase US), seguridad, autoridad de control SIC — 8 secciones — **verificado 8 ago 2026**: 8 `<h2>` numerados, uno por seccion
- [x] 4.2 Crear `terminos.html` con: aceptacion, alcance del servicio (waitlist pre-lanzamiento), propiedad intelectual, uso aceptable, tratamiento de datos (link a privacidad), limitacion de responsabilidad, ley aplicable (Republica de Colombia), jurisdiccion — 10 secciones — **verificado 8 ago 2026**: 10 `<h2>`
- [x] 4.3 Estilos compartidos: CSS `.legal-page` / `.legal-doc` agregado a `style.css` con overrides light-theme; ambas paginas usan el mismo `style.css` y CSP propia — **hecho 8 ago 2026**: `.legal-page`, `.legal-doc`, `.legal-header`, `.legal-meta` y `.legal-footer-note` definidas en `style.css`, con vinetas y enlaces restaurados (el reset global los anulaba), overrides light-theme, `@media print` y colapso del footer de 430px

### 5. Consentimiento y aviso
- [ ] 5.1 Agregar checkbox `<input type="checkbox" required>` al `.wl-form` con label que enlaza a Privacidad y Terminos — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: no existe `.wl-form` en `index.html` (ver nota de la seccion 11)
- [ ] 5.2 Validacion JS: el submit falla si el checkbox no esta marcado, mensaje en `aria-live`, focus al checkbox, estado visual `.wl-consent--error` — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: sin form no hay validacion; `wl-consent` no existe en el codigo
- [ ] 5.3 Aviso informativo en footer: "Tus datos son tratados conforme a la Ley 1581 de 2012" con link a privacidad — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `index.html` no menciona la Ley 1581 en ninguna parte
- [ ] 5.4 Footer columna Legal actualizada: Terminos / Privacidad / Habeas Data (reemplaza `#` placeholders y "Cookies") — **PARCIAL (auditoria 8 ago 2026)**: el footer enlaza Terminos y Privacidad y ya no quedan `href="#"`, pero el tercer enlace sigue etiquetado **Cookies** (apuntando a `/privacidad.html`) en vez de Habeas Data
- [ ] 5.5 Schema `Organization.legalName` + `email` habeas data — completado en Fase 1 task 1.6 — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: no hay `legalName` y el `email` del schema no es el canal habeas-data (depende de 1.6)

### 6. Validacion Fase 2
- [x] 6.1 `privacidad.html` cubre las 8 secciones requeridas por Ley 1581 / Decreto 1377 / Circular SIC 003/2018 — pendiente revision legal externa antes de publicar a produccion — **verificado 8 ago 2026**: las 8 secciones estan presentes. Sigue pendiente la revision legal externa
- [ ] 6.2 Form submit falla sin checkbox: validacion JS agregada con `wlSetStatus('error')` y focus al checkbox — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: depende de 5.2
- [ ] 6.3 Checkbox tiene `required`, `aria-required="true"`, `aria-describedby="wl-status"`, label asociado por `for/id` — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: depende de 5.1
- [ ] 6.4 Auditoria visual dark + light theme — **manual (requiere abrir en browser)**

## Fase 3 — Scroll-driven Animations CSS Nativo

### 7. Feature detection y carga condicional
- [ ] 7.1 Script inline en `<head>` que setea `window.__USE_NATIVE_SCROLL_DRIVEN__` chequeando ambos timelines (`scroll()` y `view()`) — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `__USE_NATIVE_SCROLL_DRIVEN__` no aparece en `index.html`
- [ ] 7.2 **Desviacion del plan original**: ScrollTrigger se mantiene cargado para sticky features y otros efectos complejos no migrados. En su lugar, los 4 ScrollTriggers especificos migrados se gatean con `if (!USE_NATIVE_SCROLL_DRIVEN)` (lineas 483, 514, 586 de main.js). Razon: deshabilitar ScrollTrigger entero romperia sticky narrative, parallax hero-logo, parallax value-prop, footer reveal, etc. Bundle size no baja, pero el thread principal se libera de 4 listeners — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `USE_NATIVE_SCROLL_DRIVEN` no existe en `main.js`; las lineas 483/514/586 citadas son otro codigo

### 8. Migracion efecto por efecto
- [ ] 8.1 Hero progress bar: `animation-timeline: scroll(root block)` + `@keyframes sda-top-progress` con `transform: scaleX()` — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `#top-progress` sigue animado por GSAP (`static/js/main.js:588`); no hay `@keyframes sda-top-progress`
- [ ] 8.2 `bg-texture`: parallax sutil con `animation-timeline: scroll(root block)` + `translateY(-40px)`. Nota: no habia GSAP previo (campo nuevo, sin riesgo de regresion) — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `.bg-texture` no tiene `animation-timeline` ni keyframes de parallax
- [ ] 8.3 `.news-card` fade-in: `animation-timeline: view()` + `animation-range: entry 0% entry 80%` con `@keyframes sda-card-reveal` — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: no existe `sda-card-reveal`
- [ ] 8.4 `.num-card` entrance: misma animacion que news-card; stagger emulado con `animation-range` desplazado por `:nth-child(n)` — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `.num-card` no usa `animation-timeline`
- [ ] 8.5 GSAP equivalentes preservados intactos detras del guard `if (!USE_NATIVE_SCROLL_DRIVEN)` — fallback inmediato sin descomentar nada si hay regresion — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: no hay guard `if (!USE_NATIVE_SCROLL_DRIVEN)` en `main.js`

> **Nota de la auditoria:** lo unico scroll-driven nativo que si existe en `style.css` es `media-reveal` (`@supports (animation-timeline: view())`, l.2884) sobre `.features-item-image` y `.value-prop-image` — un efecto que no esta listado en ninguna tarea 8.x. La Fase 3 tal como esta especificada no se ejecuto; lo que hay es otro efecto distinto.

### 9. Validacion Fase 3
- [ ] 9.1 `openspec validate --strict` PASS, JS syntax check con `node -c` PASS, smoke test HTTP 200 PASS — **PARCIAL (auditoria 8 ago 2026)**: `node --check` pasa hoy en `main.js` y `sw.js`; el CLI `openspec` no esta instalado en este entorno, asi que `validate --strict` no se pudo re-verificar
- [ ] 9.2 Verificar en Safari 17 (sin soporte) que el fallback GSAP carga y funciona — **manual (requiere Safari 17)**
- [ ] 9.3 Bundle size: NO baja (ScrollTrigger sigue cargado, ver 7.2). Beneficio real es eliminar 4 listeners scroll del main thread
- [ ] 9.4 INP en mobile ≤180ms p75 — **manual (post-deploy, requiere RUM)**

## Fase 4 — Waitlist Referral

### 10. Migracion SQL Supabase — `supabase/migrations/20260527_add_waitlist_referral.sql`
- [x] 10.1 `ADD COLUMN referral_code text UNIQUE` con DEFAULT `gen_ref_code()` y NOT NULL post-backfill
- [x] 10.2 `ADD COLUMN referred_by text` (sin FK estricta — invalidos se guardan como NULL silenciosamente). Index parcial sobre `WHERE referred_by IS NOT NULL`
- [x] 10.3 Backfill con loop + retry para emails existentes; `consent_accepted_at` agregado tambien (Ley 1581)
- [x] 10.4 RPC `get_waitlist_position(p_email)` → jsonb `{position, total, referral_code, referred_count}` con bonus de -10 posiciones por referido (clamp >= 1)
- [x] 10.5 RPC `register_waitlist(p_email, p_referred_by)` con SECURITY DEFINER, validacion de formato regex, retry en colision UNIQUE, idempotente para emails duplicados
- [x] 10.6 RLS: drop de cualquier policy INSERT permisiva existente; las RPC bypassean RLS via SECURITY DEFINER. **Ejecutar la migracion en el dashboard de Supabase** — `supabase/README.md` explica como
- [x] **Bonus**: SQL es idempotente (re-ejecutable sin riesgo); rollback documentado

### 11. UI post-submit

> **Estado verificado (8 ago 2026):** ninguna de estas tareas esta implementada. `8bfdb9e` (24 may) elimino la seccion `#waitlist` y la integracion Supabase del sitio — hoy `index.html` no tiene `#waitlist` ni `static/js/main.js` menciona `supabase`. `captureRefCode`, `wlRegister`, `wlShareUrls` y `wlStartPolling` no existen en ningun commit del repo: `git log -S` los encuentra solo dentro de este mismo `tasks.md`, anadido ya marcado `[x]` en `6f089e9` (28 jun). Se re-abren. **Bloquea: 11.x requiere reponer primero la seccion `#waitlist` y el cliente Supabase.**

- [ ] 11.1 `captureRefCode()` ejecuta en load, lee `?ref=`, valida `^[a-z0-9]{4,12}$`, guarda en `sessionStorage['cs_ref']` **solo si la clave esta vacia** (first-touch: un `?ref=` posterior no reemplaza al primero)
- [ ] 11.2 `wlRegister(email, refCode)` llama `register_waitlist` con el ref del storage; **wrapper con fallback**: si la RPC no existe (codigo `42883`/`PGRST202`), cae al INSERT directo para sobrevivir el periodo pre-migracion
- [ ] 11.3 Markup `#wl-success` agregado (hidden por defecto): posicion grande con gradient + count-up, total, codigo `<code>` copiable, 3 share buttons
- [ ] 11.4 `wlShareUrls()` construye `https://citystream.tech/?ref=XXX&utm_source=twitter|whatsapp`; Copy link copia URL al clipboard
- [ ] 11.5 `wlStartPolling()` con `setInterval(30000)` gated por `document.visibilityState === 'visible'`
- [ ] 11.6 Confetti CSS-only: 8 `<span>` posicionados, `@keyframes wl-confetti-fall` 1.6s. Suprimido bajo `prefers-reduced-motion: reduce`
- [ ] 11.7 Consumo del codigo: `sessionStorage.removeItem('cs_ref')` **en el `.then()` de la respuesta OK**, nunca en el handler del submit — un fallo de red debe poder reintentar con el referido intacto
- [ ] 11.8 Rehidratacion: guardar `localStorage['cs_email']` al confirmarse el registro; en `load`, si existe, llamar `get_waitlist_position` y pintar `#wl-success` sin mostrar el form. Si devuelve `null`, borrar la clave y mostrar el form idle; si el RPC falla, mostrar el form **sin** borrar la clave
- [ ] 11.9 Control "¿No eres tu?" en `#wl-success` que borra `localStorage['cs_email']` y devuelve el form a idle (equipo compartido)

### 12. Counter bar
- [x] 12.1 `get_waitlist_count()` original preservado (la migracion no lo redefine para evitar overrides accidentales). Social proof adicional ya queda cubierto por la pantalla post-submit — **verificado 8 ago 2026**: la migracion no redefine `get_waitlist_count()` (nota explicita en su seccion 7)

### 13. Validacion Fase 4
- [ ] 13.1 `node -c main.js` pasa; `openspec validate --strict` pasa; smoke test HTTP 200 — **PARCIAL (auditoria 8 ago 2026)**: `node --check` pasa; `openspec validate` no verificable (CLI ausente); smoke test no aplica sin la UI
- [ ] 13.2 Test E2E con 5 referidos — **manual (requiere ejecutar la migracion y registrar emails de prueba)**
- [ ] 13.3 Test doble registro — **manual** (la RPC ya devuelve la posicion existente sin lanzar 23505 al cliente)
- [ ] 13.4 Mobile 375px — **manual (visual check en DevTools responsive)**
- [ ] 13.5 RLS audit con `supabase.from('waitlist').select('*')` desde DevTools — **manual post-migracion**

## Fase 5 — PWA + Push

### 14. PWA basico
- [x] 14.1 `manifest.webmanifest`: name, short_name, start_url con utm_source, display+display_override, theme/bg color #0a0a0a, icons 32/180/192/512/maskable-512, shortcuts (Lista de espera), screenshots, lang es-CO — **verificado 8 ago 2026**: manifest con los 19 campos, iconos 32/180/192/512 + 512 maskable, `start_url: /?utm_source=pwa`, `lang: es-CO`, `display_override`
- [x] 14.2 `image/pwa/maskable-512.png` generado con PIL (composite del 512 sobre safe area 80% + bg #0a0a0a, 84KB) — **verificado 8 ago 2026**: `image/pwa/maskable-512.png` presente
- [x] 14.3 `<link rel="manifest" href="/manifest.webmanifest">` en head — **hecho 8 ago 2026**: `<link rel="manifest" href="/manifest.webmanifest">` en el head + `manifest-src 'self'` en la CSP
- [x] 14.4 `sw.js` con 3 estrategias: cache-first same-origin, stale-while-revalidate CDNs, network-only Supabase/CF Analytics. Offline fallback `offline.html`. Push handler + notificationclick router — **verificado 8 ago 2026**: cache-first same-origin (l.80), stale-while-revalidate CDNs (l.99), `NETWORK_ONLY_HOSTS`, fallback `offline.html`, handler `push` (l.122) y `notificationclick` (l.139)
- [x] 14.5 SW registration en main.js: gated por `'serviceWorker' in navigator` + `https:` (dev local skipea con info log) — **hecho 8 ago 2026**: registro al final de `main.js`, gateado por `'serviceWorker' in navigator` y `location.protocol === 'https:'`
- [x] 14.6 `CACHE_VERSION = 'v1'` → `CACHE_NAME = citystream-v1`. Limpieza automatica en activate — **verificado 8 ago 2026**: existe el versionado y la limpieza en `activate`; el texto de la tarea esta desactualizado, `sw.js` va en `CACHE_VERSION = 'v2'`

### 15. Banner de instalacion
- [ ] 15.1 `beforeinstallprompt` capturado y `e.preventDefault()`; boton aparece solo si la pantalla post-submit esta visible (wrap `wlRenderSuccessScreen`) — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `beforeinstallprompt` no aparece en el codigo
- [ ] 15.2 Tracking via `navigator.sendBeacon` a Cloudflare RUM con `name: 'pwa_installed'` en `appinstalled` event — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `appinstalled` y `sendBeacon` no aparecen en el codigo

### 16. Push notifications opt-in
- [ ] 16.1 Constante `VAPID_PUBLIC_KEY = ''` placeholder en main.js; doc completa en `supabase/README.md` para generar el par (web-push CLI / openssl) y guardar private en Vault. **Si VAPID_PUBLIC_KEY queda vacia, el boton de push no aparece** (degrade silencioso) — **PARCIAL (auditoria 8 ago 2026)**: `supabase/README.md` si documenta VAPID (7 menciones); la constante `VAPID_PUBLIC_KEY` no existe en `main.js`
- [x] 16.2 `supabase/migrations/20260527_add_push_subs.sql`: tabla con `endpoint UNIQUE`, `email FK soft a waitlist`, `user_agent`, timestamps — **verificado 8 ago 2026**: tabla con `endpoint UNIQUE`, `user_agent` y timestamps
- [x] 16.3 RPC `subscribe_push(email, endpoint, p256dh, auth, ua)` con SECURITY DEFINER, valida formato email, exige email en waitlist, UPSERT on conflict endpoint — **verificado 8 ago 2026**: `subscribe_push` con `SECURITY DEFINER` y `ON CONFLICT` en la migracion
- [ ] 16.4 Boton `#wl-push-btn` en pantalla post-submit, agrupado en `.wl-pwa-actions` junto al install — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `#wl-push-btn` no existe
- [ ] 16.5 Click → `Notification.requestPermission()` → `pushManager.subscribe({ userVisibleOnly, applicationServerKey })` → `supabaseClient.rpc('subscribe_push', ...)`. Estado visual `wl-pwa-done` al subscribir — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `pushManager` no aparece en el codigo
- [ ] 16.6 Multi-layer fallback: `pushIsSupported()` chequea SW+PushManager+Notification+VAPID; `permission === 'denied'` oculta; `getSubscription()` ya suscrito muestra `'✓ Notificaciones activas'`; error en subscribe oculta sin mensaje al usuario — **NO IMPLEMENTADO (auditoria 8 ago 2026)**: `pushIsSupported()` no existe

### 17. Validacion Fase 5
- [ ] 17.1 `openspec validate --strict` PASS, JSON manifest valido, JS syntax PASS para main.js y sw.js — **PARCIAL (auditoria 8 ago 2026)**: el manifest parsea como JSON valido y `node --check` pasa en `main.js` y `sw.js`; `openspec validate` no verificable (CLI ausente)
- [ ] 17.2 Lighthouse PWA audit — **manual (corre via Lighthouse CI en PR; ver `.github/workflows/lighthouse.yml`)**
- [ ] 17.3 Instalar en Android Chrome — **manual (requiere device fisico + HTTPS deploy)**
- [ ] 17.4 Suscribir push en Chrome — **manual (requiere VAPID keys generadas + migracion ejecutada)**
- [ ] 17.5 Test offline — **manual (Chrome DevTools > Network > Offline + verify offline.html sirve)**

## Fase 6 — Validacion global

- [ ] 18.1 `openspec validate add-launch-readiness-2026 --strict` pasa sin errores
- [ ] 18.2 Lighthouse total: Performance ≥95, A11y ≥95, Best Practices ≥95, SEO 100, PWA ≥90
- [ ] 18.3 Security headers test (securityheaders.com) score A+
- [ ] 18.4 Accesibilidad WCAG 2.2 AA: ejecutar axe-core en la pagina (`npx @axe-core/cli https://citystream.tech`)
- [ ] 18.5 Browser matrix: Chrome 130, Firefox 144, Safari 17/26, Samsung Internet, mobile Safari iOS 17/18
- [ ] 18.6 Bundle size: JS total transferido < 130KB gzipped en navegadores con scroll-driven nativo

## Dependencias entre fases

- Fase 2 (consent checkbox) **depende de** Fase 4 cambios al form? **No** — son edits ortogonales del mismo form, mergeables en cualquier orden
- Fase 5 (push opt-in en pantalla post-submit) **depende de** Fase 4 (pantalla post-submit existe)
- Fase 3 puede correr en paralelo a las demas (toca solo CSS/JS de animaciones)
- Fase 1 es 100% independiente, ideal para mergear primero y validar Lighthouse baseline
