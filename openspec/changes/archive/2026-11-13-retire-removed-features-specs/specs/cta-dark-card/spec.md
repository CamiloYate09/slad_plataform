## MODIFIED Requirements

### Requirement: CTA Section — Tarjeta Oscura Pre-Footer
La sección `.cta-section`, justo antes del footer, SHALL mostrar una tarjeta oscura `.cta-card` centrada, de 760px de ancho máximo, con fondo `#0a0a0a`, borde `1px solid rgba(255, 255, 255, 0.1)` y `border-radius: 16px`. La tarjeta SHALL contener, centrados:
- un label en monospace y mayúsculas, naranja (`--accent-orange-hover`), con punto decorativo: "• Únete a la red";
- un h2 en blanco con el estilo de "Tipografía Editorial" (`visual-theme`);
- un subtexto en monospace atenuado (`rgba(255, 255, 255, 0.45)`);
- una captura de correo (`form[data-signup]`) cuyo botón `.cta-btn` ("Crear cuenta →", píldora blanca en mayúsculas) abre `/registro.html` con el correo escrito, sin enviar nada desde la página.

#### Scenario: Tarjeta visible antes del footer
- **WHEN** el usuario hace scroll hasta el final de la página antes del footer
- **THEN** aparece la tarjeta con label, heading, subtexto y captura de correo
- **AND** su borde brilla en un ciclo de 5 s entre morado, azul y cian

#### Scenario: Hover en botón CTA
- **WHEN** el usuario hace hover sobre el botón de la tarjeta CTA
- **THEN** el botón pasa a fondo naranja (`--accent-orange-hover`) con texto blanco y sube 2px

#### Scenario: CTA en mobile
- **WHEN** el viewport mide 768px o menos
- **THEN** el padding de la tarjeta baja de `4rem 3rem` a `2.5rem 1.5rem`
- **AND** en 480px o menos el campo y el botón se apilan y el botón ocupa todo el ancho, con al menos 44px de alto

#### Scenario: CTA siempre oscura
- **WHEN** el usuario activa el tema claro del sitio
- **THEN** la tarjeta CTA se mantiene oscura (fondo `#0a0a0a`), creando contraste intencional antes del footer
