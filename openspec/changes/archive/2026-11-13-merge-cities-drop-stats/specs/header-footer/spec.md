## MODIFIED Requirements

### Requirement: Transparent-to-Solid Navbar
El navbar MUST ser sticky y contener el logo a la izquierda, los enlaces de sección (Características, Ciudades, Contacto) en el centro y, a la derecha, el botón del tutorial, el cambio de tema, "Iniciar sesión" y "Crear cuenta". Es transparente arriba del todo y se vuelve sólido al hacer scroll, controlado por un listener de scroll en `main.js`.

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
