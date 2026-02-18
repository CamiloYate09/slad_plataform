## ADDED Requirements

### Requirement: Image Optimization
All content images SHALL be served in WebP format with JPG fallback using `<picture>` elements. Images MUST be compressed to web-appropriate sizes: hero/background images under 200KB, card images under 100KB.

#### Scenario: WebP with fallback
- **WHEN** a modern browser loads a content image
- **THEN** the WebP version is served

#### Scenario: JPG fallback
- **WHEN** a browser without WebP support loads a content image
- **THEN** the compressed JPG version is served via `<img>` fallback

### Requirement: Lazy Loading
All images below the fold (outside initial viewport) SHALL use native `loading="lazy"` attribute. Only the hero section logo and first visible background image SHALL load eagerly.

#### Scenario: Below-fold images deferred
- **WHEN** the page initially loads
- **THEN** images in the features, courses, and footer sections are NOT fetched until the user scrolls near them

### Requirement: Reduced External Dependencies
The site SHALL minimize external CDN requests. The ScrollReveal library MUST be removed. Icon font (RemixIcon) SHALL remain as a CDN dependency. No more than 3 external CDN requests SHALL be made on page load.

#### Scenario: External request count
- **WHEN** the page loads
- **THEN** no more than 3 third-party CDN requests are initiated (Google Fonts, RemixIcon CSS, RemixIcon font file)

### Requirement: Dead Code Removal
Unused CSS rules, JS functions, and unreferenced image files MUST be removed. CSS rules for elements not present in the HTML (`.form-overlay`, `.form-container`, `.welcome-modal`) SHALL be deleted.

#### Scenario: No unused CSS selectors
- **WHEN** auditing the CSS file
- **THEN** every CSS selector matches at least one element in `index.html` or is a legitimate pseudo-element/state selector

### Requirement: Animation Performance
All animations SHALL use only `transform` and `opacity` properties to ensure GPU compositing. No animations SHALL modify `width`, `height`, `margin`, `padding`, or `top`/`left` properties.

#### Scenario: Compositor-friendly animations
- **WHEN** feature cards or course cards animate on scroll or hover
- **THEN** only `transform` and `opacity` CSS properties are transitioned
