## ADDED Requirements

### Requirement: Mobile-First Breakpoint System
The CSS SHALL follow a mobile-first approach with breakpoints at: 480px (small mobile), 768px (tablet), 1024px (desktop), 1440px (large desktop), 1920px (ultra-wide). Base styles MUST target mobile screens first.

#### Scenario: Mobile base styles
- **WHEN** viewing the site at 375px width
- **THEN** all content is single-column, readable, and no horizontal scroll exists

#### Scenario: Tablet layout
- **WHEN** viewing the site between 768px and 1023px
- **THEN** feature cards display in a 2-column grid and navigation is appropriately sized

#### Scenario: Desktop layout
- **WHEN** viewing the site at 1440px
- **THEN** feature cards display in a 4-column grid, content is centered with max-width, and all sections have appropriate spacing

### Requirement: Responsive Navigation
The navigation SHALL be fully functional on all screen sizes. On mobile (below 768px), the navigation MUST use a hamburger menu pattern or simplified horizontal layout that does not overflow.

#### Scenario: Mobile navigation
- **WHEN** viewing the site below 768px
- **THEN** navigation links are accessible without horizontal overflow and text is readable

### Requirement: Responsive Images
Background slideshow images SHALL use CSS `object-fit: cover` to fill their container without distortion at all viewport sizes. Card images SHALL maintain aspect ratio across breakpoints.

#### Scenario: Slideshow fills viewport
- **WHEN** viewing the background slideshow at any viewport size
- **THEN** the image covers the full viewport without distortion or empty space

#### Scenario: Card images maintain ratio
- **WHEN** resizing the browser from mobile to desktop
- **THEN** course card images maintain their aspect ratio and do not stretch or pixelate

### Requirement: Responsive Typography
Font sizes SHALL scale fluidly using `clamp()` functions. No text SHALL overflow its container or become unreadable at any supported viewport width (320px to 2560px).

#### Scenario: No text overflow
- **WHEN** viewing the site at 320px minimum width
- **THEN** no text overflows horizontally and all headings wrap appropriately

### Requirement: Responsive Form
The newsletter form SHALL stack its input and button vertically on mobile (below 480px) and display inline on tablet and above. The input MUST be full-width on mobile.

#### Scenario: Mobile form layout
- **WHEN** viewing the newsletter section below 480px
- **THEN** the email input and submit button are stacked vertically, each full-width

#### Scenario: Desktop form layout
- **WHEN** viewing the newsletter section above 768px
- **THEN** the email input and submit button are side-by-side in a single row

### Requirement: Touch-Friendly Targets
All interactive elements (links, buttons, form inputs) SHALL have a minimum touch target size of 44x44px on mobile devices as per WCAG 2.5.5.

#### Scenario: Button tap targets
- **WHEN** inspecting CTA buttons on a 375px viewport
- **THEN** each button has at least 44px height and adequate horizontal padding
