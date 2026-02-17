# Change: Rebuild CityStream with factory.ai Identical Structure

## Why
The previous redesign applied factory.ai's visual theme (dark background, Inter font, card styles) but kept CityStream's original section layout. The result looks dark and modern but doesn't match factory.ai's page organization, typography, or animation quality. The goal is to reach parity with factory.ai's exact page structure, font, scroll animations (using GSAP + ScrollTrigger), and element organization — while keeping CityStream's brand identity and content.

## What Changes
- **Font**: Replace Inter with Geist Sans (confirmed: factory.ai uses `--font-geist-sans` via Vercel's Geist typeface)
- **Animation engine**: Replace IntersectionObserver-based CSS transitions with GSAP + ScrollTrigger for professional scroll-driven animations
- **Page structure**: Complete reorganization to match factory.ai's section flow:
  1. Sticky navbar with nav items + CTA buttons (factory.ai pattern)
  2. Hero with large headline, subtitle, CTA, and animated progress element
  3. "Trusted by" / partners logo carousel section (new)
  4. Tabbed product feature showcase (replaces current feature cards grid)
  5. Value proposition section with two-column layout (new, replaces newsletter)
  6. Experience cards grid with tags (restructured from current courses section)
  7. Card-style rounded footer (enhanced from current)
- **Hover effects**: Orange accent color on link hover with underline-reveal animation (factory.ai signature)
- **Layout**: max-width 1920px, 12-column grid, generous padding (px-4 mobile, px-9 desktop)
- **Navigation**: Add more nav items, add CTA buttons in nav, factory.ai-identical sticky behavior

## Impact
- Affected specs: `visual-theme`, `layout-animations`, `header-footer` (all MODIFIED), `page-structure` (new ADDED)
- Affected code: `index.html` (complete restructure), `static/css/style.css` (complete rewrite), `static/js/main.js` (GSAP replaces IntersectionObserver)
- **BREAKING**: All current CSS class names and HTML structure will change
- New external dependencies: GSAP (~44KB gzipped), ScrollTrigger plugin (~12KB gzipped), Geist Sans font (Google Fonts CDN)
- Removed dependencies: IntersectionObserver-based animation system
