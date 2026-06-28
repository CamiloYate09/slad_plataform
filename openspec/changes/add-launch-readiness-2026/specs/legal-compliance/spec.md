## ADDED Requirements

### Requirement: Pagina de Politica de Privacidad
El sitio SHALL publicar `privacidad.html` con una politica de tratamiento de datos personales conforme a la Ley 1581 de 2012, el Decreto 1377 de 2013 y la Circular Externa SIC 003 de 2018, identificando responsable, finalidades, derechos del titular, canal de habeas data, transferencias internacionales y vigencia.

#### Scenario: Usuario visita la politica
- **WHEN** un usuario navega a `/privacidad/` o `/privacidad.html`
- **THEN** recibe HTTP 200 con el documento completo
- **AND** el documento contiene las secciones obligatorias: Identificacion del responsable, Finalidad del tratamiento, Derechos del titular (conocer, actualizar, rectificar, suprimir, revocar autorizacion), Canal de Habeas Data con email, Transferencias internacionales, Vigencia de la politica
- **AND** incluye el correo `habeas-data@citystream.co` o equivalente como canal oficial

#### Scenario: Auditoria SIC
- **WHEN** la Superintendencia de Industria y Comercio audita la politica
- **THEN** todos los elementos obligatorios de la Ley 1581/Decreto 1377 estan presentes
- **AND** la fecha de ultima actualizacion es visible al pie del documento

### Requirement: Pagina de Terminos y Condiciones
El sitio SHALL publicar `terminos.html` con los terminos de uso del servicio (en su fase de pre-lanzamiento/waitlist), incluyendo: aceptacion del usuario, alcance del servicio actual, propiedad intelectual, limitacion de responsabilidad, jurisdiccion y ley aplicable (Republica de Colombia).

#### Scenario: Usuario visita los terminos
- **WHEN** un usuario navega a `/terminos/` o `/terminos.html`
- **THEN** recibe HTTP 200 con el documento completo
- **AND** el documento aclara que el waitlist es para futuro lanzamiento, no para acceso al producto
- **AND** declara jurisdiccion colombiana

### Requirement: Consentimiento Explicito en el Form de Waitlist
El formulario de waitlist SHALL incluir un checkbox obligatorio (no marcado por defecto) que solicita autorizacion expresa para el tratamiento del email, con link visible a la politica de privacidad.

#### Scenario: Usuario intenta submit sin marcar checkbox
- **WHEN** el usuario ingresa email valido pero no marca el checkbox
- **THEN** el form NO ejecuta el INSERT a Supabase
- **AND** muestra mensaje en `aria-live`: "Debes aceptar la politica de privacidad para continuar"
- **AND** el focus se mueve al checkbox

#### Scenario: Usuario marca checkbox y submitea
- **WHEN** el usuario marca el checkbox y hace submit con email valido
- **THEN** el INSERT a Supabase incluye un campo `consent_accepted_at` con timestamp del momento del submit (opcional, dependiente de schema)
- **AND** el form continua con el flow normal

#### Scenario: Accesibilidad del checkbox
- **WHEN** un lector de pantalla procesa el form
- **THEN** anuncia el checkbox como "required" con su label completo
- **AND** el link a la politica es navegable por teclado y abre en nueva pestana

### Requirement: Aviso Informativo en Footer
El footer del sitio SHALL incluir un aviso visible que informa que los datos son tratados conforme a la Ley 1581 de 2012, con link a la politica de privacidad y a los terminos.

#### Scenario: Footer renderiza
- **WHEN** el footer es visible en cualquier pagina
- **THEN** contiene texto: "Tus datos son tratados conforme a la Ley 1581 de 2012"
- **AND** incluye links Privacidad, Terminos, Habeas Data
- **AND** los links son legibles en dark theme y light theme

### Requirement: Canal de Habeas Data Operativo
El sitio SHALL declarar un canal de comunicacion para que el titular ejerza sus derechos de habeas data (acceso, rectificacion, supresion, revocacion), via email dedicado o formulario.

#### Scenario: Titular solicita supresion
- **WHEN** un titular envia un correo a `habeas-data@citystream.co` solicitando suprimir su email del waitlist
- **THEN** existe un proceso (manual u automatizado) para procesar la solicitud en max 15 dias habiles
- **AND** el titular recibe confirmacion de la accion ejecutada

### Requirement: Aviso de Transferencias Internacionales
La politica de privacidad SHALL declarar que los datos pueden ser procesados/almacenados en infraestructura fuera de Colombia (Supabase US), explicando las garantias contractuales aplicables.

#### Scenario: Politica declara transferencia
- **WHEN** un usuario lee la seccion de transferencias internacionales
- **THEN** encuentra mencion explicita de que Supabase (US) procesa los emails del waitlist
- **AND** se describe que existe contrato con clausulas de proteccion de datos
