## MODIFIED Requirements

### Requirement: Content Security Policy via meta tag
El `<head>` del documento SHALL contener una meta tag `Content-Security-Policy` que define las fuentes permitidas para scripts, estilos, fuentes, imágenes y conexiones de red, restringiendo la ejecución de código de orígenes no autorizados. La policy SHALL extenderse para soportar Service Worker (`worker-src 'self'`), Web Push (`connect-src` con endpoints de push services), y self-hosted fonts (eliminando dependencia de fonts.gstatic.com).

#### Scenario: Intento de inyección XSS
- **WHEN** un atacante logra inyectar `<script src="https://evil.com/payload.js">` en el DOM
- **THEN** la CSP bloquea la carga porque `evil.com` no está en la allowlist de `script-src`
- **AND** el script malicioso no se ejecuta

#### Scenario: Recursos legitimos cargando (font self-hosted)
- **WHEN** el sitio carga sus scripts y estilos normales (GSAP, Lenis, Splitting, Supabase, Cloudflare, web-vitals) y la fuente Geist self-hosted desde `static/fonts/`
- **THEN** todos los recursos cargan correctamente porque sus dominios estan en la allowlist
- **AND** el `font-src` ya no incluye `https://fonts.gstatic.com` ni `style-src` `https://fonts.googleapis.com` (si el self-host es la unica fuente de fuentes)

#### Scenario: Service Worker se registra
- **WHEN** `navigator.serviceWorker.register('/sw.js')` se ejecuta
- **THEN** la CSP `worker-src 'self'` permite la carga del SW
- **AND** el SW puede interceptar fetches y servir desde cache

#### Scenario: Push subscription
- **WHEN** `pushManager.subscribe()` resuelve y el cliente envia el endpoint a Supabase
- **THEN** la peticion al endpoint Supabase (`zeqnlntgimxtjuffoilg.supabase.co`) pasa porque ya esta en `connect-src`
- **AND** ningun dominio adicional es necesario en la CSP para esta operacion (el envio real de pushes lo hace el server, no el cliente)

## ADDED Requirements

### Requirement: Permissions Policy Header
El sitio SHALL declarar un header `Permissions-Policy` (via Cloudflare Workers o meta tag equivalente cuando posible) que deshabilita explicitamente APIs sensibles no usadas por el sitio: `camera=()`, `microphone=()`, `geolocation=()`, `payment=()`, `usb=()`, `interest-cohort=()` (FLoC opt-out).

#### Scenario: Intento de uso de camara desde script inyectado
- **WHEN** un script malicioso intenta llamar `navigator.mediaDevices.getUserMedia({ video: true })`
- **THEN** el navegador rechaza la peticion por Permissions-Policy
- **AND** la promesa rejecta con NotAllowedError

#### Scenario: Verificacion del header en produccion
- **WHEN** se inspeccionan los response headers con `curl -I https://citystream.co/`
- **THEN** el header `Permissions-Policy` esta presente con la lista de directivas
- **AND** securityheaders.com reporta el header como presente y configurado

### Requirement: Robots.txt con Reglas para Crawlers de IA
El archivo `robots.txt` SHALL declarar reglas explicitas para crawlers de busqueda tradicional (Googlebot, Bingbot) y para crawlers de IA (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended), definiendo Allow/Disallow por path segun politica del proyecto.

#### Scenario: GPTBot crawl del landing
- **WHEN** GPTBot hace `GET /robots.txt`
- **THEN** ve `User-agent: GPTBot` con `Allow: /` para contenido publico
- **AND** `Disallow: /privacidad/`, `Disallow: /terminos/`, `Disallow: /waitlist/` (paths con datos personales o procesamiento)

#### Scenario: Sitemap declarado
- **WHEN** cualquier crawler procesa robots.txt
- **THEN** encuentra la directiva `Sitemap: https://citystream.co/sitemap.xml`
- **AND** opcionalmente `Sitemap: https://citystream.co/llms.txt` para discoverability de LLMs

### Requirement: Service Worker Versionado
El service worker `sw.js` SHALL usar un cache name versionado (e.g., `citystream-v1`, `citystream-v2`) que se incrementa manualmente en cada release, garantizando limpieza de caches obsoletas en el evento `activate`.

#### Scenario: Update del SW elimina cache vieja
- **WHEN** se publica `sw.js` con `CACHE_NAME = 'citystream-v2'`
- **THEN** el SW nuevo, en su evento `activate`, itera las caches existentes y elimina todas las que no sean `citystream-v2`
- **AND** los usuarios reciben los nuevos assets en su siguiente recarga sin necesidad de hard-refresh
