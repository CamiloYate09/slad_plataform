## 1. Hero Split — Layout CSS

- [x] 1.1 Convertir `.hero-content` en flex row: `display: flex; align-items: center; gap: 4rem; text-align: left`
- [x] 1.2 Añadir `.hero-left` como wrapper del contenido existente (logo, h1, subtitle, actions)
- [x] 1.3 Añadir `.hero-right` como wrapper del phone mockup con `flex-shrink: 0`
- [x] 1.4 Ajustar `.hero-logo` dentro de `.hero-left`: reducir `max-width` a `180px` (era protagonista, ahora es marca)
- [x] 1.5 Mover `text-align: center` del hero al responsive (solo en mobile)
- [x] 1.6 Responsive: `flex-direction: column` en `<= 1024px`, centrar `.hero-left`

## 2. Phone Frame — HTML + CSS

- [x] 2.1 Añadir HTML del `.phone-frame` dentro de `.hero-right` en `index.html`
- [x] 2.2 Añadir `.phone-notch` (pill centrado en parte superior)
- [x] 2.3 Crear `.phone-screen` con background oscuro y overflow hidden
- [x] 2.4 CSS del frame: `220px × 440px`, `border-radius: 36px`, `border: 2px solid var(--glass-border)`, `box-shadow: var(--shadow-premium)`
- [x] 2.5 Añadir `@keyframes phoneFloat` y aplicar al `.phone-frame`
- [x] 2.6 Respetar `prefers-reduced-motion`: `animation: none` en el media query existente

## 3. Mapa Abstracto — Cities Dots

- [x] 3.1 Crear `.phone-map` que ocupa el 65% superior de `.phone-screen` con `position: relative`
- [x] 3.2 Añadir 4 `.map-dot` con posición absoluta: Bogotá (55%, 60%), Medellín (35%, 45%), Cartagena (30%, 20%), Cali (30%, 70%)
- [x] 3.3 CSS del `.map-dot`: núcleo `6×6px` con `background: var(--accent-cyan)` y `border-radius: 50%`
- [x] 3.4 Añadir `.map-dot-pulse`: anillo `@keyframes dotPulse` que escala de 1 a 3.8 y desvanece (opacity 0.7 → 0)
- [x] 3.5 Desfasar los pulsos con `animation-delay` por dot (0s, 0.6s, 1.2s, 1.8s) para efecto orgánico
- [x] 3.6 Añadir `.map-dot-label`: `font-size: 8px`, `color: var(--text-secondary)`, `white-space: nowrap`, posición relativa al dot
- [x] 3.7 Añadir SVG inline `.map-lines` con paths Cartagena→Medellín→Bogotá→Cali: `stroke: var(--accent-cyan)`, `opacity: 0.35`, `stroke-dasharray: 3 4`

## 4. Phone Card — Evento Preview

- [x] 4.1 Añadir `.phone-card` como flex item al pie de `.phone-screen`
- [x] 4.2 CSS: glass bg + glass border-top + `padding: 10px 14px`
- [x] 4.3 Contenido inicial: badge "🔥 En vivo", título "Feria de las Flores", subtítulo "Medellín · Ago 2026"
- [x] 4.4 Añadir 2 eventos más en JS como data array: rotación fade cada 3.5s
- [x] 4.5 `prefers-reduced-motion`: mostrar primer evento estático, sin rotación

## 5. Ambient Section Glows

- [x] 5.1 Añadir `radial-gradient` purple top-center al `::before` existente de `.features`
- [x] 5.2 Añadir `radial-gradient` cyan top-center al `::before` existente de `.experiences`
- [x] 5.3 `.numbered-features::before` ya tiene `var(--bg-dark-band)` — dark band es el tratamiento visual
- [x] 5.4 `pointer-events: none` y `z-index: 0` en todos los pseudo-elementos de glows

## 6. Section Rhythm

- [x] 6.1 Aplicar `background: var(--bg-dark-band)` a `.trusted-by`
- [x] 6.2 `.numbered-features` ya tiene dark band via `::before` — confirmado existente
- [x] 6.3 Contraste `#0a0a0a` vs `#111111` → sutil, no abrupto

## 7. CTA Button Glow

- [x] 7.1 Añadir `box-shadow: 0 0 24px rgba(249, 115, 22, 0.35)` al estado `:hover` de `.btn-primary`
- [x] 7.2 `:focus-visible` usa `outline` no `box-shadow` — sin colisión

## 8. Validación

- [ ] 8.1 Verificar hero split en Chrome desktop: proporciones, alineación vertical, partículas detrás
- [ ] 8.2 Verificar responsive en 1024px (tablet): columna única, centrado
- [x] 8.3 `.hero-right { display: none }` en `max-width: 768px` — implementado en CSS
- [ ] 8.4 Verificar animaciones float + dot pulse en dark y light mode
- [x] 8.5 `prefers-reduced-motion`: `phoneFloat: none`, `dotPulse: none`, `setInterval` no ejecuta
- [x] 8.6 `.hero { overflow: hidden }` y `.phone-map { overflow: hidden }` — overflow controlado
- [ ] 8.7 Lighthouse performance: confirmar que los nuevos elementos no degradan LCP
