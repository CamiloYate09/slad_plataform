## ADDED Requirements

### Requirement: Página publicada sin contenido placeholder
La página publicada (rama `main` / `citystream.co`) MUST NOT mostrar a los
visitantes marcadores de desarrollo ni datos fabricados. Toda cifra o cita
atribuida debe ser un dato real verificado por el equipo CityStream o, mientras
no exista, la métrica/cita correspondiente debe removerse del DOM publicado.

#### Scenario: Banda de métricas sin marcadores placeholder
- **WHEN** la sección `.stats-band` es visible para un visitante
- **THEN** ninguna `.stat` muestra la pastilla `.stat-tag-placeholder`
- **AND** ningún `.stat-number` conserva el atributo `data-placeholder`
- **AND** cada cifra mostrada corresponde a un dato real o la métrica fue removida

#### Scenario: Cita de fundador sin marcadores placeholder
- **WHEN** el bloque `.founder-quote` es visible para un visitante
- **THEN** el `figcaption` muestra un nombre real (no "Nombre del Fundador")
- **AND** no aparece ninguna pastilla `.stat-tag-placeholder` en la cita
- **AND** si no hay cita real disponible, el bloque completo se remueve

#### Scenario: Verificación previa a publicar
- **WHEN** se inspecciona el HTML servido de la página
- **THEN** no existe ninguna ocurrencia de `data-placeholder`, `stat-tag-placeholder`
  ni de la palabra "placeholder" en el contenido renderizable
- **AND** la regla CSS `.stat-tag-placeholder` se removió si quedó sin uso
