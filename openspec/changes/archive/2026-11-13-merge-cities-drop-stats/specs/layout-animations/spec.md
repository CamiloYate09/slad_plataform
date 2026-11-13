## MODIFIED Requirements

### Requirement: Revelado al Hacer Scroll
Los bloques que aparecen al hacer scroll SHALL marcarse desde `main.js` con `[data-scroll-reveal]` y un `IntersectionObserver`, sin librerías, y SHALL animarse con transiciones CSS de `opacity` y `translate`. La entrada del hero SHALL ser CSS puro.

#### Scenario: Bloque entra en pantalla
- **WHEN** el borde superior de un bloque marcado alcanza el 85% de la altura del viewport
- **THEN** recibe `.is-revealed` y pasa de `opacity: 0` y 40px más abajo a su posición, en 0,8 s con `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **AND** en los grupos de tarjetas cada una se retrasa respecto a la anterior (0,1 s en cómo funciona y en eventos, 0,08 s en el bento)

#### Scenario: Bloque ya superado
- **WHEN** la página se abre en un ancla o el navegador restaura el scroll más abajo
- **THEN** los bloques que quedan por encima del viewport se muestran sin esperar a cruzarlo

#### Scenario: Entrada del hero
- **WHEN** la página carga
- **THEN** el título sube y aparece en 0,6 s tras 0,1 s, y la captura de correo en 0,4 s tras 0,5 s

#### Scenario: Sin JavaScript o con movimiento reducido
- **WHEN** JavaScript no se ejecuta o el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** ningún bloque se marca y todo el contenido se ve completo y quieto

## ADDED Requirements

### Requirement: Botón Primario al Pasar
Los botones primarios (`.btn-primary`) MUST elevarse, escalar un poco y desplazar su degradado al pasar el cursor.

#### Scenario: Hover sobre un botón primario
- **WHEN** el usuario hace hover sobre un `.btn-primary`
- **THEN** el botón se eleva `translateY(-2px)` y escala `scale(1.02)`
- **AND** el background-position del gradiente se desplaza a `100% 0`
- **AND** aparece un box-shadow con glow de los colores de marca

## REMOVED Requirements

### Requirement: Card Hover Effects

**Reason**: Su escenario de tarjetas describía `.exp-card`, que ya no existe; el del botón primario sigue vigente.

**Migration**: Ver "Botón Primario al Pasar".

### Requirement: Parallax de Fotos de Ciudad

**Reason**: Las fotos de ciudad están ahora en el selector, sin parallax: se buscaba menos movimiento en bucle o ligado al scroll.

**Migration**: Ninguna.
