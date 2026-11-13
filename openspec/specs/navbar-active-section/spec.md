# navbar-active-section Specification

## Purpose
Cómo marca la barra de navegación la sección que el usuario tiene en pantalla.

## Requirements

### Requirement: Enlace de la Sección Visible
El navbar SHALL marcar con `.nav-active` el enlace de la sección que cruza la banda central del viewport. `main.js` SHALL observar con un único `IntersectionObserver` (`rootMargin: -40% 0px -40% 0px`) las secciones `#inicio`, `#features`, `#experiencias` y `#contacto` que tengan un enlace en `.nav-links`. `.nav-active` SHALL pintar el enlace en `--accent-orange-hover` con el subrayado completo.

#### Scenario: Arriba de la página
- **WHEN** la página carga y el usuario está en el hero
- **THEN** ningún enlace aparece marcado, porque `#inicio` no tiene enlace en la barra

#### Scenario: Scroll a Funcionalidades
- **WHEN** la sección `#features` cruza la banda central del viewport
- **THEN** "Características" recibe `.nav-active` y los demás enlaces la pierden

#### Scenario: Scroll rápido entre secciones
- **WHEN** el usuario hace scroll rápido pasando por varias secciones
- **THEN** solo queda marcado el enlace de la sección que está en la banda central

#### Scenario: Clic en enlace del navbar
- **WHEN** el usuario hace clic en un enlace del navbar
- **THEN** la página se desplaza a la sección y su enlace queda marcado al llegar

#### Scenario: Menú móvil
- **WHEN** el usuario navega desde el menú móvil
- **THEN** el menú usa los mismos enlaces de `.nav-links`, así que el enlace de la sección queda marcado
