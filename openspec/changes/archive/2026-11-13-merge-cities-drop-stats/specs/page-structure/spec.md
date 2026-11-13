## MODIFIED Requirements

### Requirement: Factory.ai Section Ordering
La página MUST seguir el orden de secciones definido abajo: primero qué es la app y cómo se usa, después las ciudades y el detalle.

#### Scenario: Secciones en orden factory.ai
- **WHEN** la página renderiza completa
- **THEN** las secciones aparecen en este orden exacto:
  1. Sticky navbar (logo, nav items, CTAs)
  2. Hero (`.hero`, ver "Hero que Explica la App")
  3. Funcionalidades en bento (`.features`, ver `features-bento`)
  4. Cómo funciona (`.how`, ver "Cómo Funciona")
  5. Selector de ciudad (`.city-picker`, ver "Selector de Ciudad")
  6. Para quién (`.audience`, "¿Para quién es CityStream?" — 4 tarjetas)
  7. Próximos eventos (`.news`)
  8. Preguntas frecuentes (`.faq`)
  9. CTA (`.cta-section`)
  10. Footer (`.footer`)

#### Scenario: No existen secciones fuera del orden definido
- **WHEN** se inspecciona el HTML
- **THEN** no hay secciones adicionales entre las 10 definidas
- **AND** `.features` va justo después del hero y `.how` justo después de `.features`
- **AND** no existen `.numbered-features`, `.value-prop`, `.trusted-by`, `.stats-band` ni `.experiences`

### Requirement: Image Quality Standard
Las fotos de contenido (las de las ciudades del selector) MUST servirse en `<picture>` con fuentes AVIF y WebP y un `<img>` JPG de fallback, con versiones de 640, 960 y 1280px en `srcset`.

#### Scenario: Formato dual WebP con fallback JPG
- **WHEN** se inspecciona cualquier `<picture>` de imagen de contenido
- **THEN** tiene un `<source type="image/avif">` y un `<source type="image/webp">`
- **AND** el elemento `<img>` de fallback apunta al archivo `.jpg` equivalente
- **AND** los tres formatos existen en `static/img/`

#### Scenario: Imágenes encajan en cualquier slot de la página
- **WHEN** una foto de ciudad se renderiza en su contenedor (`.city-photo`, proporción 4:3)
- **THEN** la imagen cubre completamente el contenedor con `object-fit: cover`
- **AND** no hay deformación ni espacio vacío visible

### Requirement: Hero que Explica la App
El hero SHALL decir qué es CityStream en su titular y su subtítulo, en una sola columna centrada: titular "Todos los planes de tu ciudad, *en una app*", un subtítulo con lo que se encuentra y dónde, la captura de correo, enlaces a las ciudades y, debajo, la escena animada de la app.

#### Scenario: Primera pantalla
- **WHEN** la página carga en escritorio
- **THEN** se ven el titular, el subtítulo, la captura de correo y los enlaces "Mira qué hay en: Bogotá · Medellín · Cartagena", centrados
- **AND** la escena de la app queda debajo, centrada, con hasta 400px de ancho

#### Scenario: Enlaces de ciudades
- **WHEN** el usuario pulsa una ciudad bajo la captura de correo
- **THEN** la página se desplaza al selector de ciudad (`#ciudades`) con esa ciudad elegida

#### Scenario: Sin indicador de scroll
- **WHEN** se inspecciona el hero
- **THEN** no hay indicador "Scroll": la escena de la app debajo del texto ya invita a bajar

### Requirement: Selector de Ciudad
Después de "Cómo funciona", la sección `.city-picker` (`#ciudades`) SHALL mostrar las 3 ciudades de lanzamiento (Bogotá, Medellín y Cartagena) como pestañas. El panel de cada ciudad SHALL tener su foto (con el duotone de marca), una etiqueta (Ciudad Capital, Innovación o Patrimonio), una descripción y tres planes (etiqueta, `h4` y descripción). La cabecera SHALL anunciar que Cali y Barranquilla llegan pronto.

#### Scenario: Elegir ciudad
- **WHEN** el usuario pulsa una pestaña
- **THEN** esa pestaña queda con `aria-selected="true"` y solo se ve su panel
- **AND** el título "Planes en …" del panel queda oculto a la vista pero sigue disponible para lectores de pantalla

#### Scenario: Enlaces a una ciudad
- **WHEN** el usuario pulsa un enlace con `data-city` (bajo la captura de correo del hero o en la columna "Ciudades" del pie)
- **THEN** la página se desplaza a `#ciudades` y queda elegida la pestaña de esa ciudad

#### Scenario: Teclado
- **WHEN** el foco está en una pestaña y el usuario pulsa ←, →, Inicio o Fin
- **THEN** el foco y la selección pasan a la pestaña anterior, siguiente, primera o última
- **AND** ← en la primera pestaña lleva a la última y → en la última lleva a la primera
- **AND** si se pulsan con Alt, Ctrl o Cmd, las teclas se dejan al navegador
- **AND** Tab lleva del grupo de pestañas al panel visible

#### Scenario: Foco visible y alto contraste
- **WHEN** una pestaña o el panel recibe el foco con el teclado
- **THEN** se dibuja un contorno de 2px con `--accent-ink`, con contraste de al menos 3:1 en los dos temas
- **AND** con `forced-colors: active` la pestaña elegida lleva un contorno `CanvasText`

#### Scenario: Sin JavaScript
- **WHEN** JavaScript no se ejecuta
- **THEN** la barra de pestañas queda oculta y los tres paneles se ven seguidos, cada uno con su título "Planes en …"
- **AND** los paneles no llevan `role="tabpanel"`: `main.js` lo añade al montar las pestañas

#### Scenario: Móvil
- **WHEN** el viewport mide 860px o menos
- **THEN** cada panel pasa a una columna: la foto arriba y, debajo, la etiqueta, la descripción y los planes

## REMOVED Requirements

### Requirement: Experience Cards with Tags

**Reason**: Las tarjetas de ciudad se fusionaron en el selector de ciudad: la foto, la etiqueta y la descripción de cada ciudad están ahora en su panel.

**Migration**: Ver "Selector de Ciudad".

### Requirement: Banda de Cifras

**Reason**: Sus cuatro tarjetas eran afirmaciones ("3 ciudades", "100% hecho en Colombia", "La primera red social de Colombia"), no pruebas; "hecha en Colombia" ya está en el subtítulo del hero.

**Migration**: Ninguna. Cuando haya datos reales de la beta, la prueba social irá en una sección nueva.
