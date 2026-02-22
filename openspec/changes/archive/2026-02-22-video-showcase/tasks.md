# Tasks: video-showcase

Ordered implementation steps, each verifiable de forma independiente.

## [x] T1 — HTML: nueva sección `video-showcase`
Insertar en `index.html` entre `</section>` de `numbered-features` y `<section class="value-prop">`:
```html
<section class="video-showcase" aria-label="CityStream en acción">
  <div class="section-header">
    <span class="section-label">La plataforma</span>
    <p class="video-showcase-caption">Mira cómo funciona CityStream</p>
  </div>
  <div class="video-showcase-container">
    <video
      class="showcase-video"
      autoplay
      muted
      loop
      playsinline
      preload="none"
      poster="static/img/img-07.jpg"
      aria-label="Video de demostración de CityStream"
    >
      <source src="static/video/citystream.MP4" type="video/mp4" />
    </video>
  </div>
</section>
```
**Validación**: La sección aparece en DOM entre `#numbered-features` y `.value-prop`.

## [x] T2 — CSS: estilos de la sección
Agregar en `static/css/style.css` (en la sección de numbered-features o después):
- `.video-showcase`: padding vertical, text-align center
- `.video-showcase-container`: `max-width: 960px`, `margin: 0 auto`, `aspect-ratio: 1920/1608`, `border-radius: var(--radius-lg)`, `overflow: hidden`, borde sutil y sombra
- `.showcase-video`: `width: 100%`, `height: 100%`, `object-fit: cover`, `display: block`
- `.video-showcase-caption`: tipografía semejante a `.features-tagline`
- Responsive: en `@media (max-width: 768px)` → max-width: 100%, border-radius reducido
- Light theme: ajustar borde/sombra si aplica
**Validación**: La sección es visualmente correcta en dark y light theme, y en viewport 375px, 768px, 1280px.

## [x] T3 — JS: Intersection Observer para lazy autoplay
Agregar en `static/js/main.js`:
- Detectar `prefers-reduced-motion: reduce` → si activo, pausar el video (solo mostrar poster)
- Crear `IntersectionObserver` que llama `video.play()` cuando entra al viewport (threshold: 0.3) y `video.pause()` cuando sale
- Guard: ejecutar solo si `video` existe en DOM
**Validación**: En DevTools → Performance, el archivo `.MP4` no se descarga hasta que el video entra en viewport. Con `prefers-reduced-motion`, el video permanece estático.

## [x] T4 — Validación visual en navegador
- Servir localmente (`python3 -m http.server 8787`)
- Verificar reproducción automática, loop, sin audio
- Verificar que el poster se muestra antes de que cargue el video
- Verificar responsive en 375px y 768px
- Verificar que no hay layout shift (CLS) al cargar el video

## Dependencias
- T1 debe completarse antes de T2 y T3
- T2 y T3 son paralelizables
- T4 depende de T1 + T2 + T3
