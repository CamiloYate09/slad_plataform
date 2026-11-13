## ADDED Requirements

### Requirement: Tabla waitlist Sin Acceso Directo
La tabla `public.waitlist` SHALL tener Row Level Security activa sin ninguna policy permisiva, de modo que los roles `anon` y `authenticated` no puedan leer, insertar, modificar ni borrar filas. El sitio estático NEVER SHALL contener la URL ni claves de Supabase.

#### Scenario: Acceso con la anon key
- **WHEN** alguien usa la anon key para hacer SELECT o INSERT en `waitlist`
- **THEN** Supabase no devuelve ni acepta filas

#### Scenario: Inspección del código fuente
- **WHEN** alguien inspecciona el HTML y el JS publicados
- **THEN** no encuentra la URL del proyecto de Supabase ni ninguna clave (`anon` o `service_role`)

### Requirement: RPC de Waitlist y Push Solo para el Backend
Las funciones `register_waitlist`, `get_waitlist_position`, `subscribe_push` y `gen_ref_code` SHALL ejecutarse solo con el rol `service_role`: su permiso `EXECUTE` SHALL estar revocado a `PUBLIC`, `anon` y `authenticated`. Si el navegador vuelve a necesitarlas, SHALL pasar por un backend con verificación de correo y límite de tasa.

#### Scenario: Llamada desde el navegador
- **WHEN** alguien llama a una de esas funciones con la anon key
- **THEN** Supabase la rechaza por falta de permiso

#### Scenario: Llamada desde el backend
- **WHEN** el backend llama a una de esas funciones con `service_role`
- **THEN** la función se ejecuta

## MODIFIED Requirements

### Requirement: Función RPC Pública de Conteo
Supabase SHALL exponer una función RPC `get_waitlist_count()` accesible por el rol `anon` que devuelve únicamente el conteo total de filas, sin exponer ningún email ni metadato individual.

#### Scenario: Petición de conteo desde el cliente
- **WHEN** un cliente con la anon key llama `get_waitlist_count`
- **THEN** recibe un entero con el total de inscritos
- **AND** ningún email ni dato personal es incluido en la respuesta

### Requirement: Deduplicación de emails
La tabla `waitlist` SHALL tener un UNIQUE constraint en el campo `email` para prevenir registros duplicados.

#### Scenario: Registro duplicado detectado en BD
- **WHEN** se intenta insertar un email que ya existe
- **THEN** Supabase devuelve error PostgreSQL code `23505` y no se crea una segunda fila

## REMOVED Requirements

### Requirement: Integración Supabase con INSERT-Only Anon Key

**Reason**: El sitio ya no habla con Supabase, y la policy de INSERT anónimo se eliminó (`20260527_add_waitlist_referral.sql`).

**Migration**: Ver "Tabla waitlist Sin Acceso Directo".

### Requirement: Configuración segura de variables en el cliente

**Reason**: El cliente ya no lleva ninguna credencial de Supabase, ni siquiera la anon key.

**Migration**: Ver el escenario "Inspección del código fuente" en "Tabla waitlist Sin Acceso Directo".
