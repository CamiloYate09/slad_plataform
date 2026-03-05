## 1. CSS Variables — Nuevos tokens premium

- [x] 1.1 Añadir variables glassmorphism en `:root`: `--glass-bg`, `--glass-border`, `--glass-blur`
- [x] 1.2 Añadir variables de sombra premium en `:root`: `--shadow-premium`, `--shadow-glow`, `--shadow-cyan-glow`
- [x] 1.3 Añadir overrides de las nuevas variables en `body.light-theme`

## 2. Glassmorphism en Cards

- [x] 2.1 Aplicar `backdrop-filter: var(--glass-blur)` y `background: var(--glass-bg)` a `.exp-card`
- [x] 2.2 Aplicar glass a `.num-card`
- [x] 2.3 Aplicar glass a `.news-card`
- [x] 2.4 (Opcional) `.features-item` — omitido; la imagen de fondo hace el blur conflictivo visualmente

## 3. Premium Shadows

- [x] 3.1 Añadir `box-shadow: var(--shadow-premium)` al estado `:hover` de `.exp-card` (también `.num-card`)
- [x] 3.2 Añadir `box-shadow: var(--shadow-glow)` como base del `.cta-card` (integrado en el `cta-border-glow` existente)
- [x] 3.3 `@keyframes glowPulse` — no requerido; se reutilizó el `cta-border-glow` existente con intensidades aumentadas
- [x] 3.4 CTA card glow integrado con el ciclo de colores existente (incluye `--shadow-glow` en todos los keyframes)
- [x] 3.5 `prefers-reduced-motion` ya cubre `.cta-card { animation: none }` en el bloque existente

## 4. Hero Heading Drop-Shadow

- [x] 4.1 Añadir `filter: drop-shadow(0 0 20px rgba(175, 64, 255, 0.4))` al `.hero-title`
- [x] 4.2 Añadir override light-theme: `filter: drop-shadow(0 0 12px rgba(91, 66, 243, 0.2))`
- [ ] 4.3 Verificar que Splitting.js char animation no se vea afectada (visual check en browser)

## 5. Section Label Contrast

- [x] 5.1 Incrementar `border-color` del `.section-label` a `rgba(255,255,255,0.25)` en dark
- [x] 5.2 Añadir `background: rgba(255,255,255,0.10)` + `padding` + `border-radius: 50px` al `.section-label`
- [x] 5.3 Añadir override light-theme equivalente para `.section-label`

## 6. Carousel Item Glass

- [x] 6.1 Cambiar `border-radius` de `.carousel-item` a `9999px` (pill completo)
- [x] 6.2 Actualizar background a `rgba(255,255,255,0.07)` y border a `rgba(255,255,255,0.15)`
- [x] 6.3 Ajustar padding horizontal a `1.25rem` para mejor proporción pill

## 7. Validación

- [x] 7.1 `openspec validate enhance-visual-premium --strict` — PASS
- [ ] 7.2 Verificar visualmente en Chrome dark mode (servidor local)
- [ ] 7.3 Verificar en light mode toggle
- [ ] 7.4 Verificar en mobile (375px) — glassmorphism y shadows no deben crear overflow
- [ ] 7.5 Verificar con `prefers-reduced-motion: reduce` — animaciones pausadas, efectos estáticos OK
