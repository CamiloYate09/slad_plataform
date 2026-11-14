## ADDED Requirements

### Requirement: Próximos Eventos
La sección `.news` (`#noticias`) SHALL mostrar solo eventos de las ciudades de lanzamiento (Bogotá, Medellín y Cartagena), ordenados por fecha. Cada tarjeta SHALL llevar la ciudad y la fecha, el nombre, una descripción y un enlace "Ver más" a la web oficial del evento.

#### Scenario: Solo ciudades de lanzamiento
- **WHEN** se inspeccionan las tarjetas de eventos
- **THEN** todas son de Bogotá, Medellín o Cartagena
- **AND** aparecen de la fecha más cercana a la más lejana

#### Scenario: Fechas sin confirmar
- **WHEN** la organización aún no ha publicado las fechas de un evento
- **THEN** la tarjeta lo dice ("por confirmar" si hay una fecha habitual, "por anunciar" si no) en lugar de dar una fecha exacta

#### Scenario: Enlaces externos
- **WHEN** el usuario pulsa "Ver más"
- **THEN** se abre la web oficial del evento en una pestaña nueva, con `rel="noopener noreferrer"`
