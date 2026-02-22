## ADDED Requirements

### Requirement: Banda Oscura de Contraste Mid-Page

La sección `numbered-features` ("Construido diferente") SHALL renderizarse con fondo oscuro (`#1a1a1a` en dark mode, `#111` en light mode) creando una banda de contraste full-width entre las secciones claras adyacentes, replicando el patrón de ritmo visual claro-oscuro-claro de factory.ai.

Los colores de texto dentro de la banda SHALL invertirse para garantizar legibilidad:
- Heading `.section-label` y `h2[data-splitting]` SHALL usar colores claros
- Los números `.num-card-number` SHALL usar `var(--accent-orange)` o blanco tenue
- El cuerpo de texto `.num-card p` SHALL usar `rgba(255,255,255,0.7)` o equivalente
- Los bordes de `.num-card` SHALL usar `rgba(255,255,255,0.1)` para separación sutil

La banda SHALL:
- Ocupar el 100% del ancho del viewport (full-bleed)
- Ser siempre oscura independientemente del tema light/dark del sitio (es una decisión de diseño deliberada para crear contraste, igual que factory.ai)

#### Scenario: Banda visible entre secciones claras

- **WHEN** el usuario hace scroll desde la sección value-prop (clara) hasta la sección experiences (clara)
- **THEN** la sección numbered-features se muestra con fondo oscuro creando un ritmo visual claro-oscuro-claro

#### Scenario: Texto legible en banda oscura

- **WHEN** la sección numbered-features está visible
- **THEN** el heading, los números y el texto de los cards son legibles con contraste adecuado sobre el fondo oscuro

#### Scenario: Banda en light mode del sitio

- **WHEN** el usuario activa el tema claro del sitio
- **THEN** la banda numbered-features se mantiene oscura (no se invierte), manteniendo el contraste intencional de diseño
