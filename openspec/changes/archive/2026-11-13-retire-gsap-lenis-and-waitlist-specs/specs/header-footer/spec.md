## MODIFIED Requirements

### Requirement: Transparent-to-Solid Navbar
El navbar MUST ser sticky y contener el logo a la izquierda, los enlaces de sección (Características, Experiencias, Contacto) en el centro y, a la derecha, el botón del tutorial, el cambio de tema, "Iniciar sesión" y "Crear cuenta". Es transparente arriba del todo y se vuelve sólido al hacer scroll, controlado por un listener de scroll en `main.js`.

#### Scenario: Navbar con estructura factory.ai
- **WHEN** la página renderiza
- **THEN** el navbar es `position: sticky; top: 0; z-index: 60`
- **AND** su padding es `1.25rem var(--px-desktop)` en escritorio y `1rem var(--px-mobile)` en 768px o menos
- **AND** en 768px o menos los enlaces y los botones de la derecha se ocultan tras el botón de menú, y el navbar lleva `border-bottom: 1px solid var(--border-base)`

#### Scenario: Navbar se solidifica al scroll
- **WHEN** el usuario scrollea más de 50px
- **THEN** el navbar recibe `.scrolled`: fondo `rgba(8, 8, 8, 0.65)` con `backdrop-filter: blur(20px) saturate(180%)`, borde inferior sutil y una textura de ruido
- **AND** en tema claro el fondo es `rgba(252, 252, 252, 0.72)`
- **AND** fondo, desenfoque y borde cambian con una transición de 300ms

#### Scenario: Navbar links con underline-reveal naranja
- **WHEN** el usuario hace hover sobre un enlace de sección
- **THEN** el texto cambia a `--accent-orange-hover` (#f97316)
- **AND** un pseudo-elemento `::after` crece de `width: 0` a `width: 100%` debajo del texto con una transición de `width` de 300ms `ease-in-out`

### Requirement: Card-Style Rounded Footer
El footer MUST renderizarse como una card de bordes redondeados, centrada y separada de los bordes de la página, con fondo `var(--bg-footer)` (#111111 en oscuro, #f0f0f0 en claro) y borde `1px solid var(--border-base)`.

#### Scenario: Footer como card flotante en desktop
- **WHEN** la página renderiza en un viewport de más de 768px
- **THEN** el footer tiene `border-radius: 24px` y `width: calc(100% - 72px)` centrado
- **AND** tiene `min-height: 430px` y `margin-bottom: 1.5rem`
- **AND** sus columnas se reparten en una cuadrícula de 4

#### Scenario: Footer en mobile
- **WHEN** la página renderiza en un viewport de 768px o menos
- **THEN** el footer tiene `border-radius: 12px`, `width: calc(100% - 32px)` y `min-height: 550px`, con las columnas en 2
- **AND** en 480px o menos las columnas pasan a 1 y la altura mínima es automática

#### Scenario: Footer links con hover naranja
- **WHEN** el usuario hace hover sobre un link del footer
- **THEN** el color cambia a `--accent-orange-hover` (#f97316) y un subrayado crece de izquierda a derecha con una transición de `width` de 300ms `ease-in-out`
