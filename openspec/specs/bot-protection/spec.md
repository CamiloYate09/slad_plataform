# bot-protection Specification

## Purpose
TBD - created by archiving change harden-security. Update Purpose after archive.
## Requirements
### Requirement: Cloudflare Turnstile en formulario de waitlist
El formulario de lista de espera SHALL incluir el widget de Cloudflare Turnstile para detectar y bloquear envíos automatizados por bots, sin impacto visible en la experiencia de usuarios reales.

#### Scenario: Usuario humano completa el formulario
- **WHEN** un usuario real escribe su email y hace submit
- **THEN** Turnstile genera un token válido silenciosamente en segundo plano
- **AND** el formulario se envía normalmente con el token incluido
- **AND** el usuario no ve ningún CAPTCHA ni puzzle

#### Scenario: Bot automatizado intenta enviar el formulario
- **WHEN** un bot hace submit sin interacción humana real
- **THEN** Turnstile no genera un token válido (o genera uno marcado como sospechoso)
- **AND** el envío puede ser rechazado al validar el token server-side
- **AND** el dashboard de Turnstile registra el intento

#### Scenario: Turnstile no carga (CDN caído)
- **WHEN** el script de Turnstile no está disponible
- **THEN** el formulario sigue siendo funcional (degradación elegante)
- **AND** el submit procede sin validación Turnstile (no se rompe la experiencia)

