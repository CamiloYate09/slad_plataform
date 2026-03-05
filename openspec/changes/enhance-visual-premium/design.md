# Design: Mejora visual premium — decisiones técnicas

## Contexto

El análisis del bundle CSS de aisummit.com.co (`/assets/index-C35F_WbN.css`, 95KB minificado con Tailwind) y el JS bundle (`/assets/index-iXnJAI5Q.js`) reveló el sistema de diseño completo de uno de los landing pages de tech más polidos de Colombia. Este doc captura las decisiones arquitectónicas antes de codificar.

## Análisis comparativo completo

### AI Summit (referencia)

| Atributo | AI Summit | CityStream actual |
|----------|-----------|-------------------|
| **Font heading** | ASFALLT Sans (custom) + Breite Grotesk | Geist |
| **Font body** | Poppins / Inter | Geist |
| **h1 size** | clamp(2rem, 5vw, 4.5rem) | clamp(3rem, 8vw, 5.5rem) ← mayor |
| **Primary color** | `#6300FF` (pure purple) | `#af40ff` (softer purple) |
| **Accent color** | `#1000f8` (electric blue) | `#5b42f3` (indigo) |
| **Orange CTA** | `#FF9E38` (vibrant) | `#f97316` (similar, menos bold) |
| **Background** | `#030303` / `#1a1a1a` | `#0a0a0a` |
| **Card bg** | Glass: `rgba(white,0.05)` + `blur(24px)` | `rgba(white, 0.03)` sin blur |
| **Card border** | `rgba(white, 0.1)` + gradient border | `rgba(white, 0.08)` |
| **Shadows** | Purple-tinted premium + glow | Neutros / no saturados |
| **Glassmorphism** | Sí, `backdrop-blur: 24px` en nav y cards | Solo navbar con `blur(20px)` |
| **Animation engine** | CSS puro (fade-in, slide-in) | GSAP + ScrollTrigger ← mayor |
| **Text animation** | No | Splitting.js chars ← mayor |
| **Scroll** | Nativo | Lenis smooth scroll ← mayor |
| **Particles** | No | tsParticles ← mayor |
| **Border radius** | Variado: pill/36px/24px/14px | Uniforme: 12px / 8px |
| **Section labels** | Badge con borde visible | Clip-path reveal sutil |

**Conclusión**: CityStream ya supera a AI Summit en animaciones (GSAP vs CSS puro). Las brechas están en la **capa visual estática**: glassmorphism, shadows con color, y prominencia tipográfica.

## Decisiones

### Decisión 1: Glassmorphism — blur(8px) no blur(24px)

AI Summit usa `backdrop-blur: 24px` en cards. Para CityStream usamos **blur(8px)** por dos razones:
1. Las cards de CityStream son más densas (texto + imagen) → blur alto compite con legibilidad
2. El background de CityStream es `#0a0a0a` (casi opaco) → menos material "detrás" para refractar → un blur de 8px es suficiente para el efecto sin artefactos

Alternativa descartada: `blur(16px)` — demasiado pesado en cards con imagen de fondo y sin material visual útil detrás.

### Decisión 2: Premium shadows — usar variables de marca CityStream no purple-puro

AI Summit usa `hsl(262 100% 50%)` como color de shadow (purple puro). CityStream usa `--glow-purple: rgba(175, 64, 255, 0.18)` como variable existente.

Decisión: los nuevos tokens `--shadow-premium` y `--shadow-glow` usarán los colores de marca CityStream (af40ff / 5b42f3) para consistencia:
```css
--shadow-premium: 0 20px 50px -10px rgba(175, 64, 255, 0.25);
--shadow-glow: 0 0 30px rgba(175, 64, 255, 0.35);
--shadow-cyan-glow: 0 0 20px rgba(0, 221, 235, 0.2);
```

### Decisión 3: Section labels — NO cambiar el color base

El `.section-label` actual tiene la animación clip-path-reveal ya implementada (spec `animations`). El upgrade solo toca el estado estático post-reveal: añadir un `border-color` más visible y un background con 2-3% más de opacidad.

No añadir gradiente de fondo en section-label (complejidad vs beneficio bajo; el gradiente en body+h1 ya es suficiente).

### Decisión 4: Hero heading glow — text-shadow, no filter

Para dar profundidad tipográfica sin depender de una fuente custom (como ASFALLT Sans), usamos `text-shadow`. El `filter: blur()` en texto afecta a los hijos (incluyendo spans de Splitting.js) y puede causar glitches con la animación de caracteres.

```css
/* Solo en el hero h1 con gradient-text */
.hero-title {
  filter: drop-shadow(0 0 20px rgba(175, 64, 255, 0.4));
}
```

`filter: drop-shadow()` sobre el elemento contenedor no interfiere con los clips de Splitting.js como lo haría un `text-shadow` directo.

### Decisión 5: Carousel items — glass border, no blur

Los `.carousel-item` (ciudades) no tienen contenido detrás para aprovechar glassmorphism real. El upgrade es solo: border más visible + background ligeramente más opaco + border-radius más pronunciado (pill shape como en AI Summit).

## Riesgos / trade-offs

| Riesgo | Mitigación |
|--------|------------|
| `backdrop-filter` no soportado en Firefox antiguo | Ya existe en la navbar (glassmorphism scrolled) — no es nuevo riesgo |
| `filter: drop-shadow` en `.hero-title` puede afectar Splitting.js | Testar en browser antes de deploy; alternativa: `text-shadow` en `.hero-title .char` |
| Cards con glassmorphism en light theme pueden verse diferentes | El sistema light-theme ya ajusta bg-card; añadir override explícito en light theme |

## Open questions

- ¿Aplicar glassmorphism también a `.features-item`? Es un `<article>` con texto+imagen — el blur puede verse bien con el background de la sección. Incluir en scope pero marcar como opcional en tasks.
- ¿El orange del `.btn-primary` debe hacer hover con naranja saturado (AI Summit style) o mantener el gradiente actual? Propuesta: hover más brillante del gradiente actual, no cambiar a solid orange.
