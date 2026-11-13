## MODIFIED Requirements

### Requirement: CSS Containment on Heavy Sections
Las secciones con animaciones complejas SHALL usar `contain: style paint` para aislar su renderizado y mejorar el scroll performance, sin `layout` para no alterar el posicionamiento de su contenido.

#### Scenario: Render de secciones animadas
- **WHEN** el navegador renderiza `.cta-section` o `.news`
- **THEN** los cambios internos de estilo y pintado no provocan recálculos en el resto del DOM

## ADDED Requirements

### Requirement: Brillo al Pasar sobre Eventos
Las tarjetas de próximos eventos (`.news-card`) SHALL mostrar un destello que recorre la tarjeta de izquierda a derecha al pasar el cursor.

#### Scenario: Hover sobre una tarjeta de evento
- **WHEN** el cursor entra en una `.news-card`
- **THEN** aparece un destello luminoso que recorre la tarjeta de izquierda a derecha

#### Scenario: Movimiento reducido
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** no aparece el destello

## REMOVED Requirements

### Requirement: 3D Tilt Card Effect

**Reason**: Ninguna tarjeta gira en 3D: no hay código para ello en `main.js` ni en `style.css`, y `.num-card` ya no existe.

**Migration**: Ninguna. El hover de las experiencias se describe en "Card Hover Effects" (`layout-animations`).

### Requirement: Card Shine Sweep on Hover

**Reason**: `.num-card` ya no existe.

**Migration**: Ver "Brillo al Pasar sobre Eventos".

### Requirement: Reveal de Media Ligado a Scroll

**Reason**: Su única imagen, la de la propuesta de valor, se quitó con la sección.

**Migration**: Ninguna.
