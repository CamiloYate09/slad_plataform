/* ============================================
   PORTADAS PROPIAS DEL BLOG
   Dibuja con código la portada de cada artículo (ondas en SVG), en lugar de
   usar fotos o carteles de terceros. Es determinista: la semilla sale del
   título, así que el mismo artículo da siempre el mismo arte. Sin dependencias.
   La categoría elige la paleta y la ciudad la desplaza un poco.
   Autoría y licencia: por definir (ver openspec/research/animaciones-propias-blog.md).
   Sin JS, o si falla este archivo, el recuadro queda con el degradado de marca.
   ============================================ */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const TAU = Math.PI * 2;

  // Hash de texto (FNV-1a) y generador con semilla (mulberry32)
  const hash = (text) => {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  const seeded = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Tonos (HSL) por categoría; la ciudad los desplaza unos grados
  const PALETTES = { 'Música': [275, 190], 'Cultura': [225, 165], 'Festival': [335, 35], 'Al aire libre': [150, 195], 'Comida': [20, 305] };
  const CITY_SHIFT = { 'Bogotá': 0, 'Medellín': 14, 'Cartagena': -14 };
  const hue = (h) => (h + 360) % 360;
  const hsl = (h, s, l, a = 1) => `hsl(${h.toFixed(0)} ${s}% ${l}% / ${a})`;
  const mix = (a, b, t) => a + (b - a) * t;

  const el = (tag, attrs, parent) => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    if (parent) parent.appendChild(node);
    return node;
  };

  let ids = 0;
  function draw(post) {
    const box = post.querySelector('.blog-post__img');
    const category = post.querySelector('.blog-chip');
    if (!box || !category) return;

    const rnd = seeded(hash(post.querySelector('.blog-post__title').textContent.trim().toLowerCase()));
    const [a, b] = PALETTES[category.textContent.trim()] || [262, 190];
    const shift = CITY_SHIFT[post.dataset.city] || 0;
    const h1 = hue(a + shift), h2 = hue(b + shift);

    const cover = document.createElement('div');
    cover.className = 'blog-cover';
    cover.setAttribute('aria-hidden', 'true');
    const svg = el('svg', { viewBox: '0 0 160 100', preserveAspectRatio: 'xMidYMid slice', focusable: 'false' }, cover);

    const gradient = `blog-cover-${ids++}`;
    const defs = el('defs', {}, svg);
    const sky = el('linearGradient', { id: gradient, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el('stop', { offset: 0, 'stop-color': hsl(h1, 70, 14) }, sky);
    el('stop', { offset: 1, 'stop-color': hsl(h2, 65, 24) }, sky);
    el('rect', { width: 160, height: 100, fill: `url(#${gradient})` }, svg);

    const sun = el('circle', { cx: 25 + rnd() * 110, cy: 18 + rnd() * 18, r: 7 + rnd() * 9, fill: hsl(h2, 90, 72, 0.85), class: 'blog-cover__sun' }, svg);
    sun.style.setProperty('--t', `${9 + rnd() * 6}s`);

    // Capas de ola periódicas (160 unidades): al desplazarlas una vuelta exacta el bucle no se nota
    const layers = 5;
    for (let i = 0; i < layers; i++) {
      const base = 38 + i * 11;
      const amplitude = 2.5 + rnd() * 5;
      const f1 = 1 + Math.floor(rnd() * 3), f2 = 2 + Math.floor(rnd() * 3);
      const p1 = rnd() * TAU, p2 = rnd() * TAU;
      let d = '';
      for (let x = 0; x <= 320; x += 4) {
        const y = base + amplitude * Math.sin((f1 * TAU * x) / 160 + p1) + amplitude * 0.5 * Math.sin((f2 * TAU * x) / 160 + p2);
        d += `${x ? 'L' : 'M'}${x} ${y.toFixed(1)}`;
      }
      const wave = el('path', { d: `${d}L320 100L0 100Z`, fill: hsl(mix(h1, h2, i / (layers - 1)), 75, 22 + i * 8, 0.92), class: 'blog-cover__wave' }, svg);
      wave.style.setProperty('--t', `${22 - i * 3}s`);
      wave.style.setProperty('--dir', i % 2 ? 'reverse' : 'normal');
    }

    box.replaceChildren(cover);
    return cover;
  }

  const covers = [...document.querySelectorAll('.blog-post')].map(draw).filter(Boolean);

  // Fuera de pantalla las ondas se detienen: no gastan CPU ni GPU
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-paused', !entry.isIntersecting));
    }, { rootMargin: '80px' });
    covers.forEach((cover) => io.observe(cover));
  }
})();
