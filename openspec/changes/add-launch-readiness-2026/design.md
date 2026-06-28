# Design — Launch Readiness 2026

## Context

CityStream es un landing estático en GitHub Pages (sin backend propio, sin build tools, sin frameworks) con stack vanilla + GSAP + Lenis + Splitting.js, y conexión client-side a Supabase para el waitlist. Esta propuesta atraviesa 6 ejes que tocan: discoverability (HTTP + meta), modelo de datos (Supabase), runtime cliente (SW + push), animaciones (CSS nativo vs GSAP), assets (AVIF + font subset), y superficie legal (páginas nuevas + consentimiento).

Stakeholders: Camilo (owner), usuarios early-adopter del waitlist, SIC (regulador colombiano de Habeas Data), motores de IA (GPT, Claude, Perplexity).

Constraints duras:
- **Hosting:** GitHub Pages — sin server, sin headers customizables (los headers HTTP avanzados como `Permissions-Policy`, COOP/COEP, HSTS-preload tienen que ir vía Cloudflare front proxy ya en uso)
- **Sin build tools:** prohibido introducir Vite/Webpack/PostCSS. Todo lo nuevo debe correr nativo en el navegador
- **Supabase free tier:** RLS estricta (anon solo INSERT). Las RPC nuevas deben mantener el principio de "ningún email expuesto al cliente"
- **Bundle size budget:** total JS transferido debe bajar, no subir, a pesar de las features nuevas

## Goals / Non-Goals

### Goals
- Cumplimiento Ley 1581/Decreto 1377 antes de que el waitlist supere los 1.000 emails
- Sistema de referral funcional end-to-end (codigo, posicion, share, contador de referidos)
- PWA instalable con push opt-in en confirmacion de waitlist
- Reduccion neta de JS transferido aunque sumemos PWA + referral
- Schema.org y `llms.txt` que permitan a Perplexity/Claude citar CityStream para queries sobre "red social Colombia"

### Non-Goals
- No es alcance: editor visual, backend propio, dashboard admin, login de usuarios, feed de la app real
- No es alcance: i18n a otros idiomas (es-CO sigue siendo el unico locale)
- No es alcance: notifications transaccionales por email (eso lo cubre Supabase Auth/Edge Functions en otra fase)
- No es alcance: A/B testing framework (se puede en un proposal posterior)
- No es alcance: migrar GSAP completo a CSS nativo — solo donde el navegador soporta y el efecto se preserva 1:1

## Decisions

### D1 — Referral code: slug nanoid de 6 chars en columna PostgreSQL `text`, default vía `gen_random_uuid` truncado
- **Por qué:** colision rate aceptable hasta ~36⁶ ≈ 2B combinaciones; codigo memorable y URL-friendly (`citystream.co/?ref=ab12cd`)
- **Alternativa descartada:** hash determinista del email — viola privacidad (reversible con diccionario), y no permite revocar/regenerar
- **Alternativa descartada:** integer secuencial — predecible, permite scraping del orden de inscripciones

### D2 — Position calculation: `ROW_NUMBER() OVER (ORDER BY created_at)` en la RPC, NO columna materializada
- **Por qué:** posicion cambia con cada nuevo registro y con cada referido — materializar requiere triggers, más estado, más bugs. La query es O(n) sobre indice y para 100K filas se ejecuta en <50ms en Supabase free
- **Trade-off:** si el waitlist supera 1M emails, migrar a vista materializada con refresh por cron. Documentar como umbral para revisitar

### D3 — Push notifications: Web Push API standard (VAPID), no FCM/APNs
- **Por qué:** Web Push funciona sin SDK de terceros (Firebase = ~80KB), es estandar W3C, y los tokens se persisten directamente en Supabase. Apple soporta Web Push en Safari 16.4+ como PWA instalada
- **Server side:** la *envio* de pushes lo hara un edge function de Supabase en una fase posterior. Por ahora solo capturamos subscripciones (el `endpoint` y `keys`)
- **Alternativa descartada:** OneSignal — tracker comercial, viola intencion privacidad-first

### D4 — Scroll-driven animations: feature-detection con `@supports` y carga condicional de GSAP
- **Por qué:** `animation-timeline: scroll()` es Baseline 2025 (Chrome 115+, Firefox 144+, Safari 26+). En el ~85% del trafico actual ya funciona nativo. Para el 15% restante, GSAP sigue como fallback
- **Implementacion JS:** `if (CSS.supports('animation-timeline', 'scroll()')) { /* skip GSAP load */ }` antes del `<script src=".../gsap.min.js">`. En la practica, se separan los ScrollTriggers en dos buckets: los "trivialmente migrables" (parallax simple, fade-in, progress bar) van a CSS; los "complejos" (sticky narrative con pinning, scramble, magnetic) se quedan en GSAP
- **Trade-off:** doble codigo (CSS + GSAP) en algunos casos. Mitigado restringiendo migracion a 4 efectos concretos

### D5 — AVIF: agregamos como primer `<source>` en `<picture>`, NO reemplazamos WebP
- **Por qué:** AVIF tiene 95% browser support (jul 2025), pero el 5% restante (Safari <16) cae a WebP. Preservar WebP es 1 source extra por imagen — costo nulo
- **Conversion:** script bash con `avifenc` o `cwebp` corrido localmente; las nuevas imagenes commiteadas al repo. Sin pipeline de build en CI por ahora

### D6 — Cookie banner: solo si el sitio agrega cookies no-esenciales
- **Por qué:** Cloudflare Insights (`static.cloudflareinsights.com`) NO setea cookies (usa beacon GET con query params). Por lo tanto, **NO es obligatorio mostrar banner**, pero la Circular SIC 003/2018 sí exige aviso informativo previo a captura de datos personales
- **Decision:** un *aviso* (no banner bloqueante) en el footer + checkbox de consentimiento explicito antes del submit del waitlist. Si en el futuro se agrega analytics con cookies, se eleva a banner
- **Alternativa descartada:** banner siempre — friction innecesaria, mata conversion del waitlist

### D7 — Schema.org: separar JSON-LD en multiples `<script>` por tipo
- **Por qué:** ya existen 2 scripts JSON-LD (Organization + WebSite). Anidar todo en uno hace dificil mantener. Agregamos: `FAQPage`, `Place` (uno por ciudad, dentro de `ItemList`), `Event` placeholder para cuando lancemos el feed real
- **Validacion:** Google Rich Results Test antes de mergear

### D8 — llms.txt: dos archivos en raiz (`llms.txt` corto + `llms-full.txt` extendido)
- **Por qué:** convencion emergente (llmstxt.org). El corto es indice; el largo contiene contenido completo (FAQ, descripcion de features, datos de ciudades) para que el LLM lo ingiera de una sola request
- **Sin auth, sin gating** — la intencion es que los crawlers lo lean libremente

### D9 — Bot rules en robots.txt: allow indexing, disallow training
- **Por qué:** queremos que GPTBot/ClaudeBot citen CityStream (`Allow: /`) pero NO queremos que `Anthropic-AI/User-Agent` o similar entrene LLMs propietarios con nuestro contenido. La distincion la marcan los user-agents:
  - `GPTBot` — crawler de OpenAI para training. Politica: `Disallow: /waitlist` y `Disallow: /privacidad` (datos personales)
  - `OAI-SearchBot` — crawler para ChatGPT Search. Politica: `Allow: /`
  - `ClaudeBot` — crawler de Anthropic. Politica: `Allow: /` (Anthropic respeta este UA)
  - `PerplexityBot` — Politica: `Allow: /`
  - `Google-Extended` — opt-out Gemini training. Politica: `Disallow: /waitlist`

## Risks / Trade-offs

| Riesgo | Mitigacion |
|---|---|
| Referral code colision a escala 1M | UNIQUE constraint en columna; retry con nuevo random si conflicto |
| Push subscription endpoint expira | Re-subscribe en cada visita PWA y upsert a la tabla |
| Service worker rompe el sitio si bug | Versionado de SW + estrategia "cache then network" para shell; killswitch via `unregister()` rapido |
| AVIF en navegador sin soporte rompe layout | `<picture>` con fallback WebP/JPG — comportamiento estandar |
| Cookie banner mata conversion | NO usamos banner bloqueante; checkbox in-form con default unchecked y label corto |
| Politica de privacidad incompleta vs SIC | Revisar plantilla con abogado antes de publicar; mientras tanto, version v1 conservadora (mas restrictiva de lo necesario) |
| Migrar a CSS scroll-driven rompe efectos visuales | Migracion incremental: 4 efectos al inicio; visual regression test manual en cada efecto antes de quitar el equivalente GSAP |
| llms.txt no es estandar W3C aun | Cero costo de crearlo; si la convencion cambia, actualizamos sin dependencias rotas |

## Migration Plan

Fases en orden de menor riesgo a mayor:

1. **Fase 1 — Discoverability + Performance "puros" (sin Supabase):** llms.txt, robots.txt bot rules, schema enriquecido, AVIF, font subset, Speculation Rules, INP monitoring. Reversibles, no tocan datos.
2. **Fase 2 — Compliance:** publicar privacidad.html y terminos.html. Agregar checkbox de consentimiento al form. Aviso en footer. Sin nuevo backend.
3. **Fase 3 — Scroll-driven CSS:** migrar los 4 efectos uno por uno, con visual check despues de cada uno.
4. **Fase 4 — Waitlist referral (backend + UI):** migracion SQL en Supabase (nullable columns + RPC). UI agrega pantalla post-submit. Backwards compatible — emails ya inscritos siguen funcionando, sin codigo de referido visible hasta que regeneren.
5. **Fase 5 — PWA + push:** manifest + SW basico. Push opt-in solo despues de que la pantalla post-submit este live.

**Rollback:** cada fase es independiente y revertible con un `git revert`. La migracion SQL de Fase 4 es additive only — el rollback no requiere DROP COLUMN.

## Open Questions

1. ¿Quien firma la politica de privacidad como "responsable del tratamiento"? Persona natural Camilo o entidad juridica CityStream SAS? Esto define el contacto legal en el documento.
2. ¿VAPID keys nuevas para push se almacenan donde? Repo privado de configs, Cloudflare env vars, o Supabase Vault? Sugerencia: Supabase Vault desde el inicio.
3. Bonus de posiciones por referido — ¿es lineal (10 posiciones por referido) o exponencial (10, 20, 40...)? Lineal es mas explicable a usuarios; exponencial maximiza viralidad pero introduce gaming.
4. ¿Mantenemos el cursor custom + magnetic CTA si migramos parte de GSAP a CSS? Estos son los efectos "complejos" que no se pueden migrar, asi que GSAP igual queda cargado en el bundle. La pregunta es si en navegadores que soportan scroll-driven nativo vale la pena cargar TODO GSAP o solo el core (sin ScrollTrigger plugin).
