## 1. Lenis Smooth Scroll
- [x] 1.1 Agregar Lenis CDN script en index.html (antes de main.js)
- [x] 1.2 Inicializar Lenis en main.js con configuracion suave
- [x] 1.3 Integrar Lenis con GSAP ScrollTrigger via lenis.on('scroll', ScrollTrigger.update)
- [x] 1.4 Remover `scroll-behavior: smooth` del CSS (Lenis lo reemplaza)

## 2. Tipografia Agresiva
- [x] 2.1 Incrementar --fs-display a clamp(3rem, 8vw, 5.5rem) para hero heading
- [x] 2.2 Incrementar --fs-h2 a clamp(2rem, 5vw, 3.5rem) para section headings
- [x] 2.3 Reducir letter-spacing de headings a -0.03em (tracking mas apretado)
- [x] 2.4 Agregar font-weight 900 al hero title para mas impacto

## 3. Micro-Interacciones
- [x] 3.1 Agregar scale sutil (1.02) al hover de btn-primary ademas del translateY
- [x] 3.2 Agregar transicion de background-position al hover del btn-primary (gradient shift ya existia)
- [x] 3.3 Mejorar hover de exp-card: agregar glow sutil con box-shadow de color accent
- [x] 3.4 Agregar efecto de zoom sutil en tab-image al hover

## 4. Parallax Sutil
- [x] 4.1 Agregar parallax GSAP en hero-logo (y: -40 con scrub)
- [x] 4.2 Agregar parallax en value-prop-image (y: -30 con scrub)
- [x] 4.3 Respetar prefers-reduced-motion (parallax dentro del bloque !prefersReducedMotion)

## 5. Performance
- [x] 5.1 Agregar <link rel="preload"> para Geist Sans font en index.html
- [x] 5.2 Agregar will-change: transform a carousel-track y progress-fill
- [x] 5.3 font-display: swap se mantiene (Google Fonts lo aplica automaticamente en la URL)

## 6. Validacion
- [x] 6.1 Verificar que Lenis + GSAP ScrollTrigger funcionan juntos sin conflictos — typeof guard + lenis.on('scroll') + gsap.ticker.add()
- [x] 6.2 Verificar que prefers-reduced-motion desactiva Lenis y parallax — ambos dentro de if (!prefersReducedMotion)
- [x] 6.3 Cross-validar selectores CSS/HTML/JS — zero mismatches confirmado por agente
