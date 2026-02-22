# sticky-scroll-features Specification

## Purpose
TBD - created by archiving change add-ux-parity-v2. Update Purpose after archive.
## Requirements
### Requirement: Sticky Scroll Narrative — Features Section

La sección Features SHALL implementar un scroll narrativo vertical donde el panel izquierdo (heading + lista numerada) permanezca fijo (pinned) mientras el usuario hace scroll, y el panel derecho cambie de contenido (imagen + texto) para cada funcionalidad, replicando el patrón "sticky-scroll" de factory.ai.

El comportamiento SHALL ser:
- En desktop (>768px): `.features-sticky-wrap` se pina usando GSAP `ScrollTrigger.pin()`. Al hacer scroll, el panel derecho muestra secuencialmente los contenidos de las 4 funcionalidades (Ciudades, Eventos, Personas, Conciertos).
- La lista numerada izquierda (01–04) SHALL resaltar el ítem activo en naranja (`var(--accent-orange)`) mientras su panel correspondiente es visible.
- Cada ítem de la lista SHALL ser clickeable para saltar programáticamente al panel de scroll correspondiente.
- En mobile (≤768px): el sticky-scroll SHALL estar deshabilitado. Las 4 funcionalidades SHALL mostrarse apiladas verticalmente (layout lineal sin pin).
- El sistema de tabs anterior (`.tab-buttons`, `.tab-panels`, `.tab-btn`) SHALL ser eliminado.

#### Scenario: Scroll activa panel Ciudades

- **WHEN** el usuario llega al inicio del scroll de la sección features en desktop
- **THEN** el ítem "01 Ciudades" en la lista izquierda se muestra en naranja y el panel derecho muestra la imagen y texto de Ciudades

#### Scenario: Scroll avanza a panel Eventos

- **WHEN** el usuario hace scroll un cuarto del recorrido de la sección features
- **THEN** el ítem "01 Ciudades" vuelve a color neutro, "02 Eventos" se ilumina en naranja, y el panel derecho cambia a contenido de Eventos

#### Scenario: Clic en ítem de lista

- **WHEN** el usuario hace clic en "03 Personas" en la lista numerada izquierda
- **THEN** la página hace scroll suave hasta el punto donde el panel de Personas es el activo

#### Scenario: Mobile — layout vertical

- **WHEN** el viewport es ≤768px
- **THEN** las 4 funcionalidades se muestran apiladas verticalmente sin scroll narrativo ni pin, con imagen y texto visible para cada una

#### Scenario: prefers-reduced-motion

- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** el pin y las transiciones de panel están deshabilitadas; las 4 funcionalidades se muestran en layout vertical con transiciones instantáneas

