## ADDED Requirements

### Requirement: Textura Diagonal de Fondo

La página SHALL mostrar una textura diagonal sutil como overlay fijo sobre todo el contenido, replicando la textura de fondo de factory.ai. La textura SHALL implementarse como un pseudo-elemento `body::before` con `repeating-linear-gradient` a 45 grados, usando opacidades muy bajas para no interferir con el contenido.

Los parámetros SHALL ser:
- Dark mode: líneas con `rgba(255, 255, 255, 0.02)` sobre el fondo oscuro
- Light mode: líneas con `rgba(0, 0, 0, 0.015)` sobre el fondo claro
- `pointer-events: none` para no interferir con interacciones
- `position: fixed; z-index: 0` para mantenerse detrás de todo el contenido
- El pseudo-elemento SHALL respetar el `z-index` de las secciones que lo requieran

#### Scenario: Textura visible en dark mode

- **WHEN** el tema es oscuro y la página está cargada
- **THEN** una textura diagonal sutil se superpone sobre el fondo oscuro, visible como líneas finas con opacidad muy baja

#### Scenario: Textura visible en light mode

- **WHEN** el tema es claro y la página está cargada
- **THEN** una textura diagonal sutil se superpone sobre el fondo claro sin interferir con la legibilidad del contenido

#### Scenario: No interfiere con interacciones

- **WHEN** el usuario hace clic o hover sobre cualquier elemento interactivo
- **THEN** la textura no bloquea ni interfiere con los eventos de mouse/touch

#### Scenario: prefers-reduced-motion

- **WHEN** el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** la textura se mantiene visible (es estática, no animada), sin impacto en este setting
