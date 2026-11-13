## MODIFIED Requirements

### Requirement: Factory.ai Section Ordering
La página MUST seguir el orden de secciones definido abajo: primero qué es la app y cómo se usa, después la prueba y el detalle.

#### Scenario: Secciones en orden factory.ai
- **WHEN** la página renderiza completa
- **THEN** las secciones aparecen en este orden exacto:
  1. Sticky navbar (logo, nav items, CTAs)
  2. Hero (`.hero`, ver "Hero que Explica la App")
  3. Funcionalidades en bento (`.features`, ver `features-bento`)
  4. Cómo funciona (`.how`, ver "Cómo Funciona")
  5. Carrusel de ciudades (`.trusted-by`)
  6. Cifras (`.stats-band`)
  7. Para quién (`.audience`, "¿Para quién es CityStream?" — 4 tarjetas)
  8. Experiencias (`.experiences`, tarjetas de ciudad con tags)
  9. Próximos eventos (`.news`)
  10. Preguntas frecuentes (`.faq`)
  11. CTA (`.cta-section`)
  12. Footer (`.footer`)

#### Scenario: No existen secciones fuera del orden definido
- **WHEN** se inspecciona el HTML
- **THEN** no hay secciones adicionales entre las 12 definidas
- **AND** `.features` va justo después del hero y `.how` justo después de `.features`
- **AND** no existen `.numbered-features` ni `.value-prop`

### Requirement: Trusted-By Logo Carousel
La página MUST incluir, justo después de "Cómo funciona", un carrusel de las ciudades de lanzamiento que se desplaza horizontalmente en loop infinito.

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

### Requirement: Banda de Cifras
La página MUST incluir, entre el carrusel y "¿Para quién es CityStream?", una banda `.stats-band` con cuatro tarjetas de prueba: ciudades para arrancar (cifra con degradado), "Hecho en Colombia" (tarjeta con el degradado de marca), los cuatro pilares con sus iconos y la frase "La primera red social de Colombia." sobre un fondo de puntos. Las cifras cuentan al entrar en pantalla (ver "Stats Section Entrance Animation" en `animations`).

#### Scenario: Escritorio
- **WHEN** el viewport mide más de 768px
- **THEN** las cuatro tarjetas se muestran en una fila

#### Scenario: Tablet
- **WHEN** el viewport mide entre 481px y 768px
- **THEN** las tarjetas se reorganizan en una cuadrícula de 2×2

#### Scenario: Móvil
- **WHEN** el viewport mide 480px o menos
- **THEN** las tarjetas se apilan en una columna

### Requirement: Image Quality Standard
Las fotos de contenido (experiencias y carrusel de ciudades) MUST servirse en `<picture>` con fuentes AVIF y WebP y un `<img>` JPG de fallback. Las fotos de experiencias MUST tener versiones de 640, 960 y 1280px en `srcset`.

#### Scenario: Formato dual WebP con fallback JPG
- **WHEN** se inspecciona cualquier `<picture>` de imagen de contenido
- **THEN** tiene un `<source type="image/avif">` y un `<source type="image/webp">`
- **AND** el elemento `<img>` de fallback apunta al archivo `.jpg` equivalente
- **AND** los tres formatos existen en `static/img/`

#### Scenario: Imágenes encajan en cualquier slot de la página
- **WHEN** una imagen se renderiza en su contenedor (círculo de 48×48px en el carrusel, 200px de alto en las experiencias)
- **THEN** la imagen cubre completamente el contenedor con `object-fit: cover`
- **AND** en las experiencias la foto mide 260px de alto para dejar margen al parallax (ver "Parallax de Fotos de Ciudad" en `layout-animations`)
- **AND** no hay deformación ni espacio vacío visible en ningún slot

## ADDED Requirements

### Requirement: Hero que Explica la App
El hero SHALL decir qué es CityStream en su titular y su subtítulo, en una sola columna centrada: titular "Todos los planes de tu ciudad, *en una app*", un subtítulo con lo que se encuentra y dónde, la captura de correo, enlaces a las ciudades y, debajo, la escena animada de la app.

#### Scenario: Primera pantalla
- **WHEN** la página carga en escritorio
- **THEN** se ven el titular, el subtítulo, la captura de correo y los enlaces "Mira qué hay en: Bogotá · Medellín · Cartagena", centrados
- **AND** la escena de la app queda debajo, centrada, con hasta 400px de ancho

#### Scenario: Enlaces de ciudades
- **WHEN** el usuario pulsa una ciudad bajo la captura de correo
- **THEN** la página se desplaza a las experiencias (`#experiencias`)

#### Scenario: Sin indicador de scroll
- **WHEN** se inspecciona el hero
- **THEN** no hay indicador "Scroll": la escena de la app debajo del texto ya invita a bajar

### Requirement: Cómo Funciona
Justo después del bento, la sección `.how` (`#como-funciona`) SHALL explicar el uso en tres pasos, cada uno en una tarjeta con icono, `h3` y descripción: "Elige tu ciudad", "Descubre qué hay" y "Conecta y ve".

#### Scenario: Escritorio
- **WHEN** el viewport mide más de 860px
- **THEN** los tres pasos se muestran en una fila

#### Scenario: Móvil
- **WHEN** el viewport mide 860px o menos
- **THEN** los pasos se apilan en una columna

#### Scenario: Revelado
- **WHEN** la lista de pasos entra en pantalla
- **THEN** las tarjetas aparecen escalonadas 0,1 s (ver "Revelado al Hacer Scroll" en `layout-animations`)

## REMOVED Requirements

### Requirement: Value Proposition Section

**Reason**: La propuesta de valor repetía mensajes que ya dicen el hero, el bento y las preguntas frecuentes; se quitó al reordenar la página.

**Migration**: Ninguna.
