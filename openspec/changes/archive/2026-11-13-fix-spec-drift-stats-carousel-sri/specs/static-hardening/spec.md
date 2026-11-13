## ADDED Requirements

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

## REMOVED Requirements

### Requirement: Subresource Integrity en todos los recursos CDN externos

**Reason**: Ya no se cargan librerías desde CDN, y el único script externo (el beacon de Cloudflare) no admite un hash fijo.

**Migration**: Ver "Recursos de Terceros" en esta misma spec.
