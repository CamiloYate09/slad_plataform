## MODIFIED Requirements
### Requirement: Transparent-to-Solid Navbar
El navbar MUST ser sticky con border-bottom, siguiendo el patrón exacto de factory.ai. MUST contener: logo (izquierda), nav items centro-derecha, y botones CTA (derecha). La transición transparent → solid se controla via GSAP ScrollTrigger.

#### Scenario: Navbar con estructura factory.ai
- **WHEN** la página renderiza
- **THEN** el navbar es `position: sticky; top: 0; z-index: 60`
- **AND** contiene: logo a la izquierda, nav items (Características, Ciudades, Experiencias, Contacto), CTAs (Iniciar Sesión, Contacto)
- **AND** padding: `py-5 px-4` en mobile, `px-9` en desktop
- **AND** border-bottom: `1px solid var(--border-base)` en `border-base-800` equivalente

#### Scenario: Navbar se solidifica al scroll
- **WHEN** el usuario scrollea más de 50px
- **THEN** el navbar transiciona a `background: rgba(10, 10, 10, 0.85)` con `backdrop-filter: blur(16px)`
- **AND** la transición es controlada por ScrollTrigger o scroll event listener
- **AND** la transición dura 300ms

#### Scenario: Navbar links con underline-reveal naranja
- **WHEN** el usuario hace hover sobre un link del nav (excepto logo y CTAs)
- **THEN** el texto cambia a `--accent-orange-hover` (#f97316)
- **AND** un pseudo-elemento `::after` crece de `width: 0%` a `width: 100%` debajo del texto
- **AND** la transición es `all 300ms ease-in-out`

### Requirement: Card-Style Rounded Footer
El footer MUST renderizarse como una card con bordes redondeados siguiendo el patrón exacto de factory.ai: `rounded-3xl` (24px) en desktop, con width `calc(100% - 72px)` centrado, fondo oscuro secundario, y min-height generoso.

#### Scenario: Footer como card flotante en desktop
- **WHEN** la página renderiza en desktop
- **THEN** el footer tiene `border-radius: 24px` (`rounded-3xl`)
- **AND** tiene width `calc(100% - 72px)` con `margin: 0 auto`
- **AND** el fondo es `#111111` (dark-base-secondary equivalente)
- **AND** tiene `min-height: 430px` en desktop, `580px` en mobile
- **AND** tiene `margin-bottom: 1.5rem`

#### Scenario: Footer en mobile
- **WHEN** la página renderiza en mobile (<768px)
- **THEN** el footer tiene `border-radius: 12px` (`rounded-xl`)
- **AND** el width es `calc(100% - 32px)` con `margin: 0 auto`
- **AND** el grid de columnas colapsa a 1 columna

#### Scenario: Footer links con hover naranja
- **WHEN** el usuario hace hover sobre un link del footer
- **THEN** el color cambia a `--accent-orange-hover` (#f97316) con underline-reveal
- **AND** la transición es `all 300ms ease-in-out`

### Requirement: Social Icons Refined Style
Los iconos sociales del footer MUST mostrarse como links de texto con separadores de coma entre ellos, siguiendo el patrón factory.ai (X, LinkedIn, GitHub) en lugar de iconos circulares.

#### Scenario: Social links estilo texto factory.ai
- **WHEN** los links sociales se renderizan en el footer
- **THEN** se muestran como texto (YouTube, Facebook, Instagram, Twitter) separados por comas
- **AND** cada link tiene hover naranja con underline-reveal
- **AND** no hay iconos circulares ni fondos — solo texto limpio
