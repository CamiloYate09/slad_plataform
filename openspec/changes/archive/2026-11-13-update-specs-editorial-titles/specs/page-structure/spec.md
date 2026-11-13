## MODIFIED Requirements

### Requirement: Factory.ai Section Ordering
La página MUST seguir el orden de secciones definido abajo, partiendo del de factory.ai y adaptado al contenido de CityStream.

#### Scenario: Secciones en orden factory.ai
- **WHEN** la página renderiza completa
- **THEN** las secciones aparecen en este orden exacto:
  1. Sticky navbar (logo, nav items, CTAs)
  2. Hero (`.hero`: headline, subtitle, captura de correo, escena de la app)
  3. Carrusel de ciudades (`.trusted-by`)
  4. Cifras (`.stats-band`)
  5. Funcionalidades en bento (`.features`, ver `features-bento`)
  6. Numbered features (`.numbered-features`, "Por qué CityStream" — 3 cards)
  7. Audience personas (`.audience`, "¿Para quién es CityStream?" — 4 tarjetas, ver `audience-personas`)
  8. Propuesta de valor (`.value-prop`, dos columnas)
  9. Experiencias (`.experiences`, tarjetas de ciudad con tags)
  10. Próximos eventos (`.news`)
  11. Preguntas frecuentes (`.faq`)
  12. CTA (`.cta-section`)
  13. Footer (`.footer`)

#### Scenario: No existen secciones fuera del orden definido
- **WHEN** se inspecciona el HTML
- **THEN** no hay secciones adicionales entre las 13 definidas
- **AND** `.stats-band` está entre `.trusted-by` y `.features`
- **AND** `.audience` está entre `.numbered-features` y `.value-prop`
- **AND** `.faq` está entre `.news` y `.cta-section`

## REMOVED Requirements

### Requirement: Tabbed Feature Showcase

**Reason**: La sección de funcionalidades ya no usa pestañas (ni el sticky scroll que las sustituyó): es un bento de tarjetas.

**Migration**: Ver `features-bento`. `#features` conserva su id; no existen `.tab-buttons`, `.tab-panels` ni `.tab-btn`.
