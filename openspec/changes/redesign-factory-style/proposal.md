# Change: Rediseño visual inspirado en factory.ai conservando paleta CityStream

## Why
El sitio actual de CityStream usa un fondo azul oscuro (`rgb(5, 6, 45)`) con gradientes púrpura/cyan. El usuario quiere adoptar la estética premium de factory.ai — fondo negro puro, tipografía geométrica moderna, layout espacioso con grid de 12 columnas, animaciones suaves de reveal, header transparente, footer tipo card con bordes redondeados — pero **conservando íntegramente** los colores actuales de CityStream (gradiente `#af40ff → #5b42f3 → #00ddeb`, acentos cyan, blue, green, orange) como acentos sobre la nueva base negra.

## What Changes
- **Fondo**: De `rgb(5, 6, 45)` (azul oscuro) a negro puro (`#000000` / `#0a0a0a`) como base
- **Tipografía**: De Public Sans a Inter (geométrica moderna, similar a factory.ai), con jerarquía más marcada (h1 más grandes, body más fino)
- **Header/Navbar**: Transparente sobre hero, se solidifica al hacer scroll con blur. Logo izquierda, nav derecha. Efecto underline-reveal en hover
- **Layout**: Grid de 12 columnas con spacing generoso (`px-4` mobile, `px-9` desktop). Max-width 1440px
- **Cards**: Fondo semi-transparente con bordes sutiles, sin el borde gradient actual. Hover eleva con sombra sutil
- **Footer**: Estilo card con bordes redondeados (`rounded-3xl`), fondo secundario oscuro, layout multi-columna. Min-height generoso
- **Animaciones**: Fade-in + translateY suaves al scroll con stagger. Hover underline-reveal en links. Transiciones de color suaves (200ms)
- **Botones**: Mantienen gradiente CityStream pero con bordes más pill (border-radius mayor). CTAs más prominentes
- **Body border gradient**: Se mantiene el borde de 3px con gradiente CityStream como signature visual
- **Gradient text**: Se mantiene `.gradient-text` con los mismos colores en h1/h2
- **Decorative cubes**: Se refinan con opacidad más baja para encajar con estética minimalista negra

## Impact
- Affected specs: Nuevo (no hay specs existentes publicadas)
- Affected code:
  - `static/css/style.css` — Reescritura significativa de variables, fondos, tipografía, layout grid, cards, navbar, footer
  - `index.html` — Ajustes menores en estructura (clases CSS, posiblemente agregar wrapper grid)
  - `static/js/main.js` — Refinar animaciones de scroll, agregar efecto navbar transparente→sólido
