## 1. CSS — Glassmorphism navbar (T2)
- [x] 1.1 Modificar `#navbar.scrolled` para usar `backdrop-filter: blur(20px) saturate(180%)`
- [x] 1.2 Añadir `::after` con noise SVG inline en navbar scrolled (opacity 0.035, mix-blend-mode overlay)
- [x] 1.3 Ajustar border-bottom del navbar scrolled a rgba(255,255,255,0.07)

## 2. CSS — @property gradient text animado (T3)
- [x] 2.1 Registrar `@property --gradient-angle` con syntax '<angle>'
- [x] 2.2 Actualizar `.gradient-text`, `.gradient-text .char` y `.split-word` para usar `var(--gradient-angle)`
- [x] 2.3 Añadir `@keyframes gradient-rotate` (144deg → 504deg, 8s infinite) y aplicar a `.gradient-text`

## 3. CSS — Button active press feedback (T5)
- [x] 3.1 Añadir `:active` con `scale(0.96)` y `transition-duration: 100ms` en `.btn-primary`, `.btn-primary-sm`, `.btn-outline-sm`, `.cta-btn`

## 4. CSS — CSS containment en secciones (T6)
- [x] 4.1 Añadir `contain: style paint` a `.numbered-features`, `.cta-section`, `.news`, `.stats`

## 5. JS — Variable font weight bloom (T1)
- [x] 5.1 Set initial `fontVariationSettings: '"wght" 100'` en `.hero-title` antes de la timeline
- [x] 5.2 Animar `wghtProxy.wght` de 100 a 700 con `onUpdate` actualizando `fontVariationSettings` en hero title

## 6. JS — View Transitions en theme toggle (T4)
- [x] 6.1 Extraer lógica toggle a función `applyTheme()`
- [x] 6.2 Calcular origen del círculo desde `themeToggle.getBoundingClientRect()`
- [x] 6.3 Envolver toggle en `document.startViewTransition(applyTheme)` con CSS vars de posición
- [x] 6.4 Degradación: si API no disponible o prefersReducedMotion, llamar `applyTheme()` directamente
