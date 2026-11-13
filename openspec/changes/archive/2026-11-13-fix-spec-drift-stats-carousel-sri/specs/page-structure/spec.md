## MODIFIED Requirements

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

## ADDED Requirements

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

## REMOVED Requirements

### Requirement: Stats Social Proof Section

**Reason**: La sección ya no es una fila de cuatro métricas con separadores ni muestra sufijos "K+": es la banda `.stats-band` de cuatro tarjetas.

**Migration**: Ver "Banda de Cifras" en esta misma spec.
