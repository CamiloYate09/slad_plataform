# Tasks — Launch Readiness 2026

Cinco fases independientes y revertibles. Cada fase se puede mergear, deployear y validar antes de pasar a la siguiente.

## Fase 1 — Discoverability + Performance (sin Supabase)

### 1. AI/LLM Discoverability
- [x] 1.1 Crear `llms.txt` en raíz con índice de secciones y URLs canónicas
- [x] 1.2 Crear `llms-full.txt` con contenido completo (descripcion, FAQ, ciudades, features)
- [x] 1.3 Extender `robots.txt` con políticas para GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended
- [x] 1.4 Agregar `<script type="application/ld+json">` con `FAQPage` (mínimo 4 preguntas frecuentes — 5 incluidas)
- [x] 1.5 Agregar JSON-LD `ItemList` de `Place` para las 5 ciudades del carousel
- [x] 1.6 Extender `Organization` schema con `address`, `areaServed: CO`, `foundingLocation: Colombia`, contact habeas-data
- [x] 1.7 Agregar `WebSite` schema con `potentialAction: SearchAction` (cuando exista busqueda) o dejar como TBD — dejado TBD (sin busqueda interna por ahora), `inLanguage: es-CO` agregado

### 2. Performance 2026
- [ ] 2.1 Convertir las 13 imagenes principales a AVIF (`avifenc -q 50`), commitear a `static/img/` — **diferido al usuario**: ver `scripts/convert-to-avif.sh` (requiere `brew install libavif`)
- [ ] 2.2 Actualizar todos los `<picture>` para incluir `<source type="image/avif">` primero — **bloqueado por 2.1**
- [ ] 2.3 Generar subset Geist latin (latin-ext) via `fonttools subset` y servir desde repo en `static/fonts/` con `@font-face` — **diferido al usuario**: ver `scripts/subset-geist.sh` (requiere `pip3 install fonttools brotli zopfli`)
- [ ] 2.4 Eliminar el `<link href="https://fonts.googleapis.com/...Geist...">` y migrar a self-host — **bloqueado por 2.3**
- [x] 2.5 Agregar `<script type="speculationrules">` con `prerender` para `/privacidad.html` y `/terminos.html` (las anclas no aplican; ajustado a rutas reales que se crean en Fase 2)
- [x] 2.6 Auditar `preload`/`fetchpriority`: solo el logo hero tiene `fetchpriority="high"` (preload + img attr)
- [x] 2.7 Cargar `web-vitals` v4.2.4 desde CDN con `defer` + SRI
- [x] 2.8 Reportar INP/LCP/CLS a Cloudflare Analytics via `navigator.sendBeacon`
- [x] 2.9 Agregar Lighthouse CI workflow en `.github/workflows/lighthouse.yml` + `lighthouserc.json`
- [x] 2.10 Actualizar CSP `font-src`/`connect-src` no requiere cambios aun (font self-host pendiente). Agregado `Permissions-Policy` meta best-effort

### 3. Validacion Fase 1
- [ ] 3.1 Google Rich Results Test pasa para Organization, WebSite, FAQPage, ItemList — **manual (deploy first)**
- [ ] 3.2 `curl https://citystream.co/llms.txt` y `/llms-full.txt` devuelven 200 — **manual (post-deploy)**
- [ ] 3.3 Test de `curl -A "GPTBot" https://citystream.co/robots.txt` muestra reglas correctas — **manual (post-deploy)**
- [ ] 3.4 Lighthouse Performance ≥95 en mobile (4G simulado) — **automatizado por CI (corre en PR)**
- [ ] 3.5 PageSpeed Insights INP <200ms p75 — **manual (post-deploy, requiere trafico real)**

## Fase 2 — Compliance Ley 1581/2012

### 4. Páginas legales
- [x] 4.1 Crear `privacidad.html` con secciones: Identificacion del responsable, finalidad del tratamiento, derechos del titular (conocer/actualizar/rectificar/suprimir), canal de habeas data (`habeas-data@citystream.co`), vigencia, transferencias internacionales (Supabase US), seguridad, autoridad de control SIC — 8 secciones
- [x] 4.2 Crear `terminos.html` con: aceptacion, alcance del servicio (waitlist pre-lanzamiento), propiedad intelectual, uso aceptable, tratamiento de datos (link a privacidad), limitacion de responsabilidad, ley aplicable (Republica de Colombia), jurisdiccion — 10 secciones
- [x] 4.3 Estilos compartidos: CSS `.legal-page` / `.legal-doc` agregado a `style.css` con overrides light-theme; ambas paginas usan el mismo `style.css` y CSP propia

### 5. Consentimiento y aviso
- [x] 5.1 Agregar checkbox `<input type="checkbox" required>` al `.wl-form` con label que enlaza a Privacidad y Terminos
- [x] 5.2 Validacion JS: el submit falla si el checkbox no esta marcado, mensaje en `aria-live`, focus al checkbox, estado visual `.wl-consent--error`
- [x] 5.3 Aviso informativo en footer: "Tus datos son tratados conforme a la Ley 1581 de 2012" con link a privacidad
- [x] 5.4 Footer columna Legal actualizada: Terminos / Privacidad / Habeas Data (reemplaza `#` placeholders y "Cookies")
- [x] 5.5 Schema `Organization.legalName` + `email` habeas data — completado en Fase 1 task 1.6

### 6. Validacion Fase 2
- [x] 6.1 `privacidad.html` cubre las 8 secciones requeridas por Ley 1581 / Decreto 1377 / Circular SIC 003/2018 — pendiente revision legal externa antes de publicar a produccion
- [x] 6.2 Form submit falla sin checkbox: validacion JS agregada con `wlSetStatus('error')` y focus al checkbox
- [x] 6.3 Checkbox tiene `required`, `aria-required="true"`, `aria-describedby="wl-status"`, label asociado por `for/id`
- [ ] 6.4 Auditoria visual dark + light theme — **manual (requiere abrir en browser)**

## Fase 3 — Scroll-driven Animations CSS Nativo

### 7. Feature detection y carga condicional
- [x] 7.1 Script inline en `<head>` que setea `window.__USE_NATIVE_SCROLL_DRIVEN__` chequeando ambos timelines (`scroll()` y `view()`)
- [x] 7.2 **Desviacion del plan original**: ScrollTrigger se mantiene cargado para sticky features y otros efectos complejos no migrados. En su lugar, los 4 ScrollTriggers especificos migrados se gatean con `if (!USE_NATIVE_SCROLL_DRIVEN)` (lineas 483, 514, 586 de main.js). Razon: deshabilitar ScrollTrigger entero romperia sticky narrative, parallax hero-logo, parallax value-prop, footer reveal, etc. Bundle size no baja, pero el thread principal se libera de 4 listeners

### 8. Migracion efecto por efecto
- [x] 8.1 Hero progress bar: `animation-timeline: scroll(root block)` + `@keyframes sda-top-progress` con `transform: scaleX()`
- [x] 8.2 `bg-texture`: parallax sutil con `animation-timeline: scroll(root block)` + `translateY(-40px)`. Nota: no habia GSAP previo (campo nuevo, sin riesgo de regresion)
- [x] 8.3 `.news-card` fade-in: `animation-timeline: view()` + `animation-range: entry 0% entry 80%` con `@keyframes sda-card-reveal`
- [x] 8.4 `.num-card` entrance: misma animacion que news-card; stagger emulado con `animation-range` desplazado por `:nth-child(n)`
- [x] 8.5 GSAP equivalentes preservados intactos detras del guard `if (!USE_NATIVE_SCROLL_DRIVEN)` — fallback inmediato sin descomentar nada si hay regresion

### 9. Validacion Fase 3
- [x] 9.1 `openspec validate --strict` PASS, JS syntax check con `node -c` PASS, smoke test HTTP 200 PASS
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
- [x] 11.1 `captureRefCode()` ejecuta en load, lee `?ref=`, valida `[a-z0-9]{4,12}`, guarda en `sessionStorage['cs_ref']`
- [x] 11.2 `wlRegister(email, refCode)` llama `register_waitlist` con el ref del storage; **wrapper con fallback**: si la RPC no existe (codigo `42883`/`PGRST202`), cae al INSERT directo para sobrevivir el periodo pre-migracion
- [x] 11.3 Markup `#wl-success` agregado (hidden por defecto): posicion grande con gradient + count-up, total, codigo `<code>` copiable, 3 share buttons
- [x] 11.4 `wlShareUrls()` construye `https://citystream.co/?ref=XXX&utm_source=twitter|whatsapp`; Copy link copia URL al clipboard
- [x] 11.5 `wlStartPolling()` con `setInterval(30000)` gated por `document.visibilityState === 'visible'`
- [x] 11.6 Confetti CSS-only: 8 `<span>` posicionados, `@keyframes wl-confetti-fall` 1.6s. Suprimido bajo `prefers-reduced-motion: reduce`

### 12. Counter bar
- [x] 12.1 `get_waitlist_count()` original preservado (la migracion no lo redefine para evitar overrides accidentales). Social proof adicional ya queda cubierto por la pantalla post-submit

### 13. Validacion Fase 4
- [x] 13.1 `node -c main.js` pasa; `openspec validate --strict` pasa; smoke test HTTP 200
- [ ] 13.2 Test E2E con 5 referidos — **manual (requiere ejecutar la migracion y registrar emails de prueba)**
- [ ] 13.3 Test doble registro — **manual** (la RPC ya devuelve la posicion existente sin lanzar 23505 al cliente)
- [ ] 13.4 Mobile 375px — **manual (visual check en DevTools responsive)**
- [ ] 13.5 RLS audit con `supabase.from('waitlist').select('*')` desde DevTools — **manual post-migracion**

## Fase 5 — PWA + Push

### 14. PWA basico
- [x] 14.1 `manifest.webmanifest`: name, short_name, start_url con utm_source, display+display_override, theme/bg color #0a0a0a, icons 32/180/192/512/maskable-512, shortcuts (Lista de espera), screenshots, lang es-CO
- [x] 14.2 `image/pwa/maskable-512.png` generado con PIL (composite del 512 sobre safe area 80% + bg #0a0a0a, 84KB)
- [x] 14.3 `<link rel="manifest" href="/manifest.webmanifest">` en head
- [x] 14.4 `sw.js` con 3 estrategias: cache-first same-origin, stale-while-revalidate CDNs, network-only Supabase/CF Analytics. Offline fallback `offline.html`. Push handler + notificationclick router
- [x] 14.5 SW registration en main.js: gated por `'serviceWorker' in navigator` + `https:` (dev local skipea con info log)
- [x] 14.6 `CACHE_VERSION = 'v1'` → `CACHE_NAME = citystream-v1`. Limpieza automatica en activate

### 15. Banner de instalacion
- [x] 15.1 `beforeinstallprompt` capturado y `e.preventDefault()`; boton aparece solo si la pantalla post-submit esta visible (wrap `wlRenderSuccessScreen`)
- [x] 15.2 Tracking via `navigator.sendBeacon` a Cloudflare RUM con `name: 'pwa_installed'` en `appinstalled` event

### 16. Push notifications opt-in
- [x] 16.1 Constante `VAPID_PUBLIC_KEY = ''` placeholder en main.js; doc completa en `supabase/README.md` para generar el par (web-push CLI / openssl) y guardar private en Vault. **Si VAPID_PUBLIC_KEY queda vacia, el boton de push no aparece** (degrade silencioso)
- [x] 16.2 `supabase/migrations/20260527_add_push_subs.sql`: tabla con `endpoint UNIQUE`, `email FK soft a waitlist`, `user_agent`, timestamps
- [x] 16.3 RPC `subscribe_push(email, endpoint, p256dh, auth, ua)` con SECURITY DEFINER, valida formato email, exige email en waitlist, UPSERT on conflict endpoint
- [x] 16.4 Boton `#wl-push-btn` en pantalla post-submit, agrupado en `.wl-pwa-actions` junto al install
- [x] 16.5 Click → `Notification.requestPermission()` → `pushManager.subscribe({ userVisibleOnly, applicationServerKey })` → `supabaseClient.rpc('subscribe_push', ...)`. Estado visual `wl-pwa-done` al subscribir
- [x] 16.6 Multi-layer fallback: `pushIsSupported()` chequea SW+PushManager+Notification+VAPID; `permission === 'denied'` oculta; `getSubscription()` ya suscrito muestra `'✓ Notificaciones activas'`; error en subscribe oculta sin mensaje al usuario

### 17. Validacion Fase 5
- [x] 17.1 `openspec validate --strict` PASS, JSON manifest valido, JS syntax PASS para main.js y sw.js
- [ ] 17.2 Lighthouse PWA audit — **manual (corre via Lighthouse CI en PR; ver `.github/workflows/lighthouse.yml`)**
- [ ] 17.3 Instalar en Android Chrome — **manual (requiere device fisico + HTTPS deploy)**
- [ ] 17.4 Suscribir push en Chrome — **manual (requiere VAPID keys generadas + migracion ejecutada)**
- [ ] 17.5 Test offline — **manual (Chrome DevTools > Network > Offline + verify offline.html sirve)**

## Fase 6 — Validacion global

- [ ] 18.1 `openspec validate add-launch-readiness-2026 --strict` pasa sin errores
- [ ] 18.2 Lighthouse total: Performance ≥95, A11y ≥95, Best Practices ≥95, SEO 100, PWA ≥90
- [ ] 18.3 Security headers test (securityheaders.com) score A+
- [ ] 18.4 Accesibilidad WCAG 2.2 AA: ejecutar axe-core en la pagina (`npx @axe-core/cli https://citystream.co`)
- [ ] 18.5 Browser matrix: Chrome 130, Firefox 144, Safari 17/26, Samsung Internet, mobile Safari iOS 17/18
- [ ] 18.6 Bundle size: JS total transferido < 130KB gzipped en navegadores con scroll-driven nativo

## Dependencias entre fases

- Fase 2 (consent checkbox) **depende de** Fase 4 cambios al form? **No** — son edits ortogonales del mismo form, mergeables en cualquier orden
- Fase 5 (push opt-in en pantalla post-submit) **depende de** Fase 4 (pantalla post-submit existe)
- Fase 3 puede correr en paralelo a las demas (toca solo CSS/JS de animaciones)
- Fase 1 es 100% independiente, ideal para mergear primero y validar Lighthouse baseline
