# Change: Elementos inspirados en robot.com — proof-points y footer con personalidad

## Por qué

Análisis de [robot.com](https://www.robot.com/) (empresa de robótica). Temáticamente no se relaciona con CityStream (red social de ciudades/eventos), así que **no se copia contenido**; se extraen tres patrones de UI/UX distintivos y transferibles que CityStream **aún no tiene**:

1. **Banda de métricas / proof-points** — robot.com muestra cifras grandes ("10 países", "5 continentes", "Level 4") que generan credibilidad inmediata. CityStream solo tiene el carrusel de ciudades (`trusted-by`); le falta una banda de números que respalde el "primera red social de Colombia".
2. **Footer con personalidad animada** — robot.com cierra con un motivo animado (ojos/puntos) que da carácter. El footer de CityStream es una grilla estática; un acento animado sutil refuerza el tono lúdico de una red social.

> Nota: un tercer patrón inicialmente incluido —**cita de fundador / testimonial**— se retiró de este alcance porque no hay una cita real disponible; ver `remove-visible-placeholders`. Se podrá reintroducir cuando exista la cita.

Los demás elementos de robot.com **ya existen** en CityStream (carrusel de logos = `trusted-by`, video embed = `video-showcase`) o **no aplican** (navegación dual izquierda/derecha, acordeones — redundantes con el sticky-scroll de `features`, y contenido robot-específico).

## Qué cambia

### Eje 1 — Social proof (nueva capability `social-proof`)
- **Stats band**: nueva sección con 3–4 métricas grandes (ej. ciudades, eventos, usuarios en lista) entre `trusted-by` y `features`. Números con `--gradient-text`, label debajo. Animación de conteo en scroll (reutiliza GSAP/ScrollTrigger existente).

### Eje 2 — Footer con personalidad (nueva capability `playful-footer`)
- Acento animado sutil sobre el `footer-badge` o junto al footer: motivo lúdico (ej. punto/onda pulsante o icono animado) con CSS `@keyframes`, respetando `prefers-reduced-motion`.

### Copy (tarea, sin spec)
- Pase de microcopy con tono confiado y directo al estilo robot.com ("para hoy, no para algún día") en hero subtitle y CTAs — ajuste de texto, sin cambio estructural.

## Lo que NO cambia

- Stack (HTML/CSS/JS vanilla + GSAP + Lenis), estructura de secciones existente, paleta de colores.
- Navbar (no se adopta el split dual de robot.com — rompe el patrón actual sin beneficio claro).
- No se añaden acordeones (el sticky-scroll de `features` ya cumple esa función).
- No se añaden dependencias.

## Referencia de diseño

- robot.com: banda de métricas, footer animado, copy directo.
- Reutiliza tokens y patrones ya definidos en `visual-theme`, `animations`, `header-footer`.
