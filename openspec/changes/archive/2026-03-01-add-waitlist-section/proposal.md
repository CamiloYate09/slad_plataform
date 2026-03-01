# Change: Waitlist Section — Lista de Espera con Contador en Vivo

## Why

CityStream aún no ha lanzado. La sección de stats actual muestra números aspiracionales (50K+ Usuarios, 100K+ Conexiones, 10K+ Eventos) que **no son reales**, lo que puede dañar la credibilidad ante early adopters que conocen el producto. Reemplazar esos números falsos por un **contador real de la lista de espera** convierte una debilidad en una fortaleza social: prueba social honesta que crece con el tiempo.

Además, el CTA actual ("Comenzar Ahora → #features") no captura ningún lead. Transformarlo en un **formulario de lista de espera** permite capturar emails de interesados antes del lanzamiento oficial.

## What Changes

### 1. Sección Stats → Waitlist Counter Bar
- Reemplazar los 4 contadores falsos por una barra de "ya somos X personas esperando" con el conteo real de la lista de espera obtenido desde Supabase
- Mantener el contador animado (count-up desde 0 al número real)
- Agregar un CTA secundario inline: "Únete tú también ↓" que hace scroll al formulario

### 2. Sección CTA → Formulario de Lista de Espera
- Transformar la CTA card en un formulario con:
  - Input de email con validación
  - Botón de submit con estado loading/success/error
  - Mensaje de confirmación post-submit
  - El copy cambia de "Comenzar Ahora" a "Unirme a la lista"
- El formulario envía el email a Supabase (INSERT-only con clave anon)
- Anchor `#waitlist` agregado al navbar o como enlace de scroll

### 3. Navbar — Enlace "Lista de espera"
- Agregar enlace `#waitlist` en el navbar desktop (reemplaza o se suma a "Contacto")

---

## Arquitectura de datos — Opciones para guardar los emails de forma segura

### Contexto
El sitio es estático (GitHub Pages). El backend en Go está en construcción. Necesitamos guardar emails **hoy**, de forma segura, sin exponer datos a terceros ni a atacantes que inspeccionen el código del sitio.

---

### Opción A — Supabase (RECOMENDADA) ★★★★★

**Qué es:** Base de datos PostgreSQL administrada con API REST automática y cliente JS oficial.

**Por qué es segura para un sitio estático:**

La clave `anon` que se expone en el JavaScript del frontend tiene **Row Level Security (RLS)** que tú configuras:

```sql
-- Solo permite INSERT desde el navegador. Nadie puede leer ni borrar.
CREATE POLICY "insert-only-anon"
  ON waitlist FOR INSERT
  TO anon
  WITH CHECK (true);
-- SELECT, UPDATE, DELETE quedan bloqueados para anon por defecto.
```

Esto significa: incluso si un hacker encuentra la clave `anon` en el código fuente, **solo puede agregar emails a la lista** — no puede leer los que ya existen, ni borrarlos, ni acceder a ninguna otra tabla. La `service_role` key (que sí lee todo) nunca sale del servidor.

**Ventajas:**
- 🔒 Seguridad real: anon key = INSERT-only
- 🆓 Free tier: 500 MB, 50,000 filas (suficiente para miles de registros)
- 🔄 Transición perfecta al Go backend: Supabase es Postgres puro — tu backend en Go se conecta con el driver estándar `pgx`
- 📊 Dashboard web para ver los emails registrados
- 🌍 Datos en tu región (US-East o EU)
- 📧 Se puede conectar a Resend o Postmark para enviar email de confirmación después

**Setup en ~10 minutos:**
1. Crear proyecto en supabase.com (gratis)
2. Crear tabla `waitlist` con columnas: `id`, `email`, `city`, `created_at`
3. Habilitar RLS + política INSERT-only
4. Copiar la `anon` key al JS del sitio

**Costo:** Gratis hasta escalar (Pro: $25/mes si creces mucho)

---

### Opción B — Formspree ★★★☆☆

**Qué es:** Servicio que recibe submissions de formularios HTML y los reenvía a tu email o panel web.

**Cómo funciona:**
```html
<form action="https://formspree.io/f/TU_FORM_ID" method="POST">
  <input type="email" name="email">
  <button type="submit">Unirme</button>
</form>
```

**Ventajas:**
- Zero código JS — HTML puro
- Gratis hasta 50 submissions/mes (plan básico)
- No expone ninguna clave en el cliente

**Desventajas:**
- 🚫 Free tier muy limitado (50/mes — se llena rápido si la landing funciona)
- 🚫 Los datos quedan en Formspree, no en tu control
- 🚫 No puedes consultar el conteo para el contador en vivo
- 🚫 Migrar al Go backend requiere rehacer todo

**Cuándo usarla:** Solo si necesitas algo funcionando en 5 minutos y no esperas más de 50 signups/mes.

---

### Opción C — Loops.so ★★★★☆

**Qué es:** Plataforma de email marketing para startups con API de subscribe.

**Por qué es segura:**
- La API key de Loops en modo "write-only" solo permite suscribir — no leer la lista

**Ventajas:**
- Gratis hasta 2,500 contactos
- Envía email de bienvenida automáticamente al suscribirse
- Panel web moderno para ver y gestionar la lista

**Desventajas:**
- Los datos quedan en Loops (dependencia externa)
- Migrar al Go backend agrega fricción
- Orientado a email marketing, no a base de datos de usuarios

---

### Decisión Recomendada

**Usar Supabase** porque:
1. Los datos son TUYOs (PostgreSQL que tú controlas)
2. Seguro por diseño (RLS insert-only)
3. El contador en vivo es posible (SELECT COUNT con una función pública)
4. Cuando el Go backend esté listo, solo cambias la clave — misma base de datos

---

## Afectados

- `index.html` — sección stats, sección CTA, navbar
- `static/css/style.css` — estilos de formulario, waitlist bar
- `static/js/main.js` — cliente Supabase (CDN), form submit, contador fetch
- `openspec/project.md` — añadir Supabase como dependencia externa

## No se toca

- Sección features, experiencias, value-prop, news
- Sistema de animaciones existente
- Video showcase
