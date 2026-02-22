# Tasks: add-hero-particle-grid

## 1. Setup

- [x] 1.1 Añadir tsParticles CDN bundle a `index.html` (antes de main.js)
- [x] 1.2 Añadir `<div id="hero-particles" aria-hidden="true">` dentro de `.hero`, antes de los orbs

## 2. CSS

- [x] 2.1 Añadir estilos para `#hero-particles`: `position: absolute; inset: 0; z-index: 0; pointer-events: none`
- [x] 2.2 `.hero-content` ya tenía `position: relative; z-index: 1` — confirmado
- [x] 2.3 Ambient orbs siguen visibles (`z-index: 0`, DOM order mantiene orbs sobre partículas)

## 3. JavaScript

- [x] 3.1 `getHeroParticlesConfig()` con nodos pequeños (naranja + neutros) + líneas de conexión
- [x] 3.2 Movimiento lento (`speed: 0.4`), aleatorio, `outModes: bounce`
- [x] 3.3 Hover repulse interaction (`distance: 90`)
- [x] 3.4 Respeta `prefers-reduced-motion`: `move.enable: !prefersReducedMotion`
- [x] 3.5 Responsive: 45 en desktop, 20 en mobile (≤768px)
- [x] 3.6 Light theme: colores oscuros/grises; dark theme: colores claros/grises + naranja en ambos
- [x] 3.7 Re-init en theme toggle para actualizar colores

## 4. QA

- [x] 4.1 Desktop dark mode: nodos grises/blancos + naranja + líneas de conexión — ✅ verificado
- [x] 4.2 Desktop light mode: nodos grises oscuros + naranja visibles sobre fondo claro — ✅ verificado
- [x] 4.3 Zero console errors — ✅ confirmado
