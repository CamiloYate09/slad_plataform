## ADDED Requirements

### Requirement: Unified Animation System
The site SHALL use only CSS transitions/animations triggered by a single IntersectionObserver to animate elements on scroll. The system MUST NOT use multiple conflicting animation libraries or inline JS style overrides.

#### Scenario: Element enters viewport
- **WHEN** a `.feature-card`, `.course-card`, or `.newsletter-container` element enters the viewport (threshold 0.1)
- **THEN** the IntersectionObserver adds `.animate-in` class which triggers a CSS opacity + translateY transition

#### Scenario: No duplicate animation handlers
- **WHEN** the page loads
- **THEN** ScrollReveal library is NOT loaded and no inline JS hover transform handlers exist on feature cards

### Requirement: Fixed Asset References
All image and media references in the HTML MUST resolve to existing files on disk. No broken `src`, `srcset`, or `background-image` references SHALL exist.

#### Scenario: Slideshow images present
- **WHEN** the background slideshow cycles
- **THEN** all referenced images load successfully without 404 errors

#### Scenario: City card images present
- **WHEN** the Experiencias Destacadas section is visible
- **THEN** all three city card images (Bogota, Medellin, Cartagena) display correctly

### Requirement: Clean Data Attributes
The HTML MUST NOT contain redundant `data-text` attributes that duplicate visible text content. CSS `::before` pseudo-elements MUST NOT be used solely to duplicate existing text.

#### Scenario: Text elements without data-text
- **WHEN** inspecting any `h1`, `h2`, `h3`, `p`, or `a` element
- **THEN** the element does NOT have a `data-text` attribute mirroring its text content

### Requirement: Typography Hierarchy
The site SHALL use Public Sans as the primary font family (weights 300, 400) with a system font stack fallback. Body text MUST be 18px base size as defined in the style guide.

#### Scenario: Font loading
- **WHEN** the page loads
- **THEN** Public Sans is applied to body, headings, and UI elements
- **AND** the font stack includes sans-serif system fallbacks

### Requirement: Text Readability
All text MUST be rendered with a solid color (not gradient clipped) by default. Gradient text effects SHALL only be applied to the hero title `h1` and section titles `h2`.

#### Scenario: Body text is solid color
- **WHEN** viewing paragraph text, links, or card descriptions
- **THEN** text color is solid (white or appropriate contrast color), NOT transparent with gradient clip

#### Scenario: Hero title uses gradient
- **WHEN** viewing the hero section heading
- **THEN** the text displays the brand gradient effect
