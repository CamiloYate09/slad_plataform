# Change: Poner al día animations, dark-contrast-band y static-hardening tras retirar Splitting.js

## Por qué

El commit `1fb56c2` ("Títulos editoriales y bento de funcionalidades") retiró Splitting.js, la
animación letra a letra de los titulares y las escenas de los pilares de Funcionalidades. Tres
specs seguían describiendo ese comportamiento o se apoyaban en él.

## Qué cambia

### `animations`
- REMOVED "Value-Prop Heading Character Reveal" y "Variable Font Weight Bloom": ningún titular
  se anima por letras (ver "Tipografía Editorial" en `visual-theme`).
- MODIFIED "Reveal de Media Ligado a Scroll": solo `.value-prop-image`; `.features-item-image`
  ya no existe.
- MODIFIED "CSS Containment on Heavy Sections": refleja el CSS real (`contain: style paint`
  en `.numbered-features`, `.cta-section` y `.news`).

### `dark-contrast-band`
- REMOVED "Banda Oscura de Contraste Mid-Page" y ADDED "Banda de Contraste a Media Página": el
  selector `h2[data-splitting]` ya no existe, y la banda usa `--bg-dark-band`, que sigue al tema
  (#111 en oscuro, #efefef en claro) en lugar de ser siempre oscura.

### `static-hardening`
- MODIFIED "Content Security Policy via meta tag": los recursos legítimos son los propios
  (`'self'`) y Cloudflare Web Analytics; GSAP, Lenis, Splitting y Supabase ya no se cargan.

## Lo que NO cambia

- El resto de requisitos de las tres specs.
- Desfases previos que este cambio no toca: "Stats Section Entrance Animation" (habla de
  `.stats`/`.stat-item`) y "Subresource Integrity en todos los recursos CDN externos" (el beacon
  de Cloudflare no lleva `integrity`). Quedan para otro cambio.

## Impacto

- Specs: `animations`, `dark-contrast-band`, `static-hardening`. Sin cambios de código.
