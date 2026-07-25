# Change: Pomelo-Inspired Hero Split + Visual Depth

## Por qué

Análisis comparativo entre CityStream y [pomelo.la](https://www.pomelo.la/en) — uno de los landing pages de fintech más sofisticados de Latinoamérica — revela que la principal brecha visual no está en la paleta ni en la tipografía (ambas son casi idénticas), sino en tres patrones estructurales:

1. **Hero sin producto visible**: El hero actual es centrado texto+logo. Pomelo presenta un mockup del producto flotando a la derecha — hace que la plataforma parezca real y lanzada, no en construcción.
2. **Secciones sin profundidad ambiental**: Pomelo usa `radial-gradient` orbes de color detrás de cada sección de features, creando una sensación de luz que guía el scroll. CityStream tiene orbes solo en el hero.
3. **Ritmo visual plano**: Todas las secciones de CityStream tienen el mismo fondo `#0a0a0a`. Pomelo alterna entre negro y `#111111`, creando "beats" visuales que estructuran el contenido.

La variable `--bg-dark-band` ya existe en el CSS pero no está aplicada. Los tokens de glassmorphism y sombras están implementados (enhance-visual-premium). La base está lista — este change amplifica.

## Qué cambia

### Hero Split Layout
- `.hero-content` se convierte en layout de dos columnas (flex row)
- **Columna izquierda** (texto): logo pequeño, h1, subtitle, CTA — alineados a la izquierda
- **Columna derecha** (visual): mockup de phone con CSS puro que muestra un mapa oscuro de Colombia con puntos luminosos para las ciudades y una tarjeta de evento flotante en la parte inferior

### Mockup CSS del Mapa
- `.phone-frame` → cuerpo del teléfono con CSS (border, border-radius, reflection)
- `.phone-screen` → pantalla oscura con UI simulada
- `.phone-map` → visualización abstracta del mapa con puntos SVG/CSS para ciudades
- `.phone-card` → tarjeta de evento preview al pie de la pantalla
- `@keyframes phoneFloat` → animación suave de levitación (ya existe patrón en `hero-orb`)

### Ambient Section Glows
- `::before` con `radial-gradient` en `.features`, `.numbered-features`, `.experiences`
- Colores: purple en features, cyan en experiences — siguiendo la paleta existente

### Section Rhythm
- `.trusted-by`, `.numbered-features` → `background: var(--bg-dark-band)`
- Crea contraste sutil que estructura el scroll visualmente

### CTA Button Glow
- `box-shadow` naranja en hover del `.btn-primary` para mayor legibilidad como acción principal

## Lo que NO cambia
- Stack tecnológico (vanilla HTML/CSS/JS)
- Animaciones GSAP/ScrollTrigger (ventaja competitiva)
- Paleta de colores y tokens existentes
- Geist font
- Body border gradient
- El layout de secciones debajo del hero
- Lenis smooth scroll
- Tema dark/light (el mockup respeta ambos)

## Referencia
Pomelo patterns clave analizados:
```
Hero layout:     split 50/50 text + product visual
Ambient glows:   radial-gradient ellipse 60% at 50% top
Section rhythm:  #0a0a0a / #111111 alternado
CTA glow:        box-shadow naranja en hover
Card depth:      glass bg + shadow-premium en hover
```
