# Tasks: add-ux-parity-v2

## 1. Sticky Scroll Narrative (features section)

- [x] 1.1 Reestructurar HTML de `.features` en `index.html`: reemplazar `.features-tabs` por `.features-sticky-wrap` (left + right) + `.features-scroll-items` (4 items)
- [x] 1.2 Añadir lista numerada clickeable en `.features-sticky-left` (01 Ciudades / 02 Eventos / 03 Personas / 04 Conciertos)
- [x] 1.3 Añadir CSS para `.features-sticky-wrap`, `.features-sticky-left`, `.features-sticky-right`, `.features-item` en `style.css`
- [x] 1.4 Añadir responsive mobile (≤768px): layout vertical apilado, sin sticky
- [x] 1.5 Implementar JS en `main.js`: IntersectionObserver para toggle de panel activo en cada milestone de scroll
- [x] 1.6 Hacer la lista numerada clickeable: al hacer clic en un ítem, scroll programático al panel correspondiente
- [x] 1.7 Remover CSS/JS del tab system anterior (`tab-buttons`, `tab-panels`, `tab-btn`)

## 2. Background Texture

- [x] 2.1 Añadir `<div class="bg-texture">` con `repeating-linear-gradient` diagonal en `style.css`
- [x] 2.2 Ajustar opacidad para light mode vs dark mode
- [x] 2.3 Verificar que no interfiere con secciones que tienen `position: relative; z-index > 0`

## 3. Dark Contrast Band

- [x] 3.1 Definir `--bg-dark-band: #111111` en `:root` en `style.css`
- [x] 3.2 Aplicar banda oscura full-bleed a `.numbered-features` via `::before` pseudo-elemento
- [x] 3.3 Ajustar colores de texto, números y borders dentro de `.numbered-features` para contraste sobre fondo oscuro
- [x] 3.4 Verificar que `.section-label` y heading dentro de la banda se ven correctamente

## 4. CTA Dark Card

- [x] 4.1 Reestructurar HTML de `.cta-section` en `index.html`: añadir `.cta-card` wrapper con label, heading actualizado y botón
- [x] 4.2 Reescribir estilos de `.cta-section` y `.cta-card` en `style.css`: fondo negro, borde sutil, border-radius, padding generoso
- [x] 4.3 Estilizar `.cta-label` (monospace, naranja, punto decorativo) y `.cta-btn` (CTA prominente)
- [x] 4.4 Añadir hover state al `.cta-btn`
- [x] 4.5 Verificar responsivo en mobile

## 5. Navbar Active Section

- [x] 5.1 `.nav-active` CSS ya estaba implementado (preexistente)
- [x] 5.2 IntersectionObserver para secciones ancla ya implementado (preexistente)
- [x] 5.3 Toggle de `.nav-active` en navbar funcionando correctamente
- [x] 5.4 Edge case hero (#inicio) activo al top manejado

## 6. QA y Validación

- [x] 6.1 Verificar en desktop (1280px+): sticky scroll funciona, textura visible, dark band correcta
- [x] 6.2 Verificar en tablet (768px–1024px): sticky scroll degradado graciosamente (columna única, nav oculta)
- [x] 6.3 Verificar en mobile (375px): layout vertical sin sticky, dark band y CTA card correctos
- [x] 6.4 Verificar `prefers-reduced-motion`: sticky scroll usa IntersectionObserver (no animaciones), layout funcional
- [x] 6.5 Verificar dark mode: textura ajustada, dark band consistente, CTA card legible
- [x] 6.6 Verificar light mode: dark band contrasta fuertemente, CTA card destaca sobre fondo claro
- [x] 6.7 Zero console errors — confirmado
- [x] 6.8 Navegación por teclado: fnav-items son `<button>` elements, accesibles por teclado
