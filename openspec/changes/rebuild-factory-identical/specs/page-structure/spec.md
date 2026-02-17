## ADDED Requirements
### Requirement: Factory.ai Section Ordering
La página MUST seguir el orden de secciones idéntico a factory.ai, adaptado al contenido de CityStream.

#### Scenario: Secciones en orden factory.ai
- **WHEN** la página renderiza completa
- **THEN** las secciones aparecen en este orden exacto:
  1. Sticky navbar (logo, nav items, CTAs)
  2. Hero section (headline, subtitle, CTA, progress animation)
  3. Trusted-by / partners carousel (logos scrolling)
  4. Product features with tabs (4 tabs: Ciudades, Eventos, Personas, Conciertos)
  5. Value proposition section (two-column, enterprise-style messaging)
  6. Experience cards grid (Bogotá, Medellín, Cartagena with tags)
  7. Card-style rounded footer

#### Scenario: No existen secciones fuera del orden definido
- **WHEN** se inspecciona el HTML
- **THEN** no hay secciones adicionales entre las 7 definidas
- **AND** la sección newsletter actual es reemplazada por la value proposition section

### Requirement: Trusted-By Logo Carousel
La página MUST incluir una sección de logos de aliados/ciudades que se desplazan horizontalmente en loop infinito, posicionada inmediatamente después del hero.

#### Scenario: Carousel de logos infinito
- **WHEN** la sección trusted-by renderiza
- **THEN** se muestra una fila horizontal de logos/nombres que se desplaza automáticamente
- **AND** la animación es CSS `@keyframes` con `translateX` de 0 a -50% (duplicando los logos)
- **AND** la animación es `linear infinite` sin pausas
- **AND** el overflow es `hidden` para ocultar logos fuera del viewport

#### Scenario: Imágenes existentes en el carousel
- **WHEN** se inspeccionan los elementos del carousel
- **THEN** contiene las imágenes existentes de ciudades de `static/img/` (1.jpg/webp, 5.jpg/webp, 7.jpg/webp, 8.jpg/webp)
- **AND** los elementos están duplicados en el HTML para crear el efecto de loop infinito

### Requirement: Tabbed Feature Showcase
La sección de features MUST usar un sistema de tabs interactivo (no grid de cards estático) para presentar las 4 funcionalidades principales de CityStream.

#### Scenario: Tabs de features con contenido dinámico
- **WHEN** la sección features renderiza
- **THEN** se muestran 4 tab buttons: Ciudades, Eventos, Personas, Conciertos
- **AND** el primer tab está activo por defecto
- **AND** cada tab tiene un indicador visual de estado activo (borde, color, o fondo)

#### Scenario: Cambio de tab con animación
- **WHEN** el usuario hace clic en un tab
- **THEN** el contenido del panel anterior se desvanece con GSAP (opacity 1→0, 200ms)
- **AND** el nuevo contenido se revela con GSAP (opacity 0→1, y: 20→0, 400ms)
- **AND** el indicador de tab activo se mueve al tab seleccionado

#### Scenario: Contenido de cada tab
- **WHEN** un tab está activo
- **THEN** el panel muestra: headline, descripción de 2-3 líneas, y un link "Más información" con flecha
- **AND** opcionalmente muestra una imagen o ilustración representativa

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
