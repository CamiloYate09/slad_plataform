## ADDED Requirements

### Requirement: Structured Data
The page SHALL include JSON-LD structured data in the `<head>` section with `Organization` and `WebSite` schema types containing the site name, URL, logo, social media profiles, and search action.

#### Scenario: Google Rich Results validation
- **WHEN** the page is tested with Google Rich Results Test
- **THEN** the `Organization` and `WebSite` structured data is detected without errors

### Requirement: Sitemap
The project SHALL include a `sitemap.xml` file at the root directory listing all public URLs with `<lastmod>`, `<changefreq>`, and `<priority>` values.

#### Scenario: Sitemap accessible
- **WHEN** a search engine crawler requests `/sitemap.xml`
- **THEN** a valid XML sitemap is returned listing `https://citystream.co/` as the main entry

### Requirement: Robots.txt
The project SHALL include a `robots.txt` file at the root directory allowing all crawlers and referencing the sitemap URL.

#### Scenario: Robots.txt configuration
- **WHEN** a crawler requests `/robots.txt`
- **THEN** the response allows all user-agents and includes `Sitemap: https://citystream.co/sitemap.xml`

### Requirement: Canonical URL
The page SHALL include a `<link rel="canonical">` tag pointing to `https://citystream.co/`.

#### Scenario: Canonical tag present
- **WHEN** inspecting the page `<head>`
- **THEN** a `<link rel="canonical" href="https://citystream.co/">` element exists

### Requirement: Optimized Page Title
The page title SHALL be concise, keyword-rich, and under 60 characters. The title MUST include the brand name and primary value proposition.

#### Scenario: Title tag format
- **WHEN** inspecting the page `<title>` element
- **THEN** the content is `CityStream - La Red Social de Colombia` or similar (under 60 chars)

### Requirement: Complete Open Graph Tags
The page SHALL include all essential Open Graph meta tags: `og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `og:locale`, `og:site_name`. The `og:image` MUST reference a properly sized social sharing image (1200x630px recommended).

#### Scenario: Social sharing preview
- **WHEN** the page URL is shared on Facebook or LinkedIn
- **THEN** a rich preview card is displayed with title, description, and image

### Requirement: Copyright Year
The footer copyright text SHALL display the current year dynamically or be updated to 2026.

#### Scenario: Copyright displays current year
- **WHEN** viewing the footer
- **THEN** the copyright text reads "Copyright 2026 CityStream. Todos los derechos reservados."
