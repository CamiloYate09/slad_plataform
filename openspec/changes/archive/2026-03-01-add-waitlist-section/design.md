# Design — Waitlist Section

## Flujo de datos

```
Usuario escribe email
        ↓
JS valida formato (cliente)
        ↓
supabase.from('waitlist').insert({ email, city: null })
        ↓  [anon key — INSERT only via RLS]
Supabase PostgreSQL
        ↓
Respuesta OK → mostrar mensaje de éxito
Respuesta Error (email duplicado, rate limit) → mostrar error amigable
```

## Contador en vivo

Supabase expone una función RPC pública para contar registros sin exponer los emails:

```sql
-- Función pública para devolver solo el conteo
CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*) FROM waitlist;
$$;
-- Grant de ejecución al rol anon
GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO anon;
```

El JS llama `supabase.rpc('get_waitlist_count')` — retorna solo un número, sin exponer ningún email.

## Seguridad — modelo de permisos

| Operación | Rol `anon` (front) | Rol `service_role` (Go backend) |
|-----------|-------------------|--------------------------------|
| INSERT email | ✅ | ✅ |
| SELECT emails | ❌ bloqueado por RLS | ✅ |
| DELETE | ❌ | ✅ |
| UPDATE | ❌ | ✅ |

La `anon` key visible en el JS solo puede hacer INSERT. El atacante que la encuentre no gana nada útil.

## Protección anti-spam

Opciones (por orden de complejidad):
1. **Supabase rate limiting** — limitar INSERTs por IP desde el dashboard (no requiere código)
2. **Email validation** — validar formato antes de enviar (ya en el cliente)
3. **Unique constraint** — `UNIQUE(email)` en la tabla impide duplicados (Supabase devuelve error que el JS captura)
4. **Cloudflare Turnstile** (futuro) — CAPTCHA invisible, gratuito, privacidad-first

## Estructura HTML del formulario

```html
<section class="waitlist-section" id="waitlist">
  <div class="waitlist-bar">
    <!-- Reemplaza .stats -->
    <span class="waitlist-count"><span id="wl-count">0</span> personas ya en la lista</span>
    <a href="#waitlist" class="waitlist-scroll-cta">Únete tú también ↓</a>
  </div>

  <div class="cta-card">
    <!-- Form reemplaza el CTA link -->
    <form id="waitlist-form" novalidate>
      <input type="email" id="wl-email" placeholder="tu@email.com" required>
      <button type="submit" class="cta-btn">
        <span class="wl-btn-text">Unirme a la lista</span>
        <span class="wl-btn-loading" hidden>...</span>
      </button>
    </form>
    <p id="wl-success" hidden>¡Ya estás en la lista! Te avisaremos cuando lancemos.</p>
    <p id="wl-error" hidden>Algo salió mal. Intenta de nuevo.</p>
  </div>
</section>
```

## Transición al Go backend

Cuando el backend Go esté listo:
- Cambiar el `supabase.from('waitlist').insert()` por un `fetch('/api/waitlist', { method: 'POST', body: ... })`
- El Go backend recibe el email, lo valida, y lo inserta en Supabase via pgx (misma base de datos)
- O migran los datos a su propia base de datos Postgres — export CSV desde Supabase en 1 click
- La clave `anon` de Supabase se puede revocar o restringir aún más una vez el backend esté activo

## Supabase JS SDK

Usar el CDN oficial (sin build tools):
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
```
Inicialización:
```js
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```
