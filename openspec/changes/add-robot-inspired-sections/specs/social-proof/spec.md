## ADDED Requirements

### Requirement: Banda de Métricas (Proof-points)
El landing SHALL presentar una banda de métricas con 3–4 cifras destacadas que respalden la propuesta de valor de CityStream, ubicada entre la sección `trusted-by` y `features`.

#### Scenario: Usuario llega a la banda de métricas en scroll
- **WHEN** el usuario hace scroll hasta la banda de métricas
- **THEN** se muestran 3–4 `.stat`, cada una con un número grande con estilo `.gradient-text` y un label descriptivo debajo
- **AND** los números animan un conteo ascendente hasta su valor final usando ScrollTrigger
- **AND** la sección no introduce un ancla que rompa la navegación activa del navbar

#### Scenario: Usuario con movimiento reducido
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** los números se muestran directamente en su valor final sin animación de conteo

#### Scenario: Responsive
- **WHEN** la ventana es ≤768px
- **THEN** las métricas se reorganizan a una grilla legible (2 columnas o stack) manteniendo contraste AA entre número, label y fondo
