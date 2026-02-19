## ADDED Requirements

### Requirement: Ambient Section Glow System
El sitio SHALL usar radial-gradient pseudo-elementos en secciones clave para añadir profundidad luminosa al fondo oscuro, replicando el aspecto premium de factory.ai. Los glows son CSS puro (sin JS) y no interfieren con `prefers-reduced-motion`.

#### Scenario: Glows en dark mode (default)
- **WHEN** la página renderiza en dark mode (default)
- **THEN** la sección `.hero` muestra un radial-gradient purple (`rgba(175, 64, 255, 0.18)`) centrado arriba
- **AND** la sección `.features` muestra un glow azul-índigo (`rgba(91, 66, 243, 0.12)`) desde la esquina derecha
- **AND** la sección `.experiences` muestra un glow cyan (`rgba(0, 221, 235, 0.08)`) desde la izquierda
- **AND** todos los glows son implementados como `::before` con `position: absolute`, `pointer-events: none`, `z-index: 0`
- **AND** el contenido de las secciones tiene `position: relative; z-index: 1` para renderizar sobre los glows

#### Scenario: Glows reducidos en light mode
- **WHEN** el usuario activa `body.light-theme`
- **THEN** los glows de todas las secciones tienen opacidad máxima del 50% respecto al dark mode
- **AND** no hay colores saturados visibles sobre el fondo claro

#### Scenario: Glows no afectan performance
- **WHEN** se inspecciona el render de la página
- **THEN** los glows son elementos CSS composited (GPU) sin JavaScript
- **AND** no hay layout thrashing ni repaints causados por los glows
