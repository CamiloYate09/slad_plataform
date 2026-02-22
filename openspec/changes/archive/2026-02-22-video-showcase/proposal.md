# Proposal: video-showcase

## Summary
Integrar el video `static/video/citystream.MP4` en la landing page de CityStream como una sección dedicada de showcase, colocada estratégicamente después de "Construido diferente" (numbered-features) y antes de "Value Proposition".

## Contexto del video
| Propiedad | Valor |
|-----------|-------|
| Archivo | `static/video/citystream.MP4` |
| Resolución | 1920 × 1608 px |
| Aspect ratio | ≈ 6:5 (no estándar — más cuadrado que 16:9) |
| Duración | ~17 segundos |
| Tamaño | 11 MB |
| Bitrate | 5,414 kbps |

## Análisis de colocación

### Por qué 6:5 descarta ciertas posiciones
El aspect ratio 6:5 (≈1.19:1) es más alto de lo habitual para video landscape. Esto significa:
- **Hero background**: Descartado — el ratio deja franjas vacías horizontales enormes (letterboxing), o recorte extremo vertical si se usa `object-fit: cover`.
- **Reemplazo del `value-prop-image`**: No recomendado — el ratio 6:5 en una columna tipo grid 16:9 generaría reflow o imagen visualmente desequilibrada versus el texto al lado.
- **Sección dedicada con container de ratio natural**: Óptimo — el video se muestra en su aspect ratio real sin distorsión.

### Posición recomendada: entre `numbered-features` y `value-prop`
En este punto del scroll el usuario ya procesó:
1. Las 4 funcionalidades principales (features sticky narrative)
2. Los 3 diferenciadores (Construido diferente)

El video actúa como **"aquí está en acción"** antes del párrafo de value proposition. Flujo emocional: conozco qué hace → veo cómo luce → leo por qué importa.

## Solución propuesta

### Estructura
Nueva sección `<section class="video-showcase">` con:
- Encabezado pequeño tipo `section-label` + bajada corta (opcional)
- Contenedor centrado con `max-width: 960px` y `aspect-ratio: 1920/1608`
- Elemento `<video>` con `autoplay muted loop playsinline preload="none"`
- Poster estático (`poster="static/img/img-07.jpg"` como fallback visual) para usuarios que no ven el video
- Soporte `prefers-reduced-motion`: si está activo, el video muestra solo el poster (no autoplay)

### Rendimiento
- `preload="none"` → el navegador no descarga el video hasta que sea visible
- Intersection Observer para activar `video.play()` solo cuando la sección entra al viewport (lazy autoplay)
- Sin audio → seguro para autoplay sin interacción del usuario

### Accesibilidad
- `aria-label` en el video
- `<track kind="captions">` vacío o descriptive text como alternativa
- Respeta `prefers-reduced-motion`

## Opciones de implementación consideradas

| Opción | Descripción | Decisión |
|--------|-------------|----------|
| A — Sección dedicada centrada | Nueva sección entre numbered-features y value-prop | ✅ Seleccionada |
| B — Reemplazar value-prop image | Sustituir `img-07.jpg` por `<video>` en la columna derecha | Descartado: ratio 6:5 rompe el balance de la grilla 2-col |
| C — Hero background loop | Video de fondo en la sección hero | Descartado: 11MB above-the-fold + ratio no cubre |
| D — Video dentro de CTA section | Video detrás del CTA card final | Descartado: el CTA final debe tener impacto limpio, no distracción |

## Archivos afectados
- `index.html` — nueva sección `video-showcase`
- `static/css/style.css` — estilos de la sección
- `static/js/main.js` — Intersection Observer para lazy autoplay y soporte `prefers-reduced-motion`
