## MODIFIED Requirements

### Requirement: Selector de Ciudad
Después de "Cómo funciona", la sección `.city-picker` (`#ciudades`) SHALL mostrar las 3 ciudades de lanzamiento (Bogotá, Medellín y Cartagena) como pestañas, cada una con un panel de tres planes (etiqueta, `h4` y descripción) y un enlace a las experiencias. Debe anunciar que Cali y Barranquilla llegan pronto.

#### Scenario: Elegir ciudad
- **WHEN** el usuario pulsa una pestaña
- **THEN** esa pestaña queda con `aria-selected="true"` y solo se ve su panel
- **AND** el título "Planes en …" del panel queda oculto a la vista pero sigue disponible para lectores de pantalla

#### Scenario: Teclado
- **WHEN** el foco está en una pestaña y el usuario pulsa ←, →, Inicio o Fin
- **THEN** el foco y la selección pasan a la pestaña anterior, siguiente, primera o última
- **AND** ← en la primera pestaña lleva a la última y → en la última lleva a la primera
- **AND** si se pulsan con Alt, Ctrl o Cmd, las teclas se dejan al navegador
- **AND** Tab lleva del grupo de pestañas al panel visible

#### Scenario: Foco visible y alto contraste
- **WHEN** una pestaña o el panel recibe el foco con el teclado
- **THEN** se dibuja un contorno de 2px con `--accent-ink`, con contraste de al menos 3:1 en los dos temas
- **AND** con `forced-colors: active` la pestaña elegida lleva un contorno `CanvasText`

#### Scenario: Sin JavaScript
- **WHEN** JavaScript no se ejecuta
- **THEN** la barra de pestañas queda oculta y los tres paneles se ven seguidos, cada uno con su título "Planes en …"
- **AND** los paneles no llevan `role="tabpanel"`: `main.js` lo añade al montar las pestañas

#### Scenario: Móvil
- **WHEN** el viewport mide 860px o menos
- **THEN** los planes de cada ciudad se apilan en una columna
