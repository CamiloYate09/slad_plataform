## Context
CityStream quiere adoptar la estética premium de factory.ai (negro puro, tipografía moderna, layout espacioso, animaciones suaves) manteniendo su identidad visual existente (gradientes púrpura/cyan, acentos de color). Este rediseño es puramente visual — no cambia funcionalidad, contenido ni estructura de secciones.

## Goals / Non-Goals

### Goals
- Base negra pura que haga resaltar los gradientes CityStream como acentos premium
- Tipografía Inter para aspecto moderno y tecnológico
- Header transparente que se solidifica al scroll (patrón factory.ai)
- Footer tipo card con bordes redondeados (patrón factory.ai)
- Animaciones de reveal suaves y escalonadas al scroll
- Hover underline-reveal en links de navegación
- Spacing generoso y layout con grid de 12 columnas
- Mantener 100% de los colores CityStream existentes

### Non-Goals
- No cambiar contenido textual ni imágenes
- No agregar nuevas secciones o funcionalidad
- No introducir frameworks CSS (Tailwind, etc.)
- No agregar dependencias JS adicionales
- No cambiar la estructura HTML de secciones (#inicio, #features, #cursos, etc.)
- No implementar theme switcher dark/light (factory.ai lo tiene pero CityStream se queda dark-only)

## Decisions

### D1: Fondo negro puro vs negro suave
- **Decisión**: Usar `#0a0a0a` como base en lugar de `#000000` puro
- **Razón**: El negro puro crea demasiado contraste con los gradientes de color. Un negro muy oscuro (pero no puro) da la misma sensación de factory.ai pero con mejor legibilidad y armonía con los acentos CityStream
- **Alternativas**: `#000000` (demasiado duro), `rgb(5,6,45)` actual (no es negro)

### D2: Tipografía Inter como reemplazo de Public Sans
- **Decisión**: Migrar de Public Sans a Inter
- **Razón**: Inter es una typeface geométrica moderna, open-source, con excelente rendering en pantalla. Es la más cercana al estilo de factory.ai disponible en Google Fonts. Pesos: 300, 400, 500, 600, 700, 800
- **Alternativas**: Geist Sans (no en Google Fonts CDN), Satoshi (requiere otro CDN), mantener Public Sans (no logra el look factory.ai)

### D3: Grid system 12 columnas en CSS puro
- **Decisión**: Implementar grid de 12 columnas con CSS Grid nativo, max-width 1440px
- **Razón**: Factory.ai usa grid de 12 columnas. CSS Grid nativo es suficiente sin necesidad de framework. El ancho mayor (de 1200px a 1440px) da el spacing generoso
- **Alternativas**: Mantener max-width 1200px (no logra el espaciado factory.ai), usar Tailwind (overkill para sitio estático)

### D4: Footer como card redondeada
- **Decisión**: Footer con background secundario, border-radius `24px` en desktop, margen lateral para crear efecto "card flotante"
- **Razón**: Es el patrón más distintivo de factory.ai — el footer se siente como un componente separado, no un bloque pegado al fondo
- **Alternativas**: Footer flush (actual, no logra el efecto), footer con borde gradient (puede chocar con el body border)

### D5: Navbar transparente con transición
- **Decisión**: Navbar inicia transparente (sin fondo) sobre el hero, transiciona a fondo negro con blur al scroll (>50px)
- **Razón**: Crea profundidad visual y deja que el hero respire. Factory.ai usa este mismo patrón
- **Alternativas**: Navbar siempre con fondo (actual), navbar siempre transparente (problemas de legibilidad)

## Risks / Trade-offs
- **Contraste de lectura**: El negro puro puede reducir legibilidad del texto blanco. Mitigación: usar `rgba(255,255,255,0.9)` para body text, blanco puro solo para headings
- **Compatibilidad backdrop-filter**: El blur del navbar no funciona en navegadores muy antiguos. Mitigación: fallback a fondo sólido semitransparente (ya existe en el código actual)
- **Tamaño de fuente Inter**: Puede renderizar diferente a Public Sans. Mitigación: ajustar line-heights y font-sizes post-migración

## Open Questions
- Ninguna — el scope está bien definido y las decisiones técnicas son directas
