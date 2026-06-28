## ADDED Requirements

### Requirement: Pantalla Post-Submit con Posicion y Referral
Al confirmar el registro exitoso, el formulario SHALL ser reemplazado por una "pantalla post-submit" que muestra la posicion del usuario en la lista, el total de inscritos, el codigo de referido propio (copiable), y botones de share a X, WhatsApp y "Copiar link", con el link parametrizado `https://citystream.co/?ref=XXXXXX`.

#### Scenario: Submit exitoso muestra posicion
- **WHEN** el RPC `register_waitlist` devuelve `{ position: 1234, total: 8000, referral_code: 'ab12cd', referred_count: 0 }`
- **THEN** la UI muestra "Eres el #1.234" en un numero grande con animacion count-up
- **AND** muestra "de 8.000 personas ya en la lista" debajo
- **AND** muestra una caja con el codigo `ab12cd` y un boton "Copiar codigo"

#### Scenario: Share buttons funcionan
- **WHEN** el usuario hace clic en el boton "Compartir en X"
- **THEN** se abre Twitter con texto pre-llenado: "Reservé mi lugar en @citystream_co — la red social que nació en Colombia 🇨🇴 https://citystream.co/?ref=ab12cd"
- **AND** el link incluye su referral code

#### Scenario: Copiar link
- **WHEN** el usuario hace clic en "Copiar link"
- **THEN** el portapapeles recibe `https://citystream.co/?ref=ab12cd`
- **AND** el boton cambia momentaneamente a "✓ Copiado"

### Requirement: Captura de Referral Code desde URL
El JS SHALL detectar el parametro `?ref=` en la URL al cargar la pagina y guardar el codigo en `sessionStorage`, para enviarlo como `p_referred_by` al hacer submit del waitlist.

#### Scenario: Usuario llega con referral
- **WHEN** la URL contiene `?ref=ab12cd`
- **THEN** el JS guarda `ab12cd` en `sessionStorage['cs_ref']`
- **AND** al hacer submit del waitlist, este valor se envia como `p_referred_by`

#### Scenario: URL sin referral
- **WHEN** la URL no tiene parametro `ref`
- **THEN** `sessionStorage['cs_ref']` queda vacio
- **AND** el submit envia `p_referred_by: null`

#### Scenario: Visualizacion del referrer
- **WHEN** la URL tiene `?ref=ab12cd` y el codigo es valido
- **THEN** el form del waitlist muestra arriba: "Fuiste invitado por un miembro de CityStream 🎉" (opcional, sin revelar quien)

### Requirement: Polling de Posicion en Vivo
La pantalla post-submit SHALL actualizar la posicion del usuario cada 30 segundos via RPC `get_waitlist_position` mientras la pestana esta visible (`document.visibilityState === 'visible'`), reflejando cambios cuando nuevos referidos suben al usuario en la lista.

#### Scenario: Usuario obtiene un referido nuevo
- **WHEN** la pantalla esta abierta y otro usuario se registra con su codigo
- **THEN** en el proximo ciclo de polling, la posicion del usuario sube
- **AND** el contador `referred_count` se incrementa
- **AND** opcionalmente, una animacion "subiste N posiciones" celebra el evento

#### Scenario: Tab oculta no consume recursos
- **WHEN** el usuario cambia de tab
- **THEN** el polling se pausa hasta que vuelva al tab
- **AND** no se generan requests innecesarios

## MODIFIED Requirements

### Requirement: Formulario de Lista de Espera en CTA Card
El CTA card SHALL contener un formulario de email con estados idle/loading/success/error que envia el email a Supabase via RPC `register_waitlist` (incluyendo opcionalmente un referral code) y al confirmarse, oculta el formulario y revela la pantalla post-submit con posicion, codigo de referido y share buttons. El form SHALL incluir un checkbox obligatorio de aceptacion de la politica de privacidad.

#### Scenario: Submit exitoso
- **WHEN** el usuario ingresa un email válido, marca el checkbox de privacidad, y hace submit
- **THEN** el botón muestra estado loading durante la petición
- **AND** al recibir respuesta exitosa, el formulario se oculta y aparece la pantalla post-submit
- **AND** la pantalla post-submit revela posicion, total, codigo de referido y share buttons

#### Scenario: Sin checkbox de privacidad
- **WHEN** el usuario hace submit sin marcar el checkbox de privacidad
- **THEN** el form NO envia la peticion
- **AND** muestra error inline accesible: "Debes aceptar la politica de privacidad"
- **AND** el focus se mueve al checkbox

#### Scenario: Email inválido
- **WHEN** el usuario hace submit con un email mal formateado
- **THEN** el formulario muestra error inline sin enviar nada a Supabase
- **AND** el foco regresa al input de email

#### Scenario: Email ya registrado
- **WHEN** el usuario intenta registrar un email que ya existe
- **THEN** la RPC `register_waitlist` devuelve la posicion existente
- **AND** la pantalla post-submit se muestra con la posicion y codigo de referido existente del usuario
- **AND** un mensaje sutil indica "Ya estabas en la lista 🎉"

#### Scenario: Error de red
- **WHEN** Supabase no responde o devuelve error 5xx
- **THEN** el formulario muestra "Algo salió mal. Intenta de nuevo." sin limpiar el input
- **AND** el checkbox de privacidad mantiene su estado marcado

#### Scenario: Accesibilidad
- **WHEN** el formulario está en cualquier estado
- **THEN** los mensajes de estado son anunciados por lectores de pantalla via `aria-live`
- **AND** el input tiene `label` visible o `aria-label` descriptivo
- **AND** el checkbox de privacidad se anuncia como `required` con su label completo
