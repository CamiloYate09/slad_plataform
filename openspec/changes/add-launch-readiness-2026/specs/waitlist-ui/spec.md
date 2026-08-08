## ADDED Requirements

### Requirement: Pantalla Post-Submit con Posicion y Referral
Al confirmar el registro exitoso, el formulario SHALL ser reemplazado por una "pantalla post-submit" que muestra la posicion del usuario en la lista, el total de inscritos, el codigo de referido propio (copiable), y botones de share a X, WhatsApp y "Copiar link", con el link parametrizado `https://citystream.tech/?ref=XXXXXX`.

#### Scenario: Submit exitoso muestra posicion
- **WHEN** el RPC `register_waitlist` devuelve `{ position: 1234, total: 8000, referral_code: 'ab12cd', referred_count: 0 }`
- **THEN** la UI muestra "Eres el #1.234" en un numero grande con animacion count-up
- **AND** muestra "de 8.000 personas ya en la lista" debajo
- **AND** muestra una caja con el codigo `ab12cd` y un boton "Copiar codigo"

#### Scenario: Share buttons funcionan
- **WHEN** el usuario hace clic en el boton "Compartir en X"
- **THEN** se abre Twitter con texto pre-llenado: "Reservé mi lugar en @citystream_co — la red social que nació en Colombia 🇨🇴 https://citystream.tech/?ref=ab12cd"
- **AND** el link incluye su referral code

#### Scenario: Copiar link
- **WHEN** el usuario hace clic en "Copiar link"
- **THEN** el portapapeles recibe `https://citystream.tech/?ref=ab12cd`
- **AND** el boton cambia momentaneamente a "✓ Copiado"

### Requirement: Captura de Referral Code desde URL (first-touch)
El JS SHALL detectar el parametro `?ref=` en la URL al cargar la pagina, validarlo contra `^[a-z0-9]{4,12}$` y guardarlo en `sessionStorage['cs_ref']` **solo si la clave esta vacia**, para enviarlo como `p_referred_by` al hacer submit del waitlist. Gana el primer enlace que trajo a la persona (first-touch): una vez capturado, ningun `?ref=` posterior lo reemplaza mientras la pestana siga abierta.

#### Scenario: Usuario llega con referral
- **WHEN** la URL contiene `?ref=ab12cd` y `sessionStorage['cs_ref']` esta vacio
- **THEN** el JS guarda `ab12cd` en `sessionStorage['cs_ref']`
- **AND** al hacer submit del waitlist, este valor se envia como `p_referred_by`

#### Scenario: Segundo referral en la misma pestana
- **WHEN** ya existe `sessionStorage['cs_ref'] = 'ab12cd'` y el usuario abre un enlace con `?ref=zz99yy`
- **THEN** `sessionStorage['cs_ref']` sigue valiendo `ab12cd`
- **AND** el submit envia `p_referred_by: 'ab12cd'`

#### Scenario: URL sin referral
- **WHEN** la URL no tiene parametro `ref`
- **THEN** el JS no escribe ni borra nada: un `cs_ref` capturado en una visita anterior de la misma pestana se conserva
- **AND** si la clave estaba vacia, el submit envia `p_referred_by: null`

#### Scenario: Parametro con formato invalido
- **WHEN** la URL contiene `?ref=` con un valor que no cumple `^[a-z0-9]{4,12}$` (vacio, demasiado largo, con simbolos o markup)
- **THEN** el JS no escribe nada en `sessionStorage`
- **AND** el submit envia `p_referred_by: null`

#### Scenario: Visualizacion del referrer
- **WHEN** la URL tiene `?ref=ab12cd` y el codigo es valido
- **THEN** el form del waitlist muestra arriba: "Fuiste invitado por un miembro de CityStream 🎉" (opcional, sin revelar quien)

### Requirement: Consumo del Referral Code tras Registro Exitoso
El JS SHALL borrar `sessionStorage['cs_ref']` con `removeItem` **unicamente despues** de que `register_waitlist` devuelva respuesta exitosa. Leer el codigo en el submit no lo consume: sin este borrado, un segundo correo registrado en la misma pestana se atribuye al mismo referidor y le suma otro bonus de −10 posiciones.

#### Scenario: Registro exitoso consume el codigo
- **WHEN** `register_waitlist` devuelve `{ position, total, referral_code, referred_count }`
- **THEN** el JS ejecuta `sessionStorage.removeItem('cs_ref')`
- **AND** la pantalla post-submit se renderiza normalmente

#### Scenario: Error de red conserva el codigo
- **WHEN** el RPC falla por red, timeout o 5xx
- **THEN** `sessionStorage['cs_ref']` se conserva intacto
- **AND** el reintento del mismo submit vuelve a enviarlo como `p_referred_by`

#### Scenario: Segundo registro en la misma pestana
- **WHEN** el usuario ya registro un email con referral y registra otro distinto sin cerrar la pestana
- **THEN** el segundo submit envia `p_referred_by: null`
- **AND** el referidor original no recibe un segundo bonus

### Requirement: Rehidratacion de la Pantalla Post-Submit tras Reload
Al confirmarse el registro, el JS SHALL guardar el email en `localStorage['cs_email']`; en cada `load` posterior, si la clave existe, SHALL llamar `get_waitlist_position(cs_email)` y renderizar la pantalla post-submit sin mostrar el formulario. Sin esto la pantalla vive solo en memoria y un reload devuelve al usuario al formulario vacio, perdiendo posicion, codigo propio y botones de share — que son el motor de la lista viral.

#### Scenario: Reload despues de registrarse
- **WHEN** la pagina carga con `localStorage['cs_email']` presente y el RPC responde
- **THEN** se renderiza la pantalla post-submit con la posicion y el codigo devueltos
- **AND** el polling de 30 s se reanuda
- **AND** el formulario no llega a mostrarse (sin parpadeo intermedio)

#### Scenario: Email ya no esta en la lista
- **WHEN** `get_waitlist_position` devuelve `null` porque el titular ejercio supresion via habeas data
- **THEN** el JS borra `localStorage['cs_email']`
- **AND** muestra el formulario en estado idle, sin error visible

#### Scenario: RPC no disponible durante el load
- **WHEN** la llamada falla por red o timeout
- **THEN** se muestra el formulario en estado idle **sin** borrar `localStorage['cs_email']`
- **AND** reenviar el mismo email devuelve la misma posicion, porque `register_waitlist` es idempotente

#### Scenario: Equipo compartido
- **WHEN** la pantalla post-submit se muestra rehidratada
- **THEN** ofrece un control "¿No eres tu?" que borra `localStorage['cs_email']` y devuelve el formulario en estado idle
- **AND** el unico dato persistido es el email que el propio usuario escribio, sin token ni identificador de sesion

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
- **AND** `sessionStorage['cs_ref']` se borra: el codigo queda consumido
- **AND** el email se guarda en `localStorage['cs_email']` para rehidratar la pantalla tras un reload

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
- **AND** `sessionStorage['cs_ref']` se conserva para que el reintento no pierda el referido

#### Scenario: Accesibilidad
- **WHEN** el formulario está en cualquier estado
- **THEN** los mensajes de estado son anunciados por lectores de pantalla via `aria-live`
- **AND** el input tiene `label` visible o `aria-label` descriptivo
- **AND** el checkbox de privacidad se anuncia como `required` con su label completo
