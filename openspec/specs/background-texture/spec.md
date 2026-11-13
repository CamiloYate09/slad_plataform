# background-texture Specification

## Purpose
Textura diagonal fija detrás del contenido de todas las secciones.

## Requirements

### Requirement: Textura Diagonal de Fondo
La página SHALL mostrar una textura diagonal sutil, fija detrás del contenido, mediante un `div.bg-texture` (`aria-hidden="true"`) al principio del `body`. La textura SHALL ser un `repeating-linear-gradient` a -45 grados de líneas de 1px cada 4px, con `position: fixed; inset: 3px` (dentro del marco de degradado de 3px del `body`), `z-index: 0` y `pointer-events: none`.

Los colores de línea SHALL ser:
- Tema oscuro: `rgba(255, 255, 255, 0.013)`
- Tema claro: `rgba(0, 0, 0, 0.012)`

#### Scenario: Textura visible en dark mode
- **WHEN** el tema es oscuro y la página está cargada
- **THEN** líneas diagonales blancas con opacidad 0.013 cubren el fondo, fijas al hacer scroll

#### Scenario: Textura visible en light mode
- **WHEN** el tema es claro y la página está cargada
- **THEN** las líneas pasan a negras con opacidad 0.012, sin afectar la legibilidad del contenido

#### Scenario: No interfiere con interacciones
- **WHEN** el usuario hace clic o hover sobre cualquier elemento interactivo
- **THEN** la textura no recibe eventos de puntero y no la anuncian los lectores de pantalla

#### Scenario: prefers-reduced-motion
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** la textura se mantiene visible (es estática, no animada), sin impacto en este setting
