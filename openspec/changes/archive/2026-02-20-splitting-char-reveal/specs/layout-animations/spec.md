# Spec Delta: layout-animations — splitting-char-reveal

## ADDED Requirements

### Requirement: Splitting.js Character Split Library
El sitio MUST cargar Splitting.js (v1.x, ~3KB gzip) via CDN antes de main.js. Se llama `Splitting({ target: '[data-splitting]' })` al iniciar main.js para procesar todos los elementos marcados, creando `.word > .char` spans automáticamente. Si el CDN falla, la ausencia de `.char` spans provoca un fallback silencioso (texto estático sin crash).

#### Scenario: Splitting.js disponible globalmente
- **WHEN** la página carga correctamente
- **THEN** el objeto global `Splitting` está disponible en `window`
- **AND** se llama `Splitting({ target: '[data-splitting]' })` al inicio de main.js
- **AND** los elementos `[data-splitting]` tienen sus chars envueltos en `.word > .char` spans con atributo `data-char`

#### Scenario: Degradación graceful si CDN falla
- **WHEN** Splitting.js no carga (CDN no disponible)
- **THEN** `typeof Splitting === 'undefined'` — la inicialización se omite sin error
- **AND** los textos aparecen estáticos sin animación de chars (fallback aceptable)

### Requirement: Hero Subtitle Text Scramble
El `.hero-subtitle` MUST mostrar un efecto text scramble antes de revelar el texto final, replicando el efecto "glitch" de sitios top-tier. Implementado con `requestAnimationFrame` puro, sin plugins de pago.

#### Scenario: Subtitle muestra scramble al cargar
- **WHEN** la página termina de cargar, después del inicio de la animación del hero title
- **THEN** el `.hero-subtitle` comienza a mostrar caracteres aleatorios del pool `[A-Za-z0-9!@#$%&*()]`
- **AND** los caracteres se resuelven de izquierda a derecha, uno a la vez
- **AND** cada carácter no resuelto cambia a un char aleatorio del pool en cada frame RAF
- **AND** la duración total del scramble es aproximadamente 1.2 segundos
- **AND** al finalizar, el texto es idéntico al original

#### Scenario: Scramble desactivado con reduced-motion
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** el `.hero-subtitle` aparece con su texto final directamente sin scramble
- **AND** no se ejecuta ningún loop RAF para el scramble

#### Scenario: Scramble no causa layout shift
- **WHEN** el scramble está activo
- **THEN** la altura del elemento `.hero-subtitle` permanece constante durante todo el efecto
- **AND** el texto no produce saltos de línea distintos a los del texto final

## MODIFIED Requirements

### Requirement: Hero Title Character Animation
La animación del `.hero-title` MUST usar caracteres individuales (via Splitting.js) en lugar del split manual por palabras (`split-word` spans). El gradiente de `.gradient-text` MUST seguir aplicándose visualmente sobre cada char individual.

#### Scenario: Hero title animado letra por letra
- **WHEN** la página termina de cargar (en el hero timeline)
- **THEN** cada `.char` dentro de `.hero-title` anima de `{ opacity: 0, y: 30 }` a `{ opacity: 1, y: 0 }`
- **AND** la duración por char es `0.5s` con `ease: power3.out`
- **AND** el stagger entre chars es `0.03s`
- **AND** el gradiente de `.gradient-text` (background-clip: text) aplica visualmente sobre cada char individual

#### Scenario: Fallback sin Splitting.js o con reduced-motion
- **WHEN** Splitting.js no está disponible, O el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** el hero title anima como bloque (`opacity: 0→1, y: 30→0`) igual que el comportamiento anterior

### Requirement: Section Heading Character Reveal
Los `h2[data-splitting]` dentro de `.section-header` MUST revelar letra por letra al hacer scroll, reemplazando el split manual por palabras (`heading-reveal-word`). Solo aplica a headings que NO tienen `.gradient-text`.

#### Scenario: Section heading revela letra por letra al scroll
- **WHEN** un `h2[data-splitting]` entra al viewport (trigger: `top 88%`)
- **THEN** cada `.char` dentro del heading anima de `{ yPercent: 110, opacity: 0 }` a `{ yPercent: 0, opacity: 1 }`
- **AND** la duración por char es `0.6s` con `ease: power3.out`
- **AND** el stagger entre chars es `0.025s`
- **AND** la animación dispara `once: true` (no se repite al volver a subir)

#### Scenario: Headings gradient-text sin data-splitting no se ven afectados
- **WHEN** un `h2.gradient-text` (sin `data-splitting`) entra al viewport
- **THEN** aplica únicamente la animación de bloque del `.section-header` existente
- **AND** NO se intenta animar `.char` dentro de ese elemento
