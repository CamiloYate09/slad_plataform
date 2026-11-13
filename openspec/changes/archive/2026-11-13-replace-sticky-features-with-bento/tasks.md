# Tasks — replace-sticky-features-with-bento

## 1. Bento
- [x] 1.1 Marcado del bento en `#features`: cinco `article.bento-card` con `.bento-ui` (`aria-hidden`) y `.bento-copy` (`h3` + `p`)
- [x] 1.2 Estilos `.bento*` en `style.css` con los tokens del tema; una columna por debajo de 860px
- [x] 1.3 Revelado al hacer scroll de las tarjetas con `reveal('.bento-card', { trigger: '.bento', stagger: 0.08 })`

## 2. Retirar el sticky scroll
- [x] 2.1 Fuera el marcado `.features-sticky-wrap`, `.features-nav` y `.features-item`
- [x] 2.2 Fuera su CSS (incluido el bloque responsive de 1024px y el media reveal de `.features-item-demo`) y su JS en `main.js`
- [x] 2.3 Fuera las escenas de pilares de `app-demos/`; recompilado `static/js/app-demos/`
- [x] 2.4 El paso 2 del tour apunta a `#features .section-header`

## 3. Verificación
- [x] 3.1 `scripts/critical-css.sh` regenera `style.min.css` y el CSS crítico
- [x] 3.2 `scripts/check-theme-wiring.sh` → "theme wiring OK"
- [x] 3.3 `scripts/contrast-audit.js` en claro y oscuro sin fallos en el bento
- [x] 3.4 Chrome: bento, hero y tour sin errores de consola en los dos temas
- [ ] 3.5 Revisión visual a 390px de ancho (pendiente: no se pudo redimensionar la ventana)
