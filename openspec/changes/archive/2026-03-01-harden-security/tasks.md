## Prerequisito — Cloudflare Dashboard (tú lo haces)

- [ ] CF.1 Activar el dominio `citystream.co` en Cloudflare si no está ya activo (ya usas CF Analytics, probablemente ya está)
- [ ] CF.2 En Cloudflare → **Rules → Transform Rules → Modify Response Headers**: añadir los 7 headers de `design.md`
- [ ] CF.3 Verificar en https://securityheaders.com → citystream.co que aparecen los headers
- [ ] CF.4 En Cloudflare → **Turnstile** → crear sitio `citystream.co` → copiar el **Site Key** público
      → Luego reemplaza `REEMPLAZA_CON_TU_SITE_KEY` en `index.html` con el valor real

---

## 1. HTML — Subresource Integrity en scripts CDN

- [x] 1.1 Añadir `integrity` y `crossorigin="anonymous"` al script de Supabase JS
- [x] 1.2 Añadir `integrity` y `crossorigin="anonymous"` al script de Splitting.js
- [x] 1.3 Añadir `integrity` y `crossorigin="anonymous"` al script de Lenis
- [x] 1.4 Añadir `integrity` y `crossorigin="anonymous"` al script de GSAP
- [x] 1.5 Añadir `integrity` y `crossorigin="anonymous"` al script de ScrollTrigger
- [x] 1.6 Añadir `integrity` y `crossorigin="anonymous"` al script de tsParticles
- [x] 1.7 Añadir `integrity` y `crossorigin="anonymous"` al link de RemixIcon CSS
- [ ] 1.8 Verificar que todos los recursos cargan sin errores SRI en DevTools console
      → Pendiente: abrir DevTools → Console en producción y confirmar que no hay errores "Subresource Integrity"

## 2. HTML — Meta tags de seguridad

- [x] 2.1 Añadir `<meta http-equiv="Content-Security-Policy" content="...">` con la CSP del `design.md`
- [x] 2.2 Añadir `<meta name="referrer" content="strict-origin-when-cross-origin">`
- [ ] 2.3 Verificar que la página carga sin violaciones CSP en DevTools (consola)
      → Pendiente: abrir DevTools → Console y confirmar ausencia de errores "Content Security Policy"

## 3. HTML — Cloudflare Turnstile en formulario de waitlist

- [x] 3.1 Añadir el script de Turnstile antes del cierre de `</head>`:
  `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`
- [x] 3.2 Añadir el widget `<div class="cf-turnstile" data-sitekey="..." data-size="invisible"></div>` dentro del `.wl-form`
- [ ] 3.3 Verificar que el widget invisible se inicializa en la consola sin errores
      → Pendiente: requiere Site Key real de CF.4; con `REEMPLAZA_CON_TU_SITE_KEY` no se inicializa

## 4. JS — Integración Turnstile en submit

- [x] 4.1 En el handler de submit, leer `document.querySelector('[name="cf-turnstile-response"]')?.value`
- [x] 4.2 Si el token está vacío y Turnstile está cargado → mostrar error "Verifica que no eres un bot"
- [x] 4.3 Incluir el token en el payload enviado a Supabase (campo `turnstile_token`) para futura validación server-side en el backend Go
- [x] 4.4 Degradación: si Turnstile no está cargado (`window.turnstile === undefined`), el submit procede sin token

## 5. Validación

- [ ] 5.1 Abrir DevTools → Network → verificar que scripts CDN cargan con código 200 (no bloqueados por SRI)
- [ ] 5.2 Abrir DevTools → Console → verificar que no hay errores CSP ni SRI
- [ ] 5.3 Probar submit del formulario en producción con email válido → debe funcionar normalmente
- [ ] 5.4 Verificar https://securityheaders.com → citystream.co después de configurar Cloudflare (CF.2)
- [ ] 5.5 Verificar https://observatory.mozilla.org → citystream.co (objetivo: calificación B+ o mejor)
