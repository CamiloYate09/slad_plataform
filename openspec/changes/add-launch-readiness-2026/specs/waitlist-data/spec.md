## ADDED Requirements

### Requirement: Columnas de Referral en Tabla Waitlist
La tabla `waitlist` SHALL agregar las columnas `referral_code` (text UNIQUE, NOT NULL con default de 6 chars aleatorios), `referred_by` (text, nullable, FK soft a `waitlist.referral_code`) y `consent_accepted_at` (timestamptz, nullable inicialmente para retro-compatibilidad). Las columnas son **additive** y no rompen el flow actual.

#### Scenario: Migracion en BD existente
- **WHEN** la migracion SQL corre en Supabase con datos existentes
- **THEN** los emails ya inscritos reciben `referral_code` generado en backfill
- **AND** `referred_by` queda NULL para todos los registros pre-existentes
- **AND** ningun INSERT existente del cliente se rompe

#### Scenario: Generacion automatica de referral_code
- **WHEN** se hace INSERT de un nuevo email sin especificar `referral_code`
- **THEN** PostgreSQL genera un slug de 6 caracteres alfanumericos unico
- **AND** si hay colision (UNIQUE violation), el INSERT reintenta con un nuevo random hasta exito

### Requirement: RPC get_waitlist_position
Supabase SHALL exponer una funcion RPC `get_waitlist_position(p_email text)` accesible por el rol `anon`, que devuelve la posicion del email en la lista (ordenada por `created_at` con bonus por referidos), el total de inscritos, el referral_code del propio email, y el numero de referidos exitosos.

#### Scenario: Email registrado consulta su posicion
- **WHEN** el cliente llama `supabase.rpc('get_waitlist_position', { p_email: 'a@b.co' })`
- **THEN** recibe `{ position: int, total: int, referral_code: text, referred_count: int }`
- **AND** ningun otro email es expuesto en la respuesta

#### Scenario: Email no existente
- **WHEN** se consulta con un email que no esta en waitlist
- **THEN** la RPC devuelve `null` o un error que el cliente interpreta como "no registrado"

#### Scenario: Bonus por referidos
- **WHEN** un email tiene 5 referidos confirmados (5 filas con `referred_by = mi_codigo`)
- **THEN** la posicion calculada resta `5 * 10 = 50` posiciones de la posicion bruta por created_at
- **AND** el calculo nunca devuelve posicion < 1

### Requirement: RPC register_waitlist (reemplaza INSERT directo)
Supabase SHALL exponer una funcion RPC `register_waitlist(p_email text, p_referred_by text)` accesible por `anon` que valida formato de email, valida que `p_referred_by` existe (si no es NULL), inserta el registro y devuelve la misma estructura que `get_waitlist_position`. El INSERT directo desde el cliente se deshabilita via RLS para canalizar todo trafico por esta RPC.

#### Scenario: Registro con referido valido
- **WHEN** se llama `register_waitlist('nuevo@x.co', 'ab12cd')` con un codigo existente
- **THEN** la fila se inserta con `referred_by = 'ab12cd'`
- **AND** devuelve la posicion calculada con bonus aplicable al referrer

#### Scenario: Codigo de referido invalido
- **WHEN** se llama con `p_referred_by = 'xxxxxx'` (codigo inexistente)
- **THEN** la RPC ignora el campo (lo trata como NULL) y registra al usuario sin referrer
- **AND** el cliente NO recibe error visible (degradacion silenciosa)

#### Scenario: Email duplicado
- **WHEN** se intenta registrar un email que ya existe
- **THEN** la RPC devuelve la misma estructura que get_waitlist_position para ese email
- **AND** el cliente interpreta como "ya estabas en la lista"

### Requirement: Tabla push_subs para Web Push Subscriptions
Supabase SHALL crear una tabla `push_subs(id uuid pk, email text fk waitlist.email, endpoint text NOT NULL UNIQUE, p256dh text NOT NULL, auth text NOT NULL, created_at timestamptz default now())` con RLS que solo permite ejecutar la RPC de subscribe a `anon`, sin SELECT directo.

#### Scenario: Suscripcion de push exitosa
- **WHEN** el cliente llama `subscribe_push(email, endpoint, p256dh, auth)`
- **THEN** la fila se inserta vinculada al email del waitlist
- **AND** un endpoint duplicado actualiza la fila (upsert por endpoint UNIQUE)

#### Scenario: Cliente intenta SELECT
- **WHEN** un atacante intenta `supabase.from('push_subs').select('*')`
- **THEN** RLS rechaza la operacion
- **AND** ningun endpoint ni token es expuesto

## MODIFIED Requirements

### Requirement: Integración Supabase con INSERT-Only Anon Key
El sitio estático SHALL conectarse a Supabase usando la `anon` key pública, con Row Level Security configurada para permitir únicamente la ejecución de las RPC `register_waitlist`, `get_waitlist_position`, `get_waitlist_count`, `subscribe_push`. El INSERT directo a la tabla `waitlist` se deshabilita; el cliente DEBE usar la RPC `register_waitlist` para registrar emails.

#### Scenario: Insert via RPC register_waitlist
- **WHEN** el formulario hace submit con email válido y (opcionalmente) un referral code
- **THEN** el JS llama `supabase.rpc('register_waitlist', { p_email, p_referred_by })`
- **AND** Supabase ejecuta la RPC, valida formato y referrer, inserta la fila y devuelve la posicion

#### Scenario: Intento de INSERT directo bloqueado
- **WHEN** un atacante intenta `supabase.from('waitlist').insert(...)` directamente
- **THEN** la RLS rechaza la operacion porque INSERT directo ya no es permitido para anon

#### Scenario: Intento de lectura bloqueado
- **WHEN** cualquier código del cliente intenta hacer SELECT en `waitlist` o `push_subs`
- **THEN** Supabase rechaza la operación con error de permisos
- **AND** ningún email es expuesto al cliente

#### Scenario: Email duplicado
- **WHEN** la RPC `register_waitlist` detecta UNIQUE violation
- **THEN** devuelve la posicion existente del email (sin lanzar error 23505)
- **AND** el cliente lo interpreta como "ya estabas en la lista"
