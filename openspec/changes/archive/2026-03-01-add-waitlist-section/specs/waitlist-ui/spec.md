## ADDED Requirements

### Requirement: Waitlist Counter Bar (reemplaza Stats)
La sección `.stats` SHALL ser reemplazada por una barra de contador de lista de espera que muestra el número real de personas registradas, con animación count-up y un CTA de scroll al formulario.

#### Scenario: Página carga con Supabase disponible
- **WHEN** la página carga y Supabase responde con el conteo
- **THEN** el contador anima desde 0 hasta el número real de inscritos en la lista de espera
- **AND** el label dice "personas ya en la lista de espera"

#### Scenario: Supabase no disponible
- **WHEN** la petición al conteo falla (timeout, error de red)
- **THEN** el contador muestra "Sé de los primeros" sin número, sin error visible al usuario

#### Scenario: CTA de scroll
- **WHEN** el usuario hace clic en "Únete tú también ↓"
- **THEN** la página hace scroll suave a la sección `#waitlist`

---

### Requirement: Formulario de Lista de Espera en CTA Card
El CTA card SHALL contener un formulario de email con estados idle/loading/success/error que envía el email a Supabase y confirma el registro.

#### Scenario: Submit exitoso
- **WHEN** el usuario ingresa un email válido y hace submit
- **THEN** el botón muestra estado loading durante la petición
- **AND** al recibir respuesta exitosa, el formulario se oculta y aparece mensaje de confirmación
- **AND** el mensaje dice "¡Ya estás en la lista! Te avisaremos cuando lancemos."

#### Scenario: Email inválido
- **WHEN** el usuario hace submit con un email mal formateado
- **THEN** el formulario muestra error inline sin enviar nada a Supabase
- **AND** el foco regresa al input de email

#### Scenario: Email ya registrado
- **WHEN** el usuario intenta registrar un email que ya existe
- **THEN** el formulario muestra mensaje "Este email ya está en la lista 🎉"

#### Scenario: Error de red
- **WHEN** Supabase no responde o devuelve error 5xx
- **THEN** el formulario muestra "Algo salió mal. Intenta de nuevo." sin limpiar el input

#### Scenario: Accesibilidad
- **WHEN** el formulario está en cualquier estado
- **THEN** los mensajes de estado son anunciados por lectores de pantalla via `aria-live`
- **AND** el input tiene `label` visible o `aria-label` descriptivo

---

### Requirement: Enlace de Waitlist en Navbar
El navbar SHALL incluir un enlace "Lista de espera" que hace scroll a `#waitlist`.

#### Scenario: Navbar desktop
- **WHEN** el usuario está en viewport >= 1024px
- **THEN** el navbar muestra el enlace "Lista de espera" como item de navegación

#### Scenario: Navbar mobile (menú hamburguesa)
- **WHEN** el menú móvil está abierto
- **THEN** "Lista de espera" aparece en la lista del menú
