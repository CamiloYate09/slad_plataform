## 1. Foundation & Dependencies
- [x] 1.1 Add GSAP CDN link (`gsap.min.js` + `ScrollTrigger.min.js`) to index.html before main.js
- [x] 1.2 Replace Inter Google Fonts import with Geist Sans (`family=Geist:wght@100..900`) in style.css and update `font-family` to `"Geist", sans-serif`

## 2. CSS Architecture Rewrite
- [x] 2.1 Define new CSS custom properties: 12-column grid, factory.ai spacing tokens, orange hover accent
- [x] 2.2 Build reusable 12-column grid system (`.grid-12`, `.col-span-*` utility classes)
- [x] 2.3 Rewrite typography scale to match factory.ai sizing (14px body, larger headings)
- [x] 2.4 Define new color variables: `--accent-orange-hover: #f97316`, `--border-base: rgba(255,255,255,0.08)`
- [x] 2.5 Build new button styles: primary solid + secondary outline with factory.ai sizing
- [x] 2.6 Remove all old IntersectionObserver animation CSS (`.animate-on-scroll`, `.animate-in`, stagger delays)

## 3. HTML Structure Rebuild
- [x] 3.1 Restructure navbar: add all nav items (Características, Experiencias, Contacto), add CTA buttons (Comenzar, Contacto)
- [x] 3.2 Rebuild hero section: large centered headline, subtitle paragraph, single primary CTA, progress bar animation element
- [x] 3.3 Create "Aliados" / trusted-by section with scrolling carousel using existing city images from `static/img/` (duplicate for infinite scroll)
- [x] 3.4 Create tabbed features section: 4 tabs (Ciudades, Eventos, Personas, Conciertos) with content panels and demo area
- [x] 3.5 Create value proposition section: two-column layout with headline, body text, and CTA links
- [x] 3.6 Restructure experiences section: card grid with tags (Ciudad, Innovación, Patrimonio), "Más experiencias" CTA
- [x] 3.7 Enhance footer: maintain card style, add factory.ai column structure, comma-separated social links

## 4. CSS Section Styling
- [x] 4.1 Style navbar: sticky, border-bottom, factory.ai padding (`px-4` mobile / `px-9` desktop), transition-disable on load
- [x] 4.2 Style hero: generous vertical spacing, centered text, progress loader keyframes
- [x] 4.3 Style trusted-by carousel: `overflow: hidden`, CSS `@keyframes scroll` infinite horizontal animation
- [x] 4.4 Style tabbed features: tab buttons, active state indicator, content panels with smooth transitions
- [x] 4.5 Style value proposition: two-column grid (7fr/5fr), comfortable reading width
- [x] 4.6 Style experience cards: tag badges, image wrappers, hover effects with orange accent
- [x] 4.7 Style footer card: `rounded-3xl` (24px), dark secondary background, `min-h: 430px` desktop, `calc(100% - 72px)` width
- [x] 4.8 Style link hover effects: orange color + underline-reveal (`after:w-0 → after:w-full`, 300ms ease-in-out)

## 5. JavaScript: GSAP Animations
- [x] 5.1 Initialize GSAP and register ScrollTrigger plugin
- [x] 5.2 Create hero entrance animation: timeline with staggered text + CTA fade-in/slide-up
- [x] 5.3 Create scroll-triggered section reveals: `gsap.from()` with ScrollTrigger for each section
- [x] 5.4 Create staggered card animations: `.exp-card` with stagger delays
- [x] 5.5 Create tab switching logic: click handler + GSAP content panel transitions (fade/slide)
- [x] 5.6 Implement progress bar animation on hero (CSS keyframes)
- [x] 5.7 Implement navbar scroll behavior (scroll event listener, transparent → solid)
- [x] 5.8 Remove all IntersectionObserver code from main.js
- [x] 5.9 Add `prefers-reduced-motion` check: disable GSAP animations when user prefers reduced motion

## 6. Responsive Design
- [x] 6.1 Mobile navbar: hamburger menu with slide-in panel (preserved existing pattern)
- [x] 6.2 Mobile grid: collapse grids to 1-col/2-col at breakpoints (768px, 480px)
- [x] 6.3 Mobile hero: reduced font sizes, stacked CTA buttons
- [x] 6.4 Mobile trusted-by: carousel speed unchanged (CSS handles it)
- [x] 6.5 Mobile tabs: horizontal scroll tab buttons with hidden scrollbar
- [x] 6.6 Mobile footer: reduced border-radius (12px vs 24px), smaller margins (`calc(100% - 32px)`)
- [x] 6.7 Mobile experience cards: single column stack

## 7. Validation & Polish
- [x] 7.1 Cross-validate all CSS selectors against HTML classes — zero mismatches
- [x] 7.2 Cross-validate all JS selectors against DOM elements — zero mismatches
- [x] 7.3 Verify GSAP animations configured correctly (hero timeline, scroll reveals, tab transitions)
- [x] 7.4 Verify `prefers-reduced-motion` disables all animations (CSS + JS guard)
- [x] 7.5 Mobile hamburger menu preserved with updated selectors
- [x] 7.6 GSAP CDN links added (cdnjs.cloudflare.com, reliable CDN)
- [x] 7.7 Lighthouse: GSAP loaded from bottom of body (non-blocking), Geist has font-display: swap
- [x] 7.8 Update `openspec/project.md` to reflect new dependencies (GSAP, Geist Sans)

## 8. Spec Alignment
- [x] 8.1 Verify implementation against all `visual-theme` requirements (Geist Sans, #0a0a0a base, brand colors preserved, --accent-orange-hover added)
- [x] 8.2 Verify implementation against all `layout-animations` requirements (GSAP + ScrollTrigger, 300ms orange underline, card hover -4px)
- [x] 8.3 Verify implementation against all `header-footer` requirements (sticky navbar, footer card calc(100%-72px), text social links)
- [x] 8.4 Verify implementation against all `page-structure` requirements (7 sections in order, carousel, tabs, value-prop, experience tags)
