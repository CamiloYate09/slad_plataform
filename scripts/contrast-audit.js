// Auditor de contraste WCAG AA. Pegar en la consola del navegador, en la
// pagina y el tema que se quieran revisar. Devuelve los textos que no
// llegan al minimo (4.5:1, o 3:1 si el texto es grande).
// Ojo: hay que cargar la pagina ya en el tema a auditar, no alternar la
// clase en caliente — getComputedStyle devuelve valores a medio camino
// mientras corre la transicion y reporta falsos positivos.
// Los textos sobre gradiente o imagen se omiten: no hay un color de fondo
// unico contra el que medir.
(() => {
  const px = c => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : null; };
  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const over = (fg, bg) => { const a = fg[3] === undefined ? 1 : fg[3]; return [0, 1, 2].map(i => fg[i] * a + bg[i] * (1 - a)); };
  const ratio = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

  const bgOf = el => {
    let stack = [], n = el;
    while (n && n !== document.documentElement) {
      const s = getComputedStyle(n);
      if (s.backgroundImage !== 'none') return null;
      const c = px(s.backgroundColor);
      if (c && (c[3] === undefined || c[3] > 0)) { stack.push(c); if ((c[3] ?? 1) >= 1) break; }
      n = n.parentElement;
    }
    const bs = px(getComputedStyle(document.body).backgroundColor);
    let base = (bs && (bs[3] ?? 1) >= 1) ? bs : [250, 250, 250];
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  };

  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
    const txt = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim())
      .map(n => n.textContent.trim()).join(' ');
    if (!txt) continue;
    const s = getComputedStyle(el);
    if (s.color === 'rgba(0, 0, 0, 0)' || +s.opacity === 0 || s.visibility === 'hidden') continue;
    const bg = bgOf(el);
    if (!bg) continue;
    const r = ratio(over(px(s.color), bg), bg);
    const size = parseFloat(s.fontSize), bold = +s.fontWeight >= 700;
    const need = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5;
    if (r < need) out.push({ sel: el.tagName.toLowerCase() + '.' + [...el.classList].join('.'), txt: txt.slice(0, 40), ratio: +r.toFixed(2), need });
  }
  return {
    pagina: location.pathname,
    tema: document.body.classList.contains('light-theme') ? 'light' : 'dark',
    fallos: out.sort((a, b) => a.ratio - b.ratio)
  };
})()
