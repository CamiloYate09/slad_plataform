## ADDED Requirements

### Requirement: CTA Section — Tarjeta Oscura Pre-Footer

La sección `.cta-section` SHALL reemplazar su implementación actual por una tarjeta oscura prominente estilo factory.ai, centrada en la página con un ancho máximo de 760px. La tarjeta SHALL contener:
- Un label superior en monospace con punto naranja decorativo y texto en mayúsculas (ej. `• ÚNETE A LA RED`)
- Un heading principal grande (h2) en texto claro
- Un subtexto secundario en monospace con tono atenuado
- Un botón/enlace CTA de acción principal con flecha (ej. `DESCARGAR APP →`) en estilo prominente
- Fondo negro (`#0a0a0a`) con borde sutil `1px solid rgba(255,255,255,0.1)` y `border-radius: 12px`

La tarjeta SHALL:
- Tener padding interno generoso (`64px 48px` en desktop, `40px 24px` en mobile)
- Mostrar hover state en el botón CTA (cambio de opacidad o background)
- Ser funcional en ambos temas (siempre oscura, como factory.ai)

La implementación anterior de `.cta-section` (texto simple centrado con botón básico) SHALL ser reemplazada completamente.

#### Scenario: Tarjeta visible antes del footer

- **WHEN** el usuario hace scroll hasta el final de la página antes del footer
- **THEN** aparece una tarjeta oscura prominente con label, heading grande, subtexto y botón CTA

#### Scenario: Hover en botón CTA

- **WHEN** el usuario hace hover sobre el botón de la tarjeta CTA
- **THEN** el botón muestra un estado de hover con cambio visual (ej. fondo naranja, cambio de opacidad)

#### Scenario: CTA en mobile

- **WHEN** el viewport es ≤480px
- **THEN** la tarjeta usa ancho completo con padding reducido y el texto es legible y el botón fácil de tocar

#### Scenario: CTA siempre oscura

- **WHEN** el usuario activa el tema claro del sitio
- **THEN** la tarjeta CTA se mantiene oscura (fondo negro), creando contraste intencional antes del footer
