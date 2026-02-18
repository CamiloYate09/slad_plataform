## Context
CityStream is a static vanilla HTML/CSS/JS landing page hosted on GitHub Pages. The previous redesign applied a dark theme but kept the original section layout. The user wants the page to match factory.ai's exact structure, font, and animations using external libraries — while remaining a static site with no build tools.

## Goals / Non-Goals
- Goals:
  - Match factory.ai's page structure (section order, layout, spacing)
  - Use the same font as factory.ai
  - Professional scroll animations via GSAP + ScrollTrigger
  - Orange accent hover effects matching factory.ai
  - 12-column responsive grid system
  - Card-style footer with rounded corners
  - Tabbed feature showcase
  - Logo/partners scrolling carousel
- Non-Goals:
  - Server-side rendering or Next.js migration
  - Build tools (Webpack, Vite)
  - Tailwind CSS (vanilla CSS only)
  - Interactive product demos (factory.ai has live terminal demos)
  - Blog/news with real CMS data
  - Dark/light theme toggle

## Decisions

### Decision 1: GSAP + ScrollTrigger from CDN
Load GSAP and ScrollTrigger from the official Cloudflare CDN (`cdnjs.cloudflare.com`).
- GSAP is free for non-commercial and commercial use (standard license)
- CDN provides reliable caching and no self-hosting complexity
- ScrollTrigger handles scroll-driven animations natively
- Alternatives considered: AOS (too simple, no timeline control), Locomotive Scroll (heavier, requires CSS changes), Framer Motion (React-only)

### Decision 2: CSS Grid 12-Column System (No Tailwind)
Implement a lightweight 12-column CSS Grid system using custom properties, matching factory.ai's `grid-cols-12 gap-x-6` pattern but in vanilla CSS.
- Use `display: grid; grid-template-columns: repeat(12, 1fr)` with `grid-column: span X` for placement
- Alternatives considered: CSS frameworks (Bootstrap grid — too heavy), Flexbox only (insufficient for complex layouts)

### Decision 3: Geist Sans from Google Fonts CDN
Load Geist Sans (confirmed as factory.ai's font: `--font-geist-sans`) from Google Fonts CDN with `display=swap`.
- Geist Sans is Vercel's open-source typeface, available on Google Fonts since 2024
- Weights needed: 300, 400, 500, 600, 700, 800 (matching factory.ai's usage)
- Use `font-display: swap` to prevent FOIT (Flash of Invisible Text)
- Alternatives considered: Self-hosted WOFF2 (unnecessary since Google Fonts hosts it), Inter (wrong font)

### Decision 4: Tabbed Feature Showcase with Vanilla JS
Build the tabbed product carousel using vanilla JavaScript with GSAP for transition animations.
- No framework needed for simple tab switching
- GSAP `gsap.to()` handles smooth content transitions between tabs
- Alternatives considered: Swiper.js (extra dependency), CSS-only tabs (limited animation control)

### Decision 5: Logo Carousel with CSS Animation
Build the "trusted by" scrolling carousel using pure CSS `@keyframes` infinite scroll.
- No JS needed for a simple horizontal scroll loop
- Use `animation: scroll Xs linear infinite` with duplicated logo set
- Alternatives considered: GSAP-powered scroll (overkill for linear movement), Splide.js (extra dependency)

### Decision 6: Orange Accent Color System
Add `--accent-orange-hover` (#f97316, matching factory.ai's `orange-500`) as the primary interactive color for link hovers and underline reveals.
- CityStream's existing `--accent-orange` (#d97706) is darker; factory.ai uses a brighter orange
- Keep CityStream brand colors for gradients and primary elements
- Use the brighter orange exclusively for hover states and interactive feedback

### Decision 7: Section Mapping (factory.ai → CityStream)
| factory.ai Section | CityStream Equivalent | Content |
|---|---|---|
| Navbar | Navbar | Logo, nav items, CTAs |
| Hero | Hero | "Conecta con tu Ciudad", subtitle, CTA |
| Trusted By | Partners/Aliados | Existing city images as scrolling carousel |
| Product Droids (tabs) | Features (tabs) | Ciudades, Eventos, Personas, Conciertos |
| Enterprise | Value Proposition | Why CityStream, security/trust messaging |
| News Cards | Experiences | Bogotá, Medellín, Cartagena cards |
| Footer | Footer | Same structure, enhanced styling |

## Risks / Trade-offs
- **GSAP bundle size** (~56KB gzipped total): Acceptable for the animation quality gained. GSAP CDN is highly cached globally.
- **Complete rewrite risk**: All three source files change entirely. Git provides rollback safety.
- **Geist Sans availability**: Confirmed available on Google Fonts CDN. No risk.
- **Carousel images**: Using existing city images (1.jpg, 5.jpg, 7.jpg, 8.jpg) for the trusted-by carousel — no new assets needed.

## Resolved Questions
- [x] Font: Geist Sans (confirmed via factory.ai CSS: `--font-geist-sans`)
- [x] Carousel logos: Use existing city images from `static/img/`
- [x] Newsletter replacement: Replace with value proposition section (user confirmed)
