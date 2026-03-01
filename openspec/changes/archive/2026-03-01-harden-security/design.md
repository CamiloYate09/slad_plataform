# Design — Hardening de Seguridad

## Hashes SRI calculados (SHA-384)

Estos hashes fueron calculados descargando cada archivo en su versión exacta actual. Si se actualiza la versión de cualquier librería, los hashes deben recalcularse.

```
supabase-js@2/dist/umd/supabase.min.js
  sha384-Sm2s7OXxsAMTyJ4iIyRBgVpeGUvMPk2lRQnnZhE78Wej7oggIoolKt+SCt0XJbUB

splitting/dist/splitting.min.js
  sha384-QgxPWXpRukl1Nd0WP/PR30fzuu+zxlhdjS9roCVo3887QzWmGyhFMfC+CKM3KcZT

lenis@1.1.18/dist/lenis.min.js
  sha384-tKsJDT6PlUI0pSBt9/sBKJluKgA19/a6mBrDsZaXotLB4ZYfMGM6xt6/WgGpYhTm

gsap/3.12.5/gsap.min.js
  sha384-g4NTh/Iv5PPU4xPyhEWqPcwtNXOvdaDI8LLnyYfyNZOjKJeYQyjzQ9X5275eBjpt

gsap/3.12.5/ScrollTrigger.min.js
  sha384-Z3REaz79l2IaAZqJsSABtTbhjgOUYyV3p90XNnAPCSHg3EMTz1fouunq9WZRtj3d

tsparticles@2.12.0/tsparticles.bundle.min.js
  sha384-gZSNMuUgSbqcltOBBRNXCH+szg+2C69ISFyCk2w+xsZc0iFU+bIVPfYPmLwLtNzz

remixicon@4.2.0/fonts/remixicon.css
  sha384-6FSSi597BTd6QcnsBNoLclRKxTOyyYqkaucRjFgCNr8wHVCp0COLClSPY4Vy/bjh
```

Formato a usar en HTML:
```html
<script
  src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"
  integrity="sha384-Sm2s7OXxsAMTyJ4iIyRBgVpeGUvMPk2lRQnnZhE78Wej7oggIoolKt+SCt0XJbUB"
  crossorigin="anonymous"
></script>
```

---

## Content Security Policy

La CSP debe incluir todos los orígenes de los recursos actualmente cargados. Si se añade un recurso nuevo y no está en la CSP, el navegador lo bloquea.

```
Content-Security-Policy:
  default-src 'none';
  script-src 'self'
    'unsafe-inline'
    https://cdn.jsdelivr.net
    https://unpkg.com
    https://cdnjs.cloudflare.com
    https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/
    https://static.cloudflareinsights.com
    https://challenges.cloudflare.com;
  style-src 'self'
    'unsafe-inline'
    https://fonts.googleapis.com
    https://cdn.jsdelivr.net;
  font-src 'self'
    https://fonts.gstatic.com
    https://cdn.jsdelivr.net;
  img-src 'self'
    data:
    https://zeqnlntgimxtjuffoilg.supabase.co;
  connect-src 'self'
    https://zeqnlntgimxtjuffoilg.supabase.co
    https://cloudflareinsights.com;
  frame-src
    https://challenges.cloudflare.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

**Nota `unsafe-inline`:** Los scripts de GSAP, tsParticles y el JS propio usan `addEventListener` y no estilos inline, pero el `main.js` usa `el.style.setProperty(...)` para animaciones. Para un sitio estático sin nonce, `unsafe-inline` en scripts es necesario o se rompen los CDN que inyectan estilos. En el header HTTP de Cloudflare la CSP es más efectiva que en meta tag.

---

## Cloudflare Transform Rules — Instrucciones paso a paso

1. Ir a **Cloudflare Dashboard** → seleccionar dominio `citystream.co`
2. **Security → Headers** (o **Rules → Transform Rules → Modify Response Headers**)
3. Crear una regla con condición: `hostname eq citystream.co` (o `always`)
4. Añadir los siguientes headers de respuesta (Set):

```
X-Frame-Options                  DENY
X-Content-Type-Options           nosniff
Strict-Transport-Security        max-age=31536000; includeSubDomains; preload
Referrer-Policy                  strict-origin-when-cross-origin
Permissions-Policy               geolocation=(), camera=(), microphone=(), payment=(), usb=()
Cross-Origin-Opener-Policy       same-origin
Cross-Origin-Resource-Policy     same-origin
```

5. Guardar y hacer deploy. Verificar en https://securityheaders.com con tu dominio.

---

## Cloudflare Turnstile — Setup

1. Ir a **Cloudflare Dashboard** → **Turnstile** → **Add Site**
2. Tipo de widget: **Managed** (invisible, se activa solo si detecta bot)
3. Dominio: `citystream.co`
4. Copiar el **Site Key** (público, va en el HTML)
5. Copiar el **Secret Key** (privado, va en el backend Go o Supabase Edge Function)

**Flujo de validación:**
```
Usuario llena el formulario
       ↓
Turnstile genera token invisible cf-turnstile-response
       ↓
JS incluye el token en el body del INSERT a Supabase
       ↓
[FUTURO — Go backend] valida el token contra api.challenges.cloudflare.com
       ↓
Si válido → INSERT procede | Si bot → rechaza
```

**Implementación inicial (sin backend):** El widget se añade al HTML y genera el token, pero la validación server-side se pospone hasta que el backend Go esté listo. La presencia del widget ya disuade a bots básicos y registra intentos en el dashboard de Turnstile.

---

## Política de actualización de SRI

Cuando se actualiza una librería:
```bash
# Recalcular hash para un archivo
curl -s URL_DEL_ARCHIVO | openssl dgst -sha384 -binary | openssl base64 -A
# Prefijo: sha384-[hash]
```

Se debe actualizar tanto el `src` (versión) como el atributo `integrity` en el mismo commit.
