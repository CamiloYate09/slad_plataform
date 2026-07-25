# Design: Pomelo Hero Split — Decisiones Técnicas

## Arquitectura del Hero Split

### Layout principal

```
DESKTOP (>= 1024px)
┌─────────────────────────────────────────────────────────┐
│  .hero                                                  │
│  ┌──────────────────────┬──────────────────────────┐   │
│  │  .hero-left          │  .hero-right              │   │
│  │                      │                           │   │
│  │  [logo pequeño]      │    .phone-frame           │   │
│  │                      │    ┌──────────────┐       │   │
│  │  h1 gradient-text    │    │ .phone-screen│       │   │
│  │                      │    │  .phone-map  │       │   │
│  │  p.hero-subtitle     │    │  [dots]      │       │   │
│  │                      │    │  .phone-card │       │   │
│  │  .hero-actions       │    └──────────────┘       │   │
│  │  [Explorar Ahora →]  │    ↑ float animation      │   │
│  │                      │                           │   │
│  └──────────────────────┴──────────────────────────┘   │
│  #hero-particles, .hero-orbs → mantienen posición abs  │
└─────────────────────────────────────────────────────────┘

MOBILE (<= 768px)
┌─────────────────────────────┐
│  .hero-left (full width)    │
│  h1, subtitle, CTA          │
│  .hero-right (full width)   │
│  phone mockup centrado      │
│  (scale: 0.8)               │
└─────────────────────────────┘
```

### Estrategia de transición

El `.hero-content` actual tiene `text-align: center` y está alineado al centro. El cambio:
- Renombrar (conceptualmente) — `.hero-content` se convierte en flex container
- Añadir `.hero-left` y `.hero-right` como hijos directos
- Mover el contenido existente a `.hero-left`
- El logo `.hero-logo` permanece en `.hero-left` pero reduce tamaño

---

## El Phone Mockup — CSS puro

### Estructura HTML

```html
<div class="hero-right" aria-hidden="true">
  <div class="phone-frame">
    <div class="phone-notch"></div>
    <div class="phone-screen">
      <!-- Mapa abstracto de Colombia -->
      <div class="phone-map">
        <div class="map-dot map-dot--bogota">
          <span class="map-dot-pulse"></span>
          <span class="map-dot-label">Bogotá</span>
        </div>
        <div class="map-dot map-dot--medellin">
          <span class="map-dot-pulse"></span>
          <span class="map-dot-label">Medellín</span>
        </div>
        <div class="map-dot map-dot--cartagena">
          <span class="map-dot-pulse"></span>
          <span class="map-dot-label">Cartagena</span>
        </div>
        <div class="map-dot map-dot--cali">
          <span class="map-dot-pulse"></span>
          <span class="map-dot-label">Cali</span>
        </div>
        <!-- Líneas conectoras SVG -->
        <svg class="map-lines" ...></svg>
      </div>
      <!-- Tarjeta de evento preview -->
      <div class="phone-card">
        <span class="phone-card-badge">🔥 En vivo</span>
        <p class="phone-card-title">Feria de las Flores</p>
        <p class="phone-card-sub">Medellín · 12 ago</p>
      </div>
    </div>
  </div>
</div>
```

### CSS del phone frame

```css
.phone-frame {
  width: 240px;
  height: 480px;
  border: 2px solid var(--glass-border);
  border-radius: 36px;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: var(--glass-blur);
  box-shadow:
    var(--shadow-premium),
    inset 0 1px 0 rgba(255,255,255,0.08);
  position: relative;
  overflow: hidden;
  animation: phoneFloat 4s ease-in-out infinite;
}

@keyframes phoneFloat {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-16px) rotate(-2deg); }
}
```

### Mapa de Colombia abstracto

Los dots de ciudades se posicionan con `position: absolute` usando coordenadas aproximadas de Colombia dentro del rectángulo del phone:

```
Colombia bounding box → phone screen (220x380px interior)
Bogotá:     left: 45%, top: 60%   (centro-oriente)
Medellín:   left: 35%, top: 45%   (noroeste)
Cartagena:  left: 30%, top: 20%   (norte costa)
Cali:       left: 30%, top: 65%   (suroeste)
```

Cada dot tiene:
- Núcleo: `6px × 6px`, color de la marca
- Pulse: anillo que se expande y desvanece (keyframe independiente por dot para desfase)
- Label: `font-size: 9px`, `white-space: nowrap`

### Líneas SVG conectoras

SVG inline con `opacity: 0.15`, `stroke` de `--accent-cyan`, `stroke-dasharray` para efecto de "señal viajando":

```svg
<path d="M 105 170 L 84 85 L 72 46" 
      stroke="currentColor" 
      stroke-dasharray="4 3"
      fill="none"/>
```

### Tarjeta de evento (phone-card)

```css
.phone-card {
  position: absolute;
  bottom: 16px;
  left: 12px;
  right: 12px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  padding: 10px 12px;
}
```

El contenido rota entre 3 eventos via JS (fade in/out cada 3s). Si `prefers-reduced-motion`, muestra el primero estático.

---

## Ambient Section Glows

### Patrón (aplicado a features, numbered-features, experiences)

```css
.features::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 50% at 50% 0%,
    rgba(175, 64, 255, 0.08),
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

.experiences::before {
  background: radial-gradient(
    ellipse 70% 50% at 50% 0%,
    rgba(0, 221, 235, 0.07),
    transparent 70%
  );
}
```

Cada sección debe tener `position: relative` para contener el `::before`.

---

## Section Rhythm

```css
/* Secciones con fondo oscuro alternado */
.trusted-by,
.numbered-features {
  background: var(--bg-dark-band); /* #111111 */
}
```

Verificar que no colisione con el gradiente del `body::before`.

---

## CTA Button Glow

```css
.btn-primary:hover {
  /* existente + añadir: */
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
}
```

---

## Responsive del Hero Split

```css
@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
  .hero-left { align-items: center; }
  .hero-right {
    margin-top: 2rem;
    transform: scale(0.85);
  }
}

@media (max-width: 768px) {
  .hero-right { display: none; } /* Ocultar en mobile muy pequeño */
}
```

---

## Decisiones tomadas

| Decisión | Alternativa descartada | Razón |
|----------|------------------------|-------|
| Mockup CSS puro | Imagen real de app | No existe app todavía; CSS es flexible y editable |
| Mapa abstracto (dots) | Mapa SVG real de Colombia | Mapa real añade peso; dots transmiten la idea con elegancia |
| Float animation CSS `@keyframes` | GSAP | El float es simple y repetitivo; GSAP se reserva para scroll |
| Dots con pulse ring | Solo dots estáticos | El ring pulso comunica "en vivo / activo" — apropiado para la marca |
| `aria-hidden="true"` en `.hero-right` | Describir el mockup | Es decorativo; no aporta información a lectores de pantalla |
| Tarjeta con rotación JS | Carrusel CSS | JS permite control de timing y `prefers-reduced-motion` |
