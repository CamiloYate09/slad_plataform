# Change: Hardening de Seguridad — Protección Real para una Landing Estática

## Why

La pregunta "¿puede la IA romper todo?" merece una respuesta honesta: **sí puede automatizar ataques más rápido, pero los riesgos reales para una landing estática son específicos y defendibles**. El sitio actual tiene dos vulnerabilidades concretas y manejables:

1. **Sin Subresource Integrity (SRI)** — Si un hacker compromete uno de los CDNs externos (cdnjs, unpkg, jsdelivr), puede inyectar código malicioso que roba datos de tus usuarios. Esto ya ocurrió en Polyfill.io en 2024, afectando 100,000 sitios.

2. **Sin protecciones HTTP** — Sin headers como CSP, X-Frame-Options, y HSTS, el sitio es vulnerable a clickjacking, inyección de scripts, y ataques de downgrade HTTPS.

3. **Sin protección de bots en el formulario** — La lista de espera puede ser spameada por bots automatizados, llenando la BD con emails falsos y degradando la calidad de tu lista de lanzamiento.

## Qué no se puede hacer (y por qué)

Antes de hablar de lo que SÍ se implementa, es importante aclarar:

- **Encriptar el HTML/JS del sitio es imposible** — el navegador necesita leerlo para mostrarlo. Cualquier "ofuscación" puede ser revertida por cualquier herramienta de IA en segundos.
- **La clave `anon` de Supabase siempre será visible en el cliente** — pero eso ya está resuelto con el RLS INSERT-only implementado anteriormente. Aunque la encuentren, no pueden leer emails.
- **No existe un "100% invulnerable"** — el objetivo es elevar el costo de un ataque tanto que no valga la pena.

## Qué cambia — 4 capas de defensa

### Capa 1 — Subresource Integrity (SRI) en HTML ★★★★★
**Qué protege:** Ataques de cadena de suministro (supply chain) — si hackean los CDN externos.
**Cómo funciona:** El navegador verifica que el archivo descargado del CDN tiene exactamente el hash SHA-384 que declaraste en el HTML. Si alguien inyecta código en el CDN, el hash no coincide y el script **no se ejecuta**.

Hashes generados para los 7 recursos CDN actuales (Supabase, Splitting, Lenis, GSAP, ScrollTrigger, tsParticles, RemixIcon).

### Capa 2 — Headers HTTP vía Cloudflare Transform Rules ★★★★★
**Qué protege:** XSS, clickjacking, sniffing de MIME type, downgrade de HTTPS, fuga de datos en Referer.
**Por qué Cloudflare y no el HTML:** GitHub Pages no permite configurar HTTP headers. Pero ya usas Cloudflare Analytics — el dominio `citystream.co` ya pasa por Cloudflare (o es muy fácil activarlo). Con las Transform Rules del plan Free puedes añadir 5 headers en 2 minutos desde el dashboard sin tocar código.

Headers a añadir:
- `X-Frame-Options: DENY` — clickjacking
- `X-Content-Type-Options: nosniff` — MIME sniffing
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` — fuerza HTTPS para siempre
- `Referrer-Policy: strict-origin-when-cross-origin` — evita filtrar URL completa a terceros
- `Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()` — bloquea APIs peligrosas

### Capa 3 — Content Security Policy (CSP) meta tag ★★★☆☆
**Qué protege:** XSS (inyección de scripts). Un atacante que logre inyectar `<script>` en el DOM no podrá ejecutarlo si el origen no está en la allowlist.
**Limitación honesta:** Una CSP en meta tag (no header HTTP) no protege contra todos los vectores XSS. La versión completa va en el header HTTP (Capa 2). La meta tag es la capa de defensa en profundidad.

### Capa 4 — Cloudflare Turnstile en formulario de waitlist ★★★★☆
**Qué protege:** Bots automatizados que llenan el formulario con emails falsos masivamente.
**Por qué Turnstile y no reCAPTCHA:** Turnstile es de Cloudflare, es gratis, invisible para usuarios reales (no hay "selecciona los semáforos"), y respeta la privacidad (no trackea como Google reCAPTCHA).
**Implementación:** Un token invisible se genera en el navegador y se valida server-side — como no tenemos servidor hoy, la validación se hace en Supabase Edge Functions o se documenta para el backend Go.

---

## Modelo de amenazas realista

| Amenaza | Probabilidad | Impacto | Mitigado por |
|---------|-------------|---------|-------------|
| CDN comprometido inyecta malware | Media | Crítico | SRI (Capa 1) |
| Clickjacking (iFrame trampa) | Media | Alto | X-Frame-Options (Capa 2) |
| XSS via formulario | Baja (ya validamos) | Alto | CSP (Capa 3) |
| Bot spam en waitlist | Alta | Medio | Turnstile (Capa 4) |
| Robo de clave anon Supabase | Alta | Ninguno | RLS ya configurado |
| "Hackeo" de HTML/JS del sitio | N/A | N/A | Imposible de prevenir en cliente |

---

## Afectados

- `index.html` — SRI en scripts/links CDN + CSP meta tag + Turnstile widget
- `static/js/main.js` — Validación del token Turnstile antes del submit de waitlist
- Cloudflare Dashboard — Transform Rules para HTTP headers (instrucciones en design.md)
- No se toca: CSS, imágenes, estructura de secciones

## No se toca

- Supabase RLS (ya está correcto)
- Animaciones, estilos, contenido de la página
