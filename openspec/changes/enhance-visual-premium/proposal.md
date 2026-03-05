# Change: Mejora visual premium inspirada en AI Summit Colombia

## Por qué

Análisis comparativo entre CityStream y [aisummit.com.co](https://www.aisummit.com.co/) — uno de los landing pages de tech más pulidos de Colombia 2026 — revela cinco brechas de impacto visual que se pueden cerrar sin cambiar el stack ni la estructura actual:

1. **Glassmorphism ausente**: AI Summit usa `backdrop-blur: 24px` en cards; CityStream usa backgrounds casi transparentes sin blur → las cards se ven planas.
2. **Sombras sin color**: AI Summit define `--shadow-premium: 0 20px 50px -10px hsl(purple / .3)` y `--shadow-glow: 0 0 40px hsl(purple / .4)` → profundidad premium con tinte de marca. CityStream usa sombras neutras.
3. **Section labels subpercibidos**: AI Summit usa badges con fondo/borde de mayor contraste → jerarquía visual más clara.
4. **Hero heading sin brillo tipográfico**: Los h1 de AI Summit tienen mayor peso visual gracias a la fuente custom + glow de texto; CityStream puede compensar con `text-shadow` y letter-spacing refinado.
5. **CTA button con orange más vibrante**: AI Summit usa `#FF9E38` (naranja saturado) en CTAs principales vs el gradiente actual de CityStream → botones más distinguibles en la jerarquía.

## Qué cambia

- **Glassmorphism tokens**: Nuevas variables CSS `--glass-bg`, `--glass-border`, `--glass-blur` aplicadas a `.exp-card`, `.num-card`, `.news-card`, y `.features-item`
- **Premium shadow system**: Tokens `--shadow-premium` y `--shadow-glow` con tinte del color de marca (purple/cyan)
- **Hero heading glow**: `text-shadow` sutil en el hero h1 para profundidad tipográfica
- **Section label upgrade**: Fondo con gradiente muy sutil y borde más visible en `.section-label`
- **CTA orange pulse**: El `.btn-primary` agrega una variante de hover con orange más saturado y box-shadow naranja
- **Carousel item glass**: Los `.carousel-item` mejoran con border y fondo glass para mayor legibilidad

## Lo que NO cambia

- Font family (Geist permanece — diferenciador CityStream)
- Estructura HTML/secciones
- Animaciones GSAP/ScrollTrigger (ventaja competitiva vs AI Summit que usa solo CSS)
- Body border gradient (diferenciador único)
- Color palette principal (solo se añaden tokens, no se reemplazan)

## Referencia de diseño

AI Summit CSS tokens clave analizados:
```
--truora-purple: 262 100% 50%  → hsl → #6300FF
--truora-blue:   242 100% 50%  → hsl → #1000f8
--orange-vibrant: 32 100% 61%  → hsl → #FF9E38
--shadow-premium: 0 20px 50px -10px hsl(262 100% 50% / .3)
--shadow-glow:    0 0 40px hsl(262 100% 50% / .4)
backdrop-filter: blur(24px)   → usado en nav y cards glass
font: ASFALLT Sans / Breite Grotesk (custom) → nosotros compensamos con glow
h1: clamp(2rem, 5vw, 4.5rem) / line-height 1.1
Animations: fade-in-up 0.6s, scale-in 0.4s (puramente CSS, sin GSAP)
```

## Impacto

- Specs afectadas: `visual-theme`, `animations`
- Archivos de código: `static/css/style.css`
- Sin cambios en: `index.html`, `static/js/main.js`
- Sin nuevas dependencias externas
