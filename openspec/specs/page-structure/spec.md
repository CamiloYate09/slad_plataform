# page-structure Specification

## Purpose
Qué secciones tiene la landing, en qué orden y qué contiene cada una que no tenga spec propia.

## Requirements

### Requirement: Factory.ai Section Ordering
La página MUST seguir el orden de secciones definido abajo, partiendo del de factory.ai y adaptado al contenido de CityStream.

#### Scenario: Secciones en orden factory.ai
- **WHEN** la página renderiza completa
- **THEN** las secciones aparecen en este orden exacto:
  1. Sticky navbar (logo, nav items, CTAs)
  2. Hero (`.hero`: headline, subtitle, captura de correo, escena de la app)
  3. Carrusel de ciudades (`.trusted-by`)
  4. Cifras (`.stats-band`)
  5. Funcionalidades en bento (`.features`, ver `features-bento`)
  6. Numbered features (`.numbered-features`, "Por qué CityStream" — 3 cards)
  7. Audience personas (`.audience`, "¿Para quién es CityStream?" — 4 tarjetas, ver `audience-personas`)
  8. Propuesta de valor (`.value-prop`, dos columnas)
  9. Experiencias (`.experiences`, tarjetas de ciudad con tags)
  10. Próximos eventos (`.news`)
  11. Preguntas frecuentes (`.faq`)
  12. CTA (`.cta-section`)
  13. Footer (`.footer`)

#### Scenario: No existen secciones fuera del orden definido
- **WHEN** se inspecciona el HTML
- **THEN** no hay secciones adicionales entre las 13 definidas
- **AND** `.stats-band` está entre `.trusted-by` y `.features`
- **AND** `.audience` está entre `.numbered-features` y `.value-prop`
- **AND** `.faq` está entre `.news` y `.cta-section`

### Requirement: Trusted-By Logo Carousel
La página MUST incluir, inmediatamente después del hero, un carrusel de las ciudades de lanzamiento que se desplaza horizontalmente en loop infinito.

#### Scenario: Carousel de logos infinito
- **WHEN** la sección `.trusted-by` renderiza
- **THEN** se muestra una fila de cápsulas con la foto y el nombre de cada ciudad (Bogotá, Medellín, Cartagena, Cali, Barranquilla) que se desplaza sola
- **AND** la animación es CSS `@keyframes carousel-scroll` con `translateX` de 0 a -25%, `linear infinite`, en 25 s
- **AND** el overflow es `hidden` para ocultar las cápsulas fuera del viewport
- **AND** con `prefers-reduced-motion: reduce` el carrusel queda quieto

#### Scenario: Nuevas imágenes de alta resolución en el carousel
- **WHEN** se inspeccionan los elementos del carousel
- **THEN** cada cápsula usa `static/img/avatar-09` a `avatar-13` en `<picture>` con fuentes AVIF y WebP y `<img>` JPG de fallback
- **AND** las cinco ciudades aparecen cuatro veces; las tres copias llevan `aria-hidden="true"` para el loop
- **AND** las imágenes se renderizan como círculos de 48×48px con `object-fit: cover`

### Requirement: Value Proposition Section
La página MUST incluir una sección de propuesta de valor con layout de dos columnas, reemplazando la sección newsletter actual, posicionada entre features y experiencias.

#### Scenario: Layout two-column value proposition
- **WHEN** la sección value proposition renderiza en desktop
- **THEN** se muestra en dos columnas (contenido left, imagen/ilustración right)
- **AND** la columna izquierda contiene: headline, párrafo descriptivo, 2 links tipo "Learn more" con flecha
- **AND** el layout usa el grid de 12 columnas (6+6 o 7+5 split)

#### Scenario: Value proposition en mobile
- **WHEN** la sección renderiza en mobile
- **THEN** las columnas se apilan verticalmente (contenido arriba, imagen abajo)

### Requirement: Experience Cards with Tags
Las cards de experiencias MUST incluir un sistema de tags (badges) y un link "Más experiencias" al final, siguiendo el patrón de news cards de factory.ai.

#### Scenario: Cards con tags y link de acción
- **WHEN** la sección experiencias renderiza
- **THEN** cada card tiene: tag badge (Ciudad Capital, Innovación, Patrimonio), headline, descripción truncada, link "Más información"
- **AND** las cards se muestran en grid de 3 columnas en desktop
- **AND** debajo del grid hay un link "Más experiencias" centrado

#### Scenario: Tag badge styling
- **WHEN** un tag badge se renderiza
- **THEN** tiene fondo sutil, border-radius pill, texto en uppercase pequeño
- **AND** el color del badge es acorde al tipo (Ciudad, Innovación, etc.)

### Requirement: Image Quality Standard
Todas las imágenes de contenido de la página (excluyendo logo y iconos) MUST usar fotos de alta resolución (mínimo 1280px en el lado mayor) y distribuirse en formato dual WebP+JPG para máxima compatibilidad y rendimiento.

#### Scenario: Formato dual WebP con fallback JPG
- **WHEN** se inspecciona cualquier `<picture>` de imagen de contenido
- **THEN** el elemento `<source>` tiene `type="image/webp"` apuntando al archivo `.webp`
- **AND** el elemento `<img>` de fallback apunta al archivo `.jpg` equivalente
- **AND** los archivos WebP existen en `static/img/` junto a sus pares JPG

#### Scenario: Imágenes encajan en cualquier slot de la página
- **WHEN** una imagen se renderiza en cualquier contenedor (carousel 48×48, tab 300px h, value-prop 350px h, exp-card 200px h)
- **THEN** la imagen cubre completamente el contenedor con `object-fit: cover`
- **AND** el encuadre prioriza la zona superior con `object-position: center top`
- **AND** no hay deformación ni espacio vacío visible en ningún slot

### Requirement: Banda de Cifras
La página MUST incluir, entre el carrusel y las funcionalidades, una banda `.stats-band` con cuatro tarjetas de prueba: ciudades para arrancar (cifra con degradado), "Hecho en Colombia" (tarjeta con el degradado de marca), los cuatro pilares con sus iconos y la frase "La primera red social de Colombia." sobre un fondo de puntos. Las cifras cuentan al entrar en pantalla (ver "Stats Section Entrance Animation" en `animations`).

#### Scenario: Escritorio
- **WHEN** el viewport mide más de 768px
- **THEN** las cuatro tarjetas se muestran en una fila

#### Scenario: Tablet
- **WHEN** el viewport mide entre 481px y 768px
- **THEN** las tarjetas se reorganizan en una cuadrícula de 2×2

#### Scenario: Móvil
- **WHEN** el viewport mide 480px o menos
- **THEN** las tarjetas se apilan en una columna
