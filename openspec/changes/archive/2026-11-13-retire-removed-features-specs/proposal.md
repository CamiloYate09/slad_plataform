# Change: Retirar specs de piezas que ya no existen y poner al día textura y CTA

## Por qué

Revisión de las specs que seguían con el `Purpose` en "TBD":

- `hero-particles`: el hero no tiene partículas (tsParticles no se carga en ninguna página).
- `video-embed`: la sección `.video-showcase` y su vídeo se quitaron (`84c86bc`).
- `bot-protection`: Turnstile protegía el formulario de lista de espera, que se quitó en `8bfdb9e`;
  ninguna página carga Turnstile.
- `background-texture`: la textura existe, pero como `div.bg-texture` y con otros valores.
- `cta-dark-card`: la tarjeta existe, pero ahora lleva la captura de correo y otras medidas.
- `page-structure` remitía a una spec `audience-personas` que no existe.

## Qué cambia

- REMOVED todos los requisitos de `hero-particles`, `video-embed` y `bot-protection`: las tres
  capacidades se retiran.
- MODIFIED `background-texture` → "Textura Diagonal de Fondo".
- MODIFIED `cta-dark-card` → "CTA Section — Tarjeta Oscura Pre-Footer".
- MODIFIED `page-structure` → "Factory.ai Section Ordering": sin la referencia a `audience-personas`.

## Lo que NO cambia

- Código: el sitio ya está así.
- El formulario de `/registro.html` no lleva protección contra bots en el navegador; si hace falta,
  es una decisión aparte (en el API o con un nuevo widget).

## Impacto

- Specs: se retiran `hero-particles`, `video-embed` y `bot-protection`; se actualizan
  `background-texture`, `cta-dark-card` y `page-structure`.
