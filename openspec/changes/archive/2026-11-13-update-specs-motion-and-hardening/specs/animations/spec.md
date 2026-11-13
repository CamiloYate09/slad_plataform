## MODIFIED Requirements

### Requirement: CSS Containment on Heavy Sections
Las secciones con animaciones complejas SHALL usar `contain: style paint` para aislar su renderizado y mejorar el scroll performance, sin `layout` para no alterar el posicionamiento de su contenido.

#### Scenario: Render de secciones animadas
- **WHEN** el navegador renderiza `.numbered-features`, `.cta-section` o `.news`
- **THEN** los cambios internos de estilo y pintado no provocan recálculos en el resto del DOM

### Requirement: Reveal de Media Ligado a Scroll
La imagen de la propuesta de valor (`.value-prop-image`) SHALL revelar con una animación de `opacity`/`scale` ligada a su posición en el viewport usando scroll-driven animations nativas de CSS, sin sumar trabajo al main thread.

#### Scenario: Imagen entra al viewport
- **WHEN** la imagen entra al viewport durante el scroll en un navegador con soporte de `animation-timeline: view()`
- **THEN** la imagen anima `opacity` y `scale` en función de `animation-range` (de entrada a posición de reposo)

#### Scenario: Sin soporte o movimiento reducido
- **WHEN** el navegador no soporta `animation-timeline` o el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** la imagen se muestra en su estado final estático sin animación

## REMOVED Requirements

### Requirement: Value-Prop Heading Character Reveal

**Reason**: Los titulares ya no se dividen en letras: Splitting.js se retiró con los títulos editoriales.

**Migration**: El h2 de `.value-prop-content` entra con el revelado de su bloque (`[data-scroll-reveal]`). Ver "Tipografía Editorial" en `visual-theme`.

### Requirement: Variable Font Weight Bloom

**Reason**: El título del hero ya no usa una fuente variable ni se divide en letras; entra con un fundido.

**Migration**: Ver "Tipografía Editorial" en `visual-theme`.
