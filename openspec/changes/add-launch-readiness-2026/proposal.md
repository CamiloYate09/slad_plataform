# Change: Launch Readiness 2026 — Growth, Performance, Compliance & AI Discoverability

## Por qué

CityStream tiene un landing visualmente premium y técnicamente sólido (CSP+SRI+Turnstile, GSAP+Lenis, glassmorphism, particles, View Transitions). Sin embargo, está en **pre-lanzamiento con waitlist**, y según las tendencias de mercado 2026 le faltan 6 capas críticas que distinguen un pre-launch "bonito" de uno "listo para escalar":

1. **AI/LLM Discoverability** — Los buscadores ya no son la única puerta. ChatGPT, Claude, Perplexity y Gemini citan sitios como fuente cuando hay `llms.txt` y schema.org enriquecido. Sin esto, CityStream queda invisible en el 30%+ del tráfico informacional de 2026.
2. **Waitlist viral (referral)** — El pre-launch SaaS estándar 2025-2026 (Superhuman, Robinhood, Arc) gana 5-15× más inscritos cuando la lista expone posición + código de referido. Hoy el waitlist es estático (solo cuenta + email).
3. **PWA + Push notifications** — El waitlist promete "te avisamos cuando lancemos", pero no hay canal técnico para hacerlo. Email tiene 20% open rate; push tiene 60%+. Además, instalable = retención.
4. **Scroll-driven animations CSS nativo** — `animation-timeline: scroll()/view()` es Baseline 2025. Migrar 30-40% de los ScrollTriggers a CSS nativo reduce el JS bundle, mejora INP y mantiene la calidad visual.
5. **Performance pack 2026** — AVIF (40% más liviano que WebP), font subsetting Geist (-200KB), Speculation Rules para prerender, INP attribution. Core Web Vitals 2026 mide INP, no FID.
6. **Compliance Ley 1581/2012 Colombia** — El waitlist recolecta email (dato personal). Sin política de privacidad publicada, consentimiento informado y cookie banner, CityStream incumple la Ley 1581 de Habeas Data y arriesga sanción de la SIC (hasta 2.000 SMMLV).

## Qué cambia

### Eje 1 — AI/LLM Discoverability (nueva capability `ai-discoverability`)
- `llms.txt` y `llms-full.txt` en raíz describiendo CityStream para LLMs
- `robots.txt` extendido con políticas explícitas para GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended (allow indexing de marca, disallow de waitlist)
- Schema.org enriquecido: `Organization` ampliado, `WebSite` con `SearchAction`, `FAQPage` para sección de preguntas (nueva), `Place` para cada ciudad (Bogotá/Medellín/Cartagena/Cali/Barranquilla)

### Eje 2 — Waitlist Referral (MODIFIED `waitlist-data`, `waitlist-ui`)
- Tabla `waitlist` agrega columnas: `referral_code` (slug único de 6 chars), `referred_by` (FK a referral_code), `position` (computed)
- RPC `get_waitlist_position(email)` devuelve {position, total, referral_code, referred_count}
- UI post-submit muestra: posición ("Eres el #1.234"), código de referido copiable, share buttons (X, WhatsApp, link)
- Cada referido válido sube N posiciones (configurable; default 10)

### Eje 3 — PWA + Push (nueva capability `pwa`)
- `manifest.webmanifest` con icons, theme, display=standalone, shortcuts
- Service worker mínimo: cache-first para shell estático, network-first para Supabase, offline fallback
- Banner de instalación contextual (post-submit waitlist) usando `beforeinstallprompt`
- Push subscription opt-in en pantalla de confirmación de waitlist; tokens persistidos en Supabase tabla `push_subs`

### Eje 4 — Scroll-driven Animations CSS Nativo (nueva capability `scroll-driven-animations`)
- Migrar a CSS nativo (donde sea seguro): `bg-texture` parallax, progress bar del hero, fade-in de `news-card`, `num-card` entrance
- `animation-timeline: view()` con `animation-range: entry/exit`
- Fallback: `@supports not (animation-timeline: scroll())` mantiene GSAP equivalente
- Lazy-load de GSAP/ScrollTrigger si el navegador soporta scroll-driven nativo (reducción esperada: ~70KB en navegadores modernos)

### Eje 5 — Performance 2026 (nueva capability `performance-2026`)
- AVIF + WebP + JPG en `<picture>` (AVIF first, decode 40% más rápido)
- Geist font subset latin (sin cirílico/griego) → reducción ~200KB transferidos
- `<script type="speculationrules">` para prerender de #features, #waitlist
- `defer` y `fetchpriority` afinados; `preload` solo para LCP real
- INP monitoring con `web-vitals` v4 (CDN, sin bundle) reportando a Cloudflare Analytics
- Lighthouse CI badge en README (target: 95+ all categories)

### Eje 6 — Compliance Ley 1581/2012 (nueva capability `legal-compliance`)
- Página `/privacidad/` con política conforme Ley 1581, Decreto 1377/2013 y Circular SIC 003/2018: finalidad, derechos del titular, encargado, contacto del responsable (CityStream + canal habeas data)
- Página `/terminos/` con términos de uso
- Cookie consent banner mínimo (solo si se agregan cookies no-esenciales; hoy solo Cloudflare Insights — declarable como cookie técnica exenta, pero el banner informa)
- Checkbox de consentimiento explícito en el form de waitlist (`aria-required`, no autosubmit)
- Footer agrega links a Privacidad, Términos, Habeas Data

## Lo que NO cambia

- Stack base (vanilla HTML/CSS/JS, sin build tools, GitHub Pages)
- Estructura de secciones del landing (orden factory.ai existente)
- Stack de animaciones GSAP (sigue como base; sólo se complementa con CSS nativo donde aplica)
- Color palette, tipografía Geist, branding
- Endpoint Supabase actual (se extiende, no se reemplaza)

## Impacto

- **Specs nuevas:** `ai-discoverability`, `pwa`, `scroll-driven-animations`, `performance-2026`, `legal-compliance`
- **Specs modificadas:** `waitlist-data` (schema referral), `waitlist-ui` (post-submit screen, consent), `static-hardening` (CSP para SW + push, Permissions-Policy, llms.txt bot rules)
- **Archivos de código:** `index.html`, `static/css/style.css`, `static/js/main.js`, `static/img/*.avif` (nuevos), `manifest.webmanifest` (nuevo), `sw.js` (nuevo), `llms.txt` + `llms-full.txt` (nuevos), `privacidad.html` + `terminos.html` (nuevos), `robots.txt` (modificado)
- **Backend Supabase:** migración SQL para columnas `referral_code`, `referred_by`, `position`, tabla `push_subs`, nueva RPC `get_waitlist_position`
- **Sin nuevas dependencias JS** en runtime (web-vitals v4 via CDN, SW vanilla, sin frameworks)
- **Breaking:** ninguno — el waitlist actual sigue funcionando; las columnas nuevas son nullable y los referidos son opcionales

## Métricas objetivo (post-deploy)

| Métrica | Baseline actual | Target post-launch |
|---|---|---|
| Lighthouse Performance | ~85 (estim.) | ≥95 |
| INP p75 | sin medir | <200ms |
| Waitlist viral coefficient (k) | 0 (no referral) | ≥0.3 |
| Citas en LLMs (Perplexity test) | sin medir | aparecer en top 5 para "red social Colombia" |
| Cumplimiento Ley 1581 | parcial (sin política publicada) | total |
| Tamaño total JS transferido | ~180KB | ~110KB (escenario CSS-nativo) |
