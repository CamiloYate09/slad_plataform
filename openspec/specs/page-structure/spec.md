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

### Requirement: Stats Social Proof Section
La página MUST incluir una sección de métricas clave posicionada entre el carousel y las features, mostrando cifras de crecimiento de CityStream con animación count-up para generar credibilidad inmediata.

#### Scenario: Layout horizontal de métricas
- **WHEN** la sección `.stats` renderiza en desktop
- **THEN** muestra 4 métricas en fila horizontal separadas por líneas verticales (`border-right: 1px solid var(--border-base)`)
- **AND** cada métrica tiene: número grande con gradient-text, etiqueta secundaria en uppercase
- **AND** la sección tiene `border-top` y `border-bottom` como separadores de sección factory.ai-style

#### Scenario: Layout en mobile
- **WHEN** la sección renderiza en viewport ≤768px
- **THEN** las 4 métricas se reorganizan en grid 2×2
- **AND** los separadores verticales se convierten en separadores horizontales (`border-bottom`)

#### Scenario: Métricas con datos reales
- **WHEN** la sección es visible
- **THEN** los valores mostrados corresponden a datos actualizados del equipo CityStream
- **AND** los valores usan sufijos de escala ("K+" para miles, "+" para exactos)
