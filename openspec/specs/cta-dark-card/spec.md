# cta-dark-card Specification

## Purpose
Tarjeta oscura de cierre antes del footer, con la captura de correo que lleva al registro.

## Requirements

### Requirement: CTA Section — Tarjeta Oscura Pre-Footer
La sección `.cta-section`, justo antes del footer, SHALL mostrar una tarjeta oscura `.cta-card` centrada, de 760px de ancho máximo, con fondo `#0a0a0a`, borde `1px solid rgba(255, 255, 255, 0.1)` y `border-radius: 16px`, oscura en los dos temas.

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

### Requirement: Contenido de la Tarjeta CTA
La tarjeta CTA SHALL contener, centrados: un label naranja en monospace y mayúsculas ("• Únete a la red"), un h2 blanco con el estilo de "Tipografía Editorial" (`visual-theme`), un subtexto en monospace atenuado y una captura de correo (`form[data-signup]`) con el botón `.cta-btn` "Crear cuenta →".

#### Scenario: Captura de correo
- **WHEN** el usuario escribe su correo y pulsa "Crear cuenta"
- **THEN** el navegador abre `/registro.html` con el correo ya escrito, sin enviar nada desde la página

#### Scenario: Botón en píldora blanca
- **WHEN** la tarjeta se renderiza
- **THEN** el botón es una píldora blanca con texto oscuro en mayúsculas
