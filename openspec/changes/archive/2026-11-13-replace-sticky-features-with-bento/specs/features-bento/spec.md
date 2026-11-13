## ADDED Requirements

### Requirement: Bento de Funcionalidades

La sección `#features` SHALL presentar las funcionalidades de CityStream como un bento de cinco tarjetas: Ciudades, Eventos y Conciertos en una fila de tres, y Avisos y Personas en una fila de dos.

#### Scenario: Escritorio

- **WHEN** el viewport mide más de 860px
- **THEN** el bento muestra tres tarjetas en la primera fila y dos en la segunda

#### Scenario: Móvil

- **WHEN** el viewport mide 860px o menos
- **THEN** las cinco tarjetas se apilan en una sola columna

#### Scenario: Movimiento reducido

- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** las tarjetas se muestran completas desde el inicio, sin revelado al hacer scroll

### Requirement: Contenido de cada tarjeta del bento

Cada tarjeta del bento SHALL contener una mini-interfaz de la app hecha en HTML y CSS, decorativa (`aria-hidden="true"`) y sin elementos enfocables, seguida de un `h3` con el nombre de la funcionalidad y un `p` que cuenta lo que muestra.

#### Scenario: Lector de pantalla

- **WHEN** un lector de pantalla recorre la sección
- **THEN** anuncia el `h3` y el `p` de cada tarjeta y omite la mini-interfaz

#### Scenario: Navegación con teclado

- **WHEN** el usuario recorre la sección con Tab
- **THEN** el foco no se detiene en ningún elemento de las mini-interfaces

#### Scenario: Contraste en los dos temas

- **WHEN** la página se muestra en tema claro u oscuro
- **THEN** los textos de las tarjetas cumplen contraste WCAG AA
