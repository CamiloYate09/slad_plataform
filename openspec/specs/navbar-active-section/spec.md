# navbar-active-section Specification

## Purpose
TBD - created by archiving change add-ux-parity-v2. Update Purpose after archive.
## Requirements
### Requirement: Indicador de Sección Activa en Navbar

El navbar SHALL reflejar visualmente la sección del documento que está actualmente visible mientras el usuario hace scroll, resaltando el enlace de navegación correspondiente con color naranja (`var(--accent-orange)`) y `font-weight: 600`. Esto replica el comportamiento de resaltado de sección activa observado en factory.ai.

La implementación SHALL usar `IntersectionObserver` sobre cada sección ancla (`#inicio`, `#features`, `#experiencias`, `#noticias`, `#contacto`). Un threshold de `0.3` (30% de la sección visible) SHALL activar el estado activo del enlace correspondiente.

El estado activo SHALL:
- Añadir la clase `.nav-active` al enlace `<a>` del navbar
- Aplicar `color: var(--accent-orange)` y `font-weight: 600` vía CSS en `.nav-active`
- Remover `.nav-active` de todos los demás enlaces simultáneamente
- El enlace de inicio (#inicio) SHALL estar activo cuando el usuario está en el top de la página

El sistema SHALL ser compatible con Lenis smooth scroll (los eventos de IntersectionObserver son independientes del scroll handler de Lenis).

#### Scenario: Hero activo al cargar

- **WHEN** la página carga y el usuario está en la parte superior
- **THEN** el enlace de navegación "Inicio" (o el enlace que apunta a `#inicio`) muestra estado activo en naranja

#### Scenario: Scroll a sección Features

- **WHEN** el usuario hace scroll hasta que la sección `#features` ocupa al menos el 30% del viewport
- **THEN** el enlace de navbar correspondiente a Features se resalta en naranja y los demás vuelven al color normal

#### Scenario: Scroll rápido entre secciones

- **WHEN** el usuario hace scroll rápido pasando por múltiples secciones
- **THEN** el estado activo del navbar se actualiza correctamente a la sección más visible sin parpadeos excesivos

#### Scenario: Clic en enlace del navbar

- **WHEN** el usuario hace clic en un enlace del navbar para navegar a una sección
- **THEN** el enlace del destino se marca como activo al llegar a esa sección

#### Scenario: Compatibilidad con mobile menu

- **WHEN** el usuario usa el menú mobile y navega a una sección
- **THEN** el enlace activo se marca correctamente tras el cierre del menú mobile

