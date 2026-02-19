## MODIFIED Requirements

### Requirement: Trusted-By Logo Carousel
La página MUST incluir una sección de logos de aliados/ciudades que se desplazan horizontalmente en loop infinito, posicionada inmediatamente después del hero.

#### Scenario: Carousel de logos infinito
- **WHEN** la sección trusted-by renderiza
- **THEN** se muestra una fila horizontal de logos/nombres que se desplaza automáticamente
- **AND** la animación es CSS `@keyframes` con `translateX` de 0 a -50% (duplicando los logos)
- **AND** la animación es `linear infinite` sin pausas
- **AND** el overflow es `hidden` para ocultar logos fuera del viewport

#### Scenario: Nuevas imágenes de alta resolución en el carousel
- **WHEN** se inspeccionan los elementos del carousel
- **THEN** contiene imágenes de la nueva colección de alta resolución (`static/img/img-09` a `img-13` en formato WebP con fallback JPG)
- **AND** cada imagen usa `<picture><source srcset="*.webp" type="image/webp"><img src="*.jpg"></picture>`
- **AND** los elementos están duplicados en el HTML con `aria-hidden="true"` para crear el efecto de loop infinito
- **AND** las imágenes se renderizan como círculos de 48×48px con `object-fit: cover` y `border-radius: 50%`

## ADDED Requirements

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
