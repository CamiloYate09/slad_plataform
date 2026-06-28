## ADDED Requirements

### Requirement: Web App Manifest Instalable
El sitio SHALL exponer un `manifest.webmanifest` en la raiz con todos los campos requeridos para instalabilidad PWA en Chrome, Edge, Samsung Internet y Safari (iOS 17+).

#### Scenario: Chrome detecta instalabilidad
- **WHEN** Chrome carga el sitio por primera vez
- **THEN** lee el `<link rel="manifest">` del head
- **AND** valida que el manifest contiene `name`, `short_name`, `start_url`, `display: standalone`, `theme_color`, `background_color`, e iconos de 192px y 512px (incluyendo uno con `purpose: maskable`)
- **AND** el navegador habilita el prompt de instalacion

#### Scenario: Usuario instala la PWA
- **WHEN** el usuario acepta el prompt de instalacion
- **THEN** la app se agrega al launcher / dock con el icono CityStream
- **AND** al abrirla, corre en modo standalone (sin barra del navegador)
- **AND** la theme color de la status bar coincide con `#0a0a0a`

### Requirement: Service Worker con Cache Estrategico
El sitio SHALL registrar un service worker `sw.js` que implementa estrategias diferenciadas: `cache-first` para assets estaticos versionados (CSS, JS, imagenes), `network-first` para llamadas a Supabase, y un fallback offline (`offline.html`).

#### Scenario: Usuario online navega
- **WHEN** el usuario carga la pagina por segunda vez
- **THEN** los assets estaticos se sirven desde cache (sub-100ms)
- **AND** las llamadas a Supabase van a la red con timeout y fallback a cache si la red falla

#### Scenario: Usuario offline
- **WHEN** el usuario abre la PWA sin conexion
- **THEN** la pagina se sirve desde cache
- **AND** si una ruta no esta cacheada, se muestra `offline.html` con mensaje claro
- **AND** no se rompe el layout ni se muestran errores 404 nativos

#### Scenario: Actualizacion del SW
- **WHEN** se publica una nueva version con cache name incrementado (`citystream-v2`)
- **THEN** el SW nuevo limpia caches obsoletas en su evento `activate`
- **AND** los usuarios reciben los nuevos assets en su siguiente recarga

### Requirement: Banner de Instalacion Contextual
El prompt de instalacion `beforeinstallprompt` SHALL ser interceptado y mostrado solo en la pantalla post-submit del waitlist, no en la carga inicial, para maximizar contexto de valor.

#### Scenario: Usuario completa el waitlist
- **WHEN** el usuario hace submit exitoso y aparece la pantalla post-submit
- **THEN** si el navegador soporta installacion y aun no esta instalada, se muestra un boton "Instalar app CityStream"
- **AND** al hacer clic, se dispara `prompt.prompt()` y el usuario decide

#### Scenario: Usuario ya tiene la app instalada
- **WHEN** la pagina detecta `navigator.standalone` o el matchMedia `(display-mode: standalone)`
- **THEN** el boton de instalacion no aparece
- **AND** la UI asume modo PWA y oculta hints redundantes

### Requirement: Push Notifications Opt-in
El sitio SHALL ofrecer suscripcion a push notifications (Web Push API + VAPID) en la pantalla post-submit del waitlist, persistiendo el endpoint en Supabase para envio masivo en el lanzamiento.

#### Scenario: Usuario solicita push
- **WHEN** el usuario hace clic en "Avisame con notificacion cuando lancemos"
- **THEN** se invoca `Notification.requestPermission()`
- **AND** si concede permiso, se obtiene la subscription via `pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`
- **AND** los campos `endpoint`, `p256dh`, `auth` se envian a Supabase RPC `subscribe_push(email, endpoint, p256dh, auth)`
- **AND** el boton cambia a "✓ Te avisaremos"

#### Scenario: Usuario niega permiso
- **WHEN** el usuario rechaza el prompt de notificaciones
- **THEN** el boton desaparece sin error visible
- **AND** se registra el evento (sin almacenar PII) para tracking

#### Scenario: Navegador sin soporte
- **WHEN** Safari iOS sin PWA instalada o navegador antiguo cargan la pantalla
- **THEN** el boton de push NO se muestra
- **AND** no se reporta error en consola

### Requirement: Shortcuts en el Manifest
El manifest SHALL declarar al menos un `shortcuts` para acceso rapido al waitlist desde el launcher de la app (long-press en Android, right-click en desktop).

#### Scenario: Usuario long-press sobre el icono PWA
- **WHEN** el usuario hace long-press sobre el icono CityStream en Android
- **THEN** aparece un shortcut "Lista de espera"
- **AND** al tocarlo, abre la app directamente en `#waitlist-form`
