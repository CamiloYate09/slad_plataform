# Spec Delta: visual-theme — ux-impact-animations

## Capability: ambient-visual-effects

### ADDED: hero-orbs
Tres orbes de color en el fondo del hero:
- Orbe 1: `--glow-purple` (ya definido en :root), posición top-left, 400px × 400px
- Orbe 2: `--glow-blue`, posición center, 300px × 300px
- Orbe 3: `--glow-cyan`, posición bottom-right, 350px × 350px
- `filter: blur(80px)`, `pointer-events: none`, `z-index: 0`
- Animación CSS: float suave (8–14s, alternating directions)

### ADDED: top-progress-gradient
La barra de progreso superior usa el mismo gradiente del borde del `body`:
`linear-gradient(90deg, #af40ff, #5b42f3 50%, #00ddeb)`

## Capability: interactive-states

### ADDED: nav-active-state
`.nav-links a.nav-active`:
- `color: var(--accent-orange-hover)` — color naranja brand
- Underline animado: `::after` con `width: 100%` (transition desde `width: 0`)

### MODIFIED: experience-card-image-container
`.exp-image` requiere `overflow: hidden` para que el hover scale y parallax no rompan el layout del card. Confirmar que el CSS existente lo tiene; agregar si falta.
