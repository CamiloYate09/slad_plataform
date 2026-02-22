# Spec: video-embed

Capability dentro del change `video-showcase`.

## Context
Embed del archivo `static/video/citystream.MP4` (1920×1608px, ~17s, 11MB) en la landing page de CityStream como sección de product showcase entre `numbered-features` y `value-prop`.

---

## ADDED Requirements

### Requirement: VS-1 — Sección video-showcase en el DOM
El documento `index.html` MUST contener una sección con `class="video-showcase"` posicionada después del cierre de la sección `numbered-features` y antes de la sección `value-prop`.

#### Scenario: Sección presente en el orden correcto
**Given** el usuario carga `index.html`
**When** el DOM está completamente parseado
**Then** `document.querySelector('.video-showcase')` existe
**And** el elemento anterior al `.video-showcase` en el DOM es la sección `numbered-features`
**And** el elemento siguiente es la sección `value-prop`

---

### Requirement: VS-2 — Video con atributos de rendimiento y autoplay seguro
El elemento `<video>` dentro de `.video-showcase-container` SHALL tener los atributos `autoplay`, `muted`, `loop`, `playsinline` y `preload="none"`.

#### Scenario: Video cargado sin audio y diferido
**Given** el HTML está parseado
**When** se inspecciona el elemento `<video>`
**Then** tiene `muted`, `autoplay`, `loop`, `playsinline`
**And** tiene `preload="none"` — el navegador no descarga el archivo hasta que sea necesario

#### Scenario: Poster visible antes de reproducción
**Given** el video aún no ha cargado sus datos
**When** el elemento `.video-showcase-container` está visible
**Then** se muestra la imagen `poster="static/img/img-07.jpg"` como placeholder visual

---

### Requirement: VS-3 — Lazy autoplay via Intersection Observer
El video SHALL reproducirse únicamente cuando el elemento entra en el viewport (threshold ≥ 30%), y MUST pausarse al salir del viewport.

#### Scenario: Video no reproduce fuera del viewport
**Given** el usuario está en la sección `hero`
**When** la sección `.video-showcase` está fuera del viewport
**Then** `video.paused === true`
**And** el archivo `.MP4` no ha comenzado a descargarse (verificable en Network tab)

#### Scenario: Video reproduce al entrar al viewport
**Given** el usuario hace scroll hasta que `.video-showcase-container` supera el 30% de visibilidad
**When** el `IntersectionObserver` dispara
**Then** `video.play()` es llamado
**And** el video comienza a reproducirse de forma silenciosa y en loop

---

### Requirement: VS-4 — Respeto a prefers-reduced-motion
Si el usuario tiene `prefers-reduced-motion: reduce`, el video MUST NOT reproducirse automáticamente.

#### Scenario: Sin animación para usuarios con reduced-motion
**Given** `window.matchMedia('(prefers-reduced-motion: reduce)').matches === true`
**When** la sección entra al viewport
**Then** `video.play()` NO es llamado
**And** el poster se muestra como imagen estática

---

### Requirement: VS-5 — Contenedor con aspect-ratio nativo del video
El contenedor `.video-showcase-container` MUST usar `aspect-ratio: 1920 / 1608` para preservar las proporciones originales del video sin distorsión ni letterboxing.

#### Scenario: Ratio preservado en desktop
**Given** el viewport es ≥ 1024px
**When** se calcula el bounding rect de `.video-showcase-container`
**Then** `width / height ≈ 1.19` (1920/1608)
**And** no hay bandas negras (letterboxing) ni recorte visible

#### Scenario: Responsive en móvil
**Given** el viewport es < 768px
**When** el contenedor se renderiza
**Then** `max-width: 100%` aplica y el contenedor ocupa el ancho disponible
**And** el aspect-ratio se mantiene proporcionalmente

---

### Requirement: VS-6 — Accesibilidad mínima
El elemento `<video>` SHALL tener un `aria-label` descriptivo y la `<section>` SHALL tener `aria-label`.

#### Scenario: Video accesible con lector de pantalla
**Given** un lector de pantalla recorre el DOM
**When** llega al elemento `<video>`
**Then** encuentra `aria-label="Video de demostración de CityStream"` o equivalente descriptivo
**And** el `<section>` tiene `aria-label="CityStream en acción"`

---

## Cross-references
- Relacionado con: `specs/visual-theme/spec.md` (dark/light theme support para bordes y sombras del contenedor)
- Relacionado con: `specs/layout-animations/spec.md` (scroll-triggered reveal del contenedor si se agrega entrada animada)
