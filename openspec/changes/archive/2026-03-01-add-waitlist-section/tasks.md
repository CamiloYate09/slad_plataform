## Prerequisito — Setup Supabase (tú lo haces, no es código)

- [x] P.1 Crear proyecto en supabase.com (gratis)
- [x] P.2 Ejecutar el SQL de setup:
  ```sql
  -- Tabla
  CREATE TABLE waitlist (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
  ALTER TABLE waitlist ADD CONSTRAINT waitlist_email_unique UNIQUE (email);

  -- RLS
  ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "anon-insert-only" ON waitlist
    FOR INSERT TO anon WITH CHECK (true);

  -- Función de conteo pública
  CREATE OR REPLACE FUNCTION public.get_waitlist_count()
  RETURNS bigint LANGUAGE sql SECURITY DEFINER AS $$
    SELECT COUNT(*) FROM waitlist;
  $$;
  GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO anon;
  ```
- [x] P.3 Copiar `Project URL` y `anon` key desde Settings → API y reemplazar las constantes en `main.js`

---

## 1. HTML — Reemplazar Stats por Waitlist Counter Bar

- [x] 1.1 Eliminar las 4 `.stat-item` de la sección `.stats`
- [x] 1.2 Reemplazar contenido con `.waitlist-bar`: contador `#wl-count` + label + CTA de scroll
- [x] 1.3 Cambiar `aria-label` de la sección a "Lista de espera"
- [x] 1.4 Añadir `id="waitlist"` a la sección (para scroll anchor)

## 2. HTML — Transformar CTA Card en Formulario de Waitlist

- [x] 2.1 Reemplazar el `<a class="cta-btn">Comenzar Ahora</a>` por `<form class="wl-form">`
- [x] 2.2 Añadir `<input type="email" id="wl-email">` con `placeholder` y `aria-label`
- [x] 2.3 Añadir `<button type="submit" class="cta-btn wl-submit-btn">` con spans para texto/loading dots
- [x] 2.4 Añadir `<p id="wl-status">` con `aria-live="polite"` para todos los estados
- [x] 2.5 Actualizar copy del card: "Únete a los primeros" / "Unirme" + nota de privacidad

## 3. HTML — Navbar

- [x] 3.1 Añadir `<li><a href="#waitlist">Lista de espera</a></li>` en navbar (`.nav-links`)

## 4. HTML — Script Supabase CDN

- [x] 4.1 Añadir script de Supabase JS v2 UMD antes de `main.js`

## 5. CSS — Waitlist Bar + Formulario

- [x] 5.1 Reemplazar `.stats-grid` / `.stat-item` / `.stat-number` / `.stat-label` con `.waitlist-bar` flex layout
- [x] 5.2 Estilizar `.waitlist-bar`: flex centrado, `.waitlist-bar-divider` vertical, responsive columna en mobile
- [x] 5.3 Estilizar `.waitlist-count-number`: gradient igual al antiguo `.stat-number`, `clamp` de tamaño
- [x] 5.4 Añadir `.wl-input`, `.wl-input-group` (flex inline), `.wl-submit-btn`
- [x] 5.5 Estilizar `.wl-status--success` (verde), `.wl-status--error` (rojo), `.wl-status--info` (cyan)
- [x] 5.6 Añadir `.wl-btn-loading` con `.wl-dot` animation (pulse dots)
- [x] 5.7 Light theme overrides: `.wl-input`, `.wl-privacy`, estados de color
- [x] 5.8 `.sr-only` para label accesible del input, `@keyframes wl-bounce` para flecha

## 6. JS — Integración Supabase + Formulario

- [x] 6.1 Constantes `SUPABASE_URL` y `SUPABASE_ANON` con valores placeholder claros
- [x] 6.2 Función `animateWaitlistCount(target)`: GSAP count-up con `toLocaleString('es-CO')`
- [x] 6.3 Función `fetchWaitlistCount()`: llama `supabase.rpc('get_waitlist_count')`, falla silenciosa
- [x] 6.4 Llamar `fetchWaitlistCount()` en top-level (DOMContentLoaded implícito por script deferido)
- [x] 6.5 Listener `submit` en `.wl-form`: validación, loading, insert, manejo de errores (23505, red), finally loading off
- [x] 6.6 Degradación: `supabaseClient === null` → mensaje con email de contacto

## 7. Validación

- [x] 7.1 INSERT exitoso → curl retornó HTTP 201, conteo pasó de 0 → 1 — VERIFICADO via API
- [x] 7.2 INSERT duplicado → Supabase retornó `{"code":"23505",...}` — manejado por JS — VERIFICADO via API
- [x] 7.3 Email inválido → "Por favor ingresa un correo válido." en rojo — VERIFICADO via DOM test
- [x] 7.4 Loading state — dots animation en CSS, spinner visible durante async fetch
- [x] 7.5 SELECT bloqueado por RLS → retorna `[]` vacío al consultar con anon key — VERIFICADO via API
- [x] 7.6 Supabase no configurado → fallback con email de contacto — VERIFICADO via DOM test
- [x] 7.7 Accesibilidad: `aria-live="polite"` en `#wl-status`, `aria-label` en submit button, `for`/`id` en label/input
