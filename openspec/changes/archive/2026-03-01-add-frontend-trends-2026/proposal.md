# Change: Frontend Trends 2026 — Técnicas de Alto Impacto

## Por qué

La investigación de tendencias 2025-2026 (Awwwards, web.dev, Chrome Developers, GSAP Docs) identifica
6 técnicas de alto impacto que el mercado ya considera estándar premium y que **CityStream aún no
implementa**, a pesar de tener el stack técnico (Geist variable font, GSAP, CSS3 moderno) para aplicarlas
sin librerías extra.

## Qué ya existe (no se toca)

✅ Custom cursor + follower
✅ Magnetic CTA hero button
✅ Splitting.js char reveals
✅ Text scramble hero subtitle
✅ Parallax multi-capa (hero logo, value-prop, exp-cards)
✅ Sticky scroll narrative (features)
✅ 3D tilt cards
✅ Hero orbs mouse parallax
✅ Clip-path section label reveal
✅ CTA glow border + button pulse
✅ Lenis smooth scroll
✅ Stats count-up

## Qué cambia — 6 mejoras priorizadas por impacto/costo

### T1 — Variable Font Weight Bloom (hero title)
**Tendencia:** Awwwards SOTD, sitios de tech premium 2025
**Qué hace:** Al revelar los caracteres del hero title, el font-weight comienza en 100 (ultralight) y
"florece" hasta 700 (bold), creando una animación que hace que el texto cobre vida visualmente.
**Implementación:** GSAP `fontVariationSettings` en la timeline de entrada de chars. Geist ya está cargado
como variable font (wght 100–900), así que cero costo de red adicional.
**Impacto:** Alto | **Performance:** Bajo | **Estado:** Bleeding-edge / Awwwards standard

### T2 — Glassmorphism Navbar (cuando scrolled)
**Tendencia:** 64% de SaaS premium en 2025 lo usa
**Qué hace:** El navbar en estado `.scrolled` pasa de fondo sólido oscuro a `backdrop-filter: blur(20px)
saturate(180%)` + borde inferior sutil. Se añade un pseudo-elemento con noise texture SVG (4% opacity)
para romper el efecto plástico del glassmorphism básico.
**Implementación:** CSS puro — solo modificar `.navbar.scrolled` y añadir `::before` con noise.
**Impacto:** Alto | **Performance:** Bajo-Medio | **Estado:** Mainstream premium

### T3 — CSS @property Gradient Text Animado
**Tendencia:** Chrome Developers, CSS-Tricks highlight de 2025
**Qué hace:** El gradient angle de `.gradient-text` se anima continuamente (0deg → 360deg en 8s) usando
`@property --gradient-angle` con `syntax: '<angle>'`. Esto permite que el navegador interpole el ángulo
nativamente — resultado: texto gradient que "fluye" sutilmente.
**Implementación:** CSS puro, 15 líneas. No afecta layout ni provoca repaint.
**Impacto:** Alto | **Performance:** Bajo (compositor) | **Estado:** Bleeding-edge → Baseline 2025

### T4 — View Transitions API en Theme Toggle
**Tendencia:** Baseline Newly Available 2025 (Chrome 111+, Firefox 144+, Safari parcial)
**Qué hace:** Cuando el usuario cambia entre dark/light theme, en vez de un switch instantáneo, usa
`document.startViewTransition()` para una transición circular-reveal que parte desde el botón del tema y
expande por toda la página. Efecto cinematográfico, 0 CSS animation frames JS.
**Implementación:** ~15 líneas JS modificando el handler del theme toggle. Graceful degradation: si
`startViewTransition` no existe, funciona como antes.
**Impacto:** Alto | **Performance:** Bajo (browser-managed) | **Estado:** Mainstream 2025

### T5 — Button Active Press Feedback
**Tendencia:** Considerado baseline UX en 2025 — micro-interacción de conversión
**Qué hace:** Todos los botones primarios responden con `scale(0.96)` + `transition: 100ms` al `:active`,
simulando feedback táctil de "press". Duración de 100ms en press, 250ms elastic en release. Actualmente
los botones de CityStream no tienen este feedback.
**Implementación:** CSS puro, 10 líneas.
**Impacto:** Medio | **Performance:** Bajo | **Estado:** Mainstream (expectativa baseline)

### T6 — CSS `contain: content` en Secciones Pesadas
**Tendencia:** Performance optimization standard 2025 (web.dev Core Web Vitals guidance)
**Qué hace:** Añade `contain: layout style paint` en las secciones con más animaciones (`.features`,
`.experiences`, `.numbered-features`, `.cta-section`) para aislar su renderizado del resto del DOM.
El navegador sabe que cambios internos a estas secciones no afectan elementos externos, reduciendo el
scope de recalculations.
**Implementación:** CSS puro, 1 línea por sección.
**Impacto:** Invisible al usuario | **Performance:** Mejora real en scroll pesado | **Estado:** Mainstream

---

## Impacto esperado

| Mejora | Efecto visual | Efecto UX | Costo runtime |
|--------|--------------|-----------|---------------|
| Variable font bloom | ★★★★★ | Memorable hero | 0 extra |
| Glassmorphism navbar | ★★★★☆ | Premium feel durante scroll | Mínimo |
| @property gradient text | ★★★★☆ | Vida en los headings | 0 |
| View Transitions theme | ★★★☆☆ | Deleite inesperado | 0 extra |
| Button press feedback | ★★☆☆☆ | Confianza táctil | 0 extra |
| CSS containment | ★☆☆☆☆ (invisible) | Scroll más fluido | Negativo (mejora) |

## Afectados

- `static/css/style.css` — T2, T3, T5, T6
- `static/js/main.js` — T1, T4
- No se tocan: `index.html`, librerías externas, imágenes
