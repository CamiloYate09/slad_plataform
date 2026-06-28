# supabase/

Migraciones SQL para Supabase de CityStream.

## Como ejecutar una migracion

### Opcion A — SQL Editor del dashboard
1. Abre [supabase.com/dashboard](https://supabase.com/dashboard) → tu proyecto → SQL Editor
2. Copia el contenido del archivo `.sql` mas reciente
3. Ejecutalo. Es idempotente: re-ejecutar no causa danos.

### Opcion B — Supabase CLI
```bash
# Instalar (una vez):
brew install supabase/tap/supabase

# Linkear el proyecto:
supabase link --project-ref zeqnlntgimxtjuffoilg

# Aplicar migraciones nuevas:
supabase db push
```

## Migraciones

| Archivo | Fase | Descripcion |
|---|---|---|
| `20260527_add_waitlist_referral.sql` | 4 | Sistema de referral: columnas + RPCs `register_waitlist` y `get_waitlist_position` |
| `20260527_add_push_subs.sql`         | 5 | Tabla `push_subs` + RPC `subscribe_push` para Web Push notifications |

## Configurar VAPID keys para Web Push (Fase 5)

Las VAPID keys identifican tu servidor ante los push services (Mozilla, Google, Apple). **Solo la public key va al frontend.**

### Generar el par (una vez)

```bash
# Opcion A — web-push CLI (Node)
npx --yes web-push generate-vapid-keys

# Opcion B — openssl
openssl ecparam -name prime256v1 -genkey -noout -out vapid-private.pem
openssl ec -in vapid-private.pem -pubout -out vapid-public.pem
```

### Almacenar

- **Public key**: pegarla en `static/js/main.js` en la constante `VAPID_PUBLIC_KEY` (es publica, OK exponer)
- **Private key**: guardar en Supabase Vault (Dashboard > Project Settings > Vault), llave `vapid_private_key`. **NUNCA commitear ni exponer al cliente.**

La private key solo se usa cuando un Edge Function envie pushes a los endpoints almacenados en `push_subs`. Eso es una fase posterior, fuera de Fase 5.

## Frontend compatibility

El frontend cliente (`static/js/main.js`) detecta automaticamente si la RPC `register_waitlist` esta disponible. **Si la migracion aun no corre**, cae al INSERT directo (comportamiento anterior). Esto permite:

- Mergear y desplegar el frontend sin romper el sitio mientras la migracion no se aplica
- Ejecutar la migracion despues sin coordinacion exacta con el deploy

Tras aplicar la migracion, la pantalla post-submit (posicion + referral) se activa automaticamente.

## Rollback

La migracion `20260527_add_waitlist_referral.sql` es additive only:
- Columnas nuevas son nullable (excepto `referral_code` que es NOT NULL despues del backfill)
- RPCs nuevas; el INSERT directo se sigue bloqueando

Para revertir parcialmente (sin perder datos):
```sql
DROP FUNCTION IF EXISTS public.register_waitlist(text, text);
DROP FUNCTION IF EXISTS public.get_waitlist_position(text);
DROP FUNCTION IF EXISTS public.gen_ref_code();
-- Para devolver INSERT directo a anon:
CREATE POLICY waitlist_insert_anon ON public.waitlist
  FOR INSERT TO anon WITH CHECK (true);
```

Las columnas (`referral_code`, `referred_by`, `consent_accepted_at`) pueden quedarse — no rompen el INSERT directo.
