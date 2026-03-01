# waitlist-data Specification

## Purpose
TBD - created by archiving change add-waitlist-section. Update Purpose after archive.
## Requirements
### Requirement: Integración Supabase con INSERT-Only Anon Key
El sitio estático SHALL conectarse a Supabase usando la `anon` key pública, con Row Level Security configurada para permitir únicamente operaciones INSERT en la tabla `waitlist`. Ningún email puede ser leído, modificado o eliminado desde el cliente.

#### Scenario: Insert de email nuevo
- **WHEN** el formulario hace submit con email válido
- **THEN** el JS llama `supabase.from('waitlist').insert({ email })`
- **AND** Supabase acepta el INSERT porque la política RLS de anon lo permite
- **AND** la respuesta indica éxito sin devolver filas de la tabla

#### Scenario: Intento de lectura bloqueado
- **WHEN** cualquier código del cliente intenta hacer SELECT en la tabla waitlist
- **THEN** Supabase rechaza la operación con error de permisos
- **AND** ningún email es expuesto al cliente

#### Scenario: Email duplicado
- **WHEN** el INSERT falla por UNIQUE constraint en el campo email
- **THEN** Supabase devuelve error con código `23505`
- **AND** el JS interpreta el error como "email ya registrado" y muestra mensaje amigable

---

### Requirement: Función RPC Pública de Conteo
Supabase SHALL exponer una función RPC `get_waitlist_count()` accesible por el rol `anon` que devuelve únicamente el conteo total de filas, sin exponer ningún email ni metadato individual.

#### Scenario: Petición de conteo desde el cliente
- **WHEN** la página carga y llama `supabase.rpc('get_waitlist_count')`
- **THEN** recibe un entero con el total de inscritos
- **AND** ningún email ni dato personal es incluido en la respuesta

---

### Requirement: Deduplicación de emails
La tabla `waitlist` SHALL tener un UNIQUE constraint en el campo `email` para prevenir registros duplicados.

#### Scenario: Registro duplicado detectado en BD
- **WHEN** se intenta insertar un email que ya existe
- **THEN** Supabase devuelve error PostgreSQL code `23505`
- **AND** el usuario recibe feedback positivo (ya estaba registrado)

---

### Requirement: Configuración segura de variables en el cliente
La `anon` key y la URL de Supabase SHALL ser las únicas credenciales presentes en el código del cliente. La `service_role` key NEVER debe aparecer en ningún archivo de `static/`.

#### Scenario: Inspección del código fuente
- **WHEN** un usuario inspecciona el código fuente o el JS
- **THEN** solo puede ver la anon key (que tiene permisos mínimos de INSERT)
- **AND** no existe ninguna service_role key en los archivos estáticos

