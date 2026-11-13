# dark-contrast-band Specification

## Purpose
Banda de fondo contrastado a media página (sección "Construido diferente") que marca el ritmo visual en los dos temas.

## Requirements

### Requirement: Banda de Contraste a Media Página
La sección `numbered-features` ("Construido diferente") SHALL renderizarse sobre `var(--bg-dark-band)` a todo el ancho del viewport (full-bleed), creando una banda que contrasta con el fondo de la página en los dos temas: `#111` sobre `#0a0a0a` en oscuro y `#efefef` sobre `#fafafa` en claro. Su `h2` SHALL usar `var(--text-primary)` y sus textos SHALL cumplir contraste WCAG AA.

#### Scenario: Banda visible entre secciones
- **WHEN** el usuario hace scroll desde Funcionalidades hasta "¿Para quién es CityStream?"
- **THEN** la sección numbered-features se distingue por su fondo de banda a todo el ancho

#### Scenario: Banda en tema claro
- **WHEN** el usuario activa el tema claro
- **THEN** la banda pasa a `#efefef` y su heading y textos siguen los colores del tema claro

#### Scenario: Texto legible en la banda
- **WHEN** la sección numbered-features está visible en cualquiera de los dos temas
- **THEN** el label, el heading, los números y el texto de los cards cumplen contraste AA sobre la banda
