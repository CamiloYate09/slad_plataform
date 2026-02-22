# Proposal: add-hero-particle-grid

**Change ID:** add-hero-particle-grid
**Date:** 2026-02-22
**Status:** approved

## Objetivo

Añadir una animación de grid de nodos interactivos al hero de CityStream, inspirada en el hero de factory.ai: puntos/nodos que se mueven lentamente con líneas que los conectan, creando una visualización de red dinámica.

## Contexto

Tras la investigación de factory.ai (2026-02-22), se identificó que su hero usa Canvas 2D puro para una animación de nodos conectados. La brecha principal entre CityStream y factory.ai es esta animación de fondo. tsParticles (MIT) replica el efecto con configuración JSON sin código Canvas custom.

## Alcance

- Añadir tsParticles CDN v2.12.0 a `index.html`
- Añadir `<div id="hero-particles">` dentro de `.hero`
- CSS: posicionado absoluto, detrás del contenido del hero (z-index 0)
- JS: inicializar tsParticles con config de nodos + líneas, colores del design system (naranja CityStream + neutros)
- Adaptar colores para light/dark theme
- Respetar `prefers-reduced-motion`: desactivar movimiento si el usuario lo prefiere
- Responsive: reducir cantidad de partículas en mobile

## Fuera de alcance

- Animación Canvas 2D custom (tsParticles es suficiente)
- Interacción click (solo hover repulse)
- WebGL / Three.js
