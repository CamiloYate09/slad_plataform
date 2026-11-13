# Change: Specs sin GSAP, Lenis ni la lista de espera del sitio

## Por qué

El sitio dejó GSAP, ScrollTrigger y Lenis ("Movimiento sin GSAP ni ScrollTrigger") y quitó la
lista de espera del HTML en mayo (`8bfdb9e`). Cinco specs seguían describiendo ese sitio:

- `layout-animations`: retícula de 12 columnas, revelados y parallax con GSAP, scroll con Lenis.
- `header-footer`: barra controlada con ScrollTrigger, enlaces y CTAs que ya no son esos.
- `navbar-active-section`: enlace "Inicio" activo, umbral de 0.3 y compatibilidad con Lenis.
- `waitlist-ui`: contador, formulario y enlace de lista de espera que ya no existen.
- `waitlist-data`: el sitio insertando en `waitlist` con la anon key, cuando hoy no lleva
  credenciales de Supabase y la migración `20261107_lock_waitlist_rpcs.sql` cerró las RPC a `anon`.

## Qué cambia

### `layout-animations`
- REMOVED "Generous Spacing and 12-Column Grid", ADDED "Espaciado y Ancho de la Página".
- REMOVED "Smooth Scroll Reveal Animations", ADDED "Revelado al Hacer Scroll" (IntersectionObserver
  + transiciones CSS; entrada del hero en CSS).
- REMOVED "Lenis Smooth Scroll": scroll nativo.
- REMOVED "Subtle Parallax Effects", ADDED "Parallax de Fotos de Ciudad" (scroll-driven animations).

### `header-footer`
- MODIFIED "Transparent-to-Solid Navbar" y "Card-Style Rounded Footer": estructura, estados y
  medidas actuales.

### `navbar-active-section`
- REMOVED "Indicador de Sección Activa en Navbar", ADDED "Enlace de la Sección Visible".

### `waitlist-ui`
- REMOVED sus tres requisitos: la capacidad se retira.

### `waitlist-data`
- REMOVED "Integración Supabase con INSERT-Only Anon Key" y "Configuración segura de variables en el
  cliente"; ADDED "Tabla waitlist Sin Acceso Directo" y "RPC de Waitlist y Push Solo para el Backend".
- MODIFIED "Función RPC Pública de Conteo" y "Deduplicación de emails": sin el formulario del sitio.

## Lo que NO cambia

- Código y base de datos: el sitio y las migraciones ya están así.
- "Link Hover Underline Reveal", "Card Hover Effects" (`layout-animations`) y "Social Icons Refined
  Style" (`header-footer`).

## Impacto

- Specs: `layout-animations`, `header-footer`, `navbar-active-section`, `waitlist-data`;
  `waitlist-ui` se retira.
