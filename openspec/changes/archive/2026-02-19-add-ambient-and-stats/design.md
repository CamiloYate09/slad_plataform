# Design: add-ambient-and-stats

## Contexto

### Análisis de brechas CityStream vs factory.ai

**Ya implementado (no tocar):**
| Elemento | Estado |
|---|---|
| Geist Sans font | ✅ |
| Dark/light theme toggle + localStorage | ✅ |
| GSAP + ScrollTrigger + Lenis | ✅ |
| Custom cursor dot+follower | ✅ |
| SEO completo (OG, Twitter Card, Schema.org) | ✅ |
| Estructura factory.ai 7 secciones | ✅ |
| Hero entrance GSAP timeline | ✅ |
| Carousel trusted-by infinito | ✅ |
| Tabbed features con GSAP fade | ✅ |
| Link underline-reveal naranja | ✅ |
| focus-visible, skip-link, prefers-reduced-motion | ✅ |
| body.no-transitions en mount | ✅ |
| News section | ✅ |

**Gaps identificados (ordenados por impacto):**
| Gap | Impacto | En este change |
|---|---|---|
| Sin ambient glow en secciones | 🔴 Alto | ✅ Sí |
| Sin sección de estadísticas | 🔴 Alto | ✅ Sí |
| Hero sin orb de fondo | 🟡 Medio | ✅ Sí |
| Mobile menu animation | 🟡 Medio | ❌ No (siguiente) |
| Performance (defer CDN) | 🟡 Medio | ❌ No (siguiente) |
| Glassmorphism avanzado en cards | 🟢 Bajo | ❌ No |

## Decisión 1: Implementación del Ambient Glow

**Técnica**: CSS `::before` pseudo-elementos en contenedores de sección.
```css
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% -10%, rgba(175, 64, 255, 0.18) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
}
```

**Por qué CSS puro (no JS/Canvas):**
- Cero impacto en performance (GPU-composited, no JavaScript)
- No afecta `prefers-reduced-motion` (solo color, no movimiento)
- Compatible con el sistema de tema: `body.light-theme` puede anular opacidad

**Posicionamiento de glows:**
| Sección | Posición del glow | Color |
|---|---|---|
| Hero | Centro-arriba (`50% -10%`) | `rgba(175, 64, 255, 0.18)` — accent-purple |
| Features | Derecha-arriba (`100% 0%`) | `rgba(91, 66, 243, 0.12)` — accent-blue |
| Experiences | Izquierda-centro (`0% 50%`) | `rgba(0, 221, 235, 0.08)` — accent-cyan |

**Light theme:** opacidades reducidas al 50% con `body.light-theme .hero::before { opacity: 0.5; }`.

## Decisión 2: Sección de Estadísticas

**Posición en página**: Entre `.trusted-by` y `.features`. Posición justificada porque actúa como "prueba social" antes de mostrar las funcionalidades.

**4 métricas propuestas:**
| Métrica | Valor | Unidad |
|---|---|---|
| Usuarios activos | 50,000 | "Usuarios" |
| Ciudades disponibles | 5 | "Ciudades" |
| Conexiones totales | 100,000 | "Conexiones" |
| Eventos publicados | 10,000 | "Eventos" |

**Layout**: Fila horizontal con separadores verticales (`1px solid var(--border-base)`), similar al separador de sections de factory.ai. En mobile: 2×2 grid.

**Animación count-up**: GSAP `gsap.to()` sobre una variable numérica con `onUpdate` que formatea el número. Disparo con ScrollTrigger `once: true`. Fallback instantáneo para `prefers-reduced-motion`.

**HTML example:**
```html
<section class="stats">
  <div class="stats-grid">
    <div class="stat-item">
      <span class="stat-number" data-target="50000" data-suffix="K+">0K+</span>
      <span class="stat-label">Usuarios</span>
    </div>
    ...
  </div>
</section>
```

**JS count-up técnica**:
```js
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(el => {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  gsap.to({ val: 0 }, {
    val: target,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    onUpdate() { el.textContent = formatStat(Math.round(this.targets()[0].val)) + suffix; }
  });
});
```

## Decisión 3: Hero Orb (orb visual detrás del hero)

El orb se implementa como el glow del hero (Decisión 1) — no requiere elemento separado. El `radial-gradient` en `::before` ya crea el efecto de orb visible detrás del logo y título.

## Riesgos

- **Riesgo**: Los glows podrían ser demasiado intensos en pantallas brillantes → **Mitigación**: Opacidades conservadoras (0.08–0.18), ajustables vía custom property.
- **Riesgo**: Las métricas de estadísticas son ficticias → **Mitigación**: Ya hay precedente en la news card "50,000 conexiones". El equipo debe confirmar los números reales antes del deploy.
- **Riesgo**: En light-theme los glows podrían verse raros (colores saturados sobre fondo claro) → **Mitigación**: Opacidad al 50% en light-theme y colores pastel.
