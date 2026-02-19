## MODIFIED Requirements

### Requirement: Factory.ai Section Ordering
La página MUST seguir el orden de secciones idéntico a factory.ai, adaptado al contenido de CityStream.

#### Scenario: Secciones en orden factory.ai
- **WHEN** la página renderiza completa
- **THEN** las secciones aparecen en este orden exacto:
  1. Sticky navbar (logo, nav items, CTAs)
  2. Hero section (headline, subtitle, CTA, progress animation)
  3. Trusted-by / partners carousel (logos scrolling)
  4. **Stats section (4 métricas: usuarios, ciudades, conexiones, eventos)**
  5. Product features with tabs (4 tabs: Ciudades, Eventos, Personas, Conciertos)
  6. Numbered features ("Por qué CityStream" — 3 cards)
  7. Value proposition section (two-column, enterprise-style messaging)
  8. Experience cards grid (Bogotá, Medellín, Cartagena con tags)
  9. News / Novedades section (4 cards)
  10. CTA section
  11. Card-style rounded footer

#### Scenario: No existen secciones fuera del orden definido
- **WHEN** se inspecciona el HTML
- **THEN** no hay secciones adicionales entre las 11 definidas
- **AND** la sección `.stats` está posicionada entre `.trusted-by` y `.features`

## ADDED Requirements

### Requirement: Stats Social Proof Section
La página MUST incluir una sección de métricas clave posicionada entre el carousel y las features, mostrando cifras de crecimiento de CityStream con animación count-up para generar credibilidad inmediata.

#### Scenario: Layout horizontal de métricas
- **WHEN** la sección `.stats` renderiza en desktop
- **THEN** muestra 4 métricas en fila horizontal separadas por líneas verticales (`border-right: 1px solid var(--border-base)`)
- **AND** cada métrica tiene: número grande con gradient-text, etiqueta secundaria en uppercase
- **AND** la sección tiene `border-top` y `border-bottom` como separadores de sección factory.ai-style

#### Scenario: Layout en mobile
- **WHEN** la sección renderiza en viewport ≤768px
- **THEN** las 4 métricas se reorganizan en grid 2×2
- **AND** los separadores verticales se convierten en separadores horizontales (`border-bottom`)

#### Scenario: Métricas con datos reales
- **WHEN** la sección es visible
- **THEN** los valores mostrados corresponden a datos actualizados del equipo CityStream
- **AND** los valores usan sufijos de escala ("K+" para miles, "+" para exactos)
