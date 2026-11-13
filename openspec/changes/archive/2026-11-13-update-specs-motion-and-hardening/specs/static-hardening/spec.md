## MODIFIED Requirements

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
