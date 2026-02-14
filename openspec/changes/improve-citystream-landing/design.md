## Context
CityStream es una landing page estatica (HTML/CSS/JS vanilla) desplegada en GitHub Pages en citystream.co. El sitio tiene una sola pagina (`index.html`) con secciones hero, features, experiencias destacadas, newsletter y footer. La audiencia objetivo es Colombia y el contenido esta en espanol.

Stakeholders: equipo de CityStream, usuarios potenciales en Colombia.
Constraints: sitio estatico sin backend (GitHub Pages), sin build tools actuales, presupuesto de hosting limitado.

## Goals / Non-Goals

### Goals
- Reducir tiempo de carga a menos de 3s en 3G (actualmente las imagenes solas pesan ~11MB)
- Alcanzar puntuacion Lighthouse Performance > 80, SEO > 90, Accessibility > 85
- Responsive funcional en dispositivos de 320px a 2560px
- SEO tecnico completo para indexacion en Google Colombia
- Interfaz limpia sin conflictos visuales ni animaciones rotas

### Non-Goals
- No se agregara un sistema de build (webpack, vite, etc) en esta iteracion
- No se crearan paginas adicionales (solo mejoras a index.html)
- No se implementara funcionalidad backend para el newsletter
- No se migrara a un framework JS (React, Vue, etc)
- No se cambiara el hosting de GitHub Pages

## Decisions

### 1. Sistema de Animaciones: Solo CSS + IntersectionObserver nativo
- **Decision**: Eliminar ScrollReveal (CDN externo) y el hover handler inline de JS. Usar solo CSS transitions/animations + IntersectionObserver nativo con clase `.animate-in`.
- **Alternativas**: Mantener ScrollReveal (agrega 15KB + request HTTP), usar GSAP (overkill para esta pagina), Web Animations API (soporte limitado).
- **Razon**: Reduce dependencias externas, elimina conflictos entre 3 sistemas de animacion, mejora rendimiento.

### 2. Formato de Imagenes: WebP con fallback JPG
- **Decision**: Convertir imagenes a WebP y usar `<picture>` con fallback JPG para navegadores legacy.
- **Alternativas**: Solo JPG comprimido (peor compresion), AVIF (soporte aun limitado en Colombia), solo WebP (sin fallback).
- **Razon**: WebP ofrece 25-35% mejor compresion que JPG con calidad equivalente. El `<picture>` element ya esta parcialmente usado en el slideshow.

### 3. Tipografia: Public Sans como font principal
- **Decision**: Aplicar Public Sans (ya importado) como font principal del sitio, con Noto Sans JP como fallback para caracteres especiales.
- **Alternativas**: Solo Noto Sans JP (actual, pero es una fuente japonesa usada en sitio colombiano), solo system fonts (sin identidad visual).
- **Razon**: El style-guide define Public Sans como la fuente del proyecto. Es una fuente neutral y legible, adecuada para una red social.

### 4. Datos Estructurados: JSON-LD Organization + WebSite
- **Decision**: Agregar schema.org JSON-LD con tipos `Organization` y `WebSite` en el `<head>`.
- **Alternativas**: Microdata (mas verboso, mezcla datos con HTML), RDFa (menos adoptado).
- **Razon**: JSON-LD es el formato recomendado por Google, facil de mantener y no interfiere con el HTML.

## Risks / Trade-offs
- **Conversion WebP manual**: Sin build tools, las imagenes WebP deben generarse manualmente. Se proporcionaran instrucciones claras.
  - Mitigacion: Documentar proceso de conversion. Usar herramientas CLI como `cwebp`.
- **Eliminacion de ScrollReveal**: Las animaciones de entrada seran mas simples.
  - Mitigacion: Replicar efectos principales (fade-in, slide-up) con CSS puro.
- **Sin sistema de build**: CSS/JS no se minificaran automaticamente.
  - Mitigacion: Minificar manualmente o agregar un script npm basico en el futuro.

## Open Questions
- Quiere el equipo generar imagenes responsive (mobile/tablet) o prefiere usar la misma imagen con CSS `object-fit`?
- Hay algun servicio de newsletter (Mailchimp, SendGrid) que se vaya a integrar en el formulario?
