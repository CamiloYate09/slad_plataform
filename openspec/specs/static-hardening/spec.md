# static-hardening Specification

## Purpose
Endurecimiento del sitio estático desde el propio HTML: CSP, integridad de recursos externos y política de Referer.

## Requirements

### Requirement: Content Security Policy via meta tag
El `<head>` del documento SHALL contener una meta tag `Content-Security-Policy` que define las fuentes permitidas para scripts, estilos, fuentes, imágenes y conexiones de red, restringiendo la ejecución de código de orígenes no autorizados.

#### Scenario: Intento de inyección XSS
- **WHEN** un atacante logra inyectar `<script src="https://evil.com/payload.js">` en el DOM
- **THEN** la CSP bloquea la carga porque `evil.com` no está en la allowlist de `script-src`
- **AND** el script malicioso no se ejecuta

#### Scenario: Recursos legítimos cargando
- **WHEN** el sitio carga sus recursos: scripts, estilos, fuentes e imágenes propios (`'self'`) y Cloudflare Web Analytics
- **THEN** todos cargan correctamente porque están en la allowlist
- **AND** `script-src` no incluye ningún CDN de librerías: las de terceros se sirven desde `static/vendor/`

### Requirement: Referrer Policy meta tag
El `<head>` SHALL contener `<meta name="referrer" content="strict-origin-when-cross-origin">` para evitar que la URL completa de la página sea enviada como Referer a terceros.

#### Scenario: Usuario hace clic en enlace externo
- **WHEN** un usuario hace clic en un enlace a YouTube, Facebook, o cualquier sitio externo
- **THEN** solo se envía el origen (`https://citystream.tech`) como Referer, no la URL completa ni parámetros

### Requirement: Recursos de Terceros
Las librerías de terceros SHALL servirse desde `static/vendor/` con su hash en el atributo `integrity`, en lugar de cargarse desde un CDN. El único script externo permitido SHALL ser el beacon de Cloudflare Web Analytics, que va sin `integrity` porque Cloudflare lo sirve en una URL sin versión; su alcance lo limita la CSP a `static.cloudflareinsights.com` (script) y `cloudflareinsights.com` (conexiones).

#### Scenario: Librería alterada
- **WHEN** un archivo de `static/vendor/` no coincide con el hash de su atributo `integrity`
- **THEN** el navegador no lo ejecuta y registra un error SRI en la consola

#### Scenario: Beacon de analítica
- **WHEN** la página carga el beacon de Cloudflare Web Analytics
- **THEN** se carga desde `https://static.cloudflareinsights.com/beacon.min.js`, permitido por `script-src`
- **AND** solo puede enviar datos a `https://cloudflareinsights.com`, permitido por `connect-src`

#### Scenario: Script externo nuevo
- **WHEN** se añade un `<script>` de cualquier otro origen externo
- **THEN** la CSP lo bloquea hasta que la librería se aloje en `static/vendor/`
