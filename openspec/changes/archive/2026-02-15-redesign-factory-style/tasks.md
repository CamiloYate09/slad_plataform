## 1. Tema Visual Base
- [x] 1.1 Cambiar variable `--bg-dark` de `rgb(5, 6, 45)` a `#0a0a0a` en `:root`
- [x] 1.2 Cambiar variable `--bg-card` de `rgba(15, 16, 55, 0.8)` a `rgba(255, 255, 255, 0.03)`
- [x] 1.3 Cambiar variable `--border-subtle` de `rgba(102, 88, 221, 0.3)` a `rgba(255, 255, 255, 0.08)`
- [x] 1.4 Verificar que `--primary-color`, gradient-text y todos los acentos permanecen idénticos
- [x] 1.5 Ajustar colores de texto secundario a `rgba(255, 255, 255, 0.6)` para mejor legibilidad sobre negro

## 2. Tipografía
- [x] 2.1 Reemplazar import de Google Fonts: Public Sans → Inter (pesos 300-800)
- [x] 2.2 Actualizar `font-family` del body a `"Inter", -apple-system, ...`
- [x] 2.3 Agregar `letter-spacing: -0.02em` a headings (h1, h2, h3)
- [x] 2.4 Ajustar `--fs-xl` para headings más grandes: `clamp(3rem, 8vw, 5rem)`
- [x] 2.5 Actualizar `font-weight` del logo a 800 (extra bold)

## 3. Header/Navbar
- [x] 3.1 Cambiar navbar de fondo sólido a `background: transparent` por defecto
- [x] 3.2 Eliminar `border-bottom` por defecto del navbar (transparent)
- [x] 3.3 Implementar clase `.scrolled` con `background: rgba(10, 10, 10, 0.85)`, blur y border sutil
- [x] 3.4 Agregar pseudo-elemento `::after` a nav links para underline-reveal en hover
- [x] 3.5 Ajustar padding del navbar: `padding-inline: 2.25rem` desktop, `1rem` mobile

## 4. Layout y Spacing
- [x] 4.1 Cambiar `--max-width` de `1200px` a `1440px`
- [x] 4.2 Aumentar `--spacing-xl` de `6rem` a `8rem` para más breathing room
- [x] 4.3 Ajustar features-grid gap a `1.5rem` en desktop
- [x] 4.4 Asegurar padding lateral generoso en secciones

## 5. Cards y Componentes
- [x] 5.1 Actualizar `.feature-card` hover a `translateY(-4px)` (de `-1rem`)
- [x] 5.2 Ajustar sombra hover de cards: `0 8px 32px rgba(0, 0, 0, 0.4)`
- [x] 5.3 Actualizar `.feature-card` border hover a `rgba(255, 255, 255, 0.15)`
- [x] 5.4 Refinar `.course-card` hover para ser más sutil (`-4px`, border-hover)
- [x] 5.5 Ajustar decorative-cubes opacidad para estética minimalista negra (0.06)

## 6. Footer
- [x] 6.1 Cambiar fondo footer de gradient azul a `#111111` sólido
- [x] 6.2 Agregar `border-radius: 24px` al footer en desktop, `16px` en mobile
- [x] 6.3 Agregar márgenes laterales al footer (`margin-inline: 1.5rem` desktop, `0.5rem` mobile)
- [x] 6.4 Agregar `margin-bottom: 1.5rem` para separar del borde inferior
- [x] 6.5 Actualizar social icons: fondo transparente con borde sutil, hover suave
- [x] 6.6 Asegurar que footer links cambian a `--accent-cyan` en hover

## 7. Animaciones
- [x] 7.1 Actualizar easing de scroll animations a `cubic-bezier(0.16, 1, 0.3, 1)`
- [x] 7.2 Aumentar translateY inicial de `30px` a `40px` para reveal más dramático
- [x] 7.3 Verificar que stagger delays funcionan correctamente (100ms entre hermanos)
- [x] 7.4 Confirmar que `prefers-reduced-motion` sigue respetándose

## 8. Newsletter Section
- [x] 8.1 Actualizar fondo de `.newsletter-container` para usar nuevo `--bg-card`
- [x] 8.2 Ajustar borde del container al nuevo `--border-subtle`
- [x] 8.3 Refinar el efecto radial gradient del pseudo-elemento para fondo negro (0.15 opacity)

## 9. Validación
- [x] 9.1 Texto blanco (#fff) sobre negro (#0a0a0a) = ratio 19.4:1 (WCAG AAA)
- [x] 9.2 Navbar transparente→sólido implementado con updateNavbar() al cargar
- [x] 9.3 Mobile menu drawer usa rgba(10,10,10,0.98) — funcional
- [x] 9.4 Responsive breakpoints confirmados (480px, 768px, 1024px, 1920px)
- [x] 9.5 TODOS los colores CityStream se mantienen sin cambios (gradiente, acentos, gradient-text)
