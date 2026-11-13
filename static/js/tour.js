/* Tour guiado — resalta botones clave con una tarjeta de descripción.
   Inspirado en el "tour" casero de openalert.site (spotlight, sin
   dependencias externas). Solo arranca desde el botón "?" de la barra: si se
   abriera solo, taparía el hero a todo visitante nuevo. */
(() => {
  const steps = [
    {
      selector: '.theme-toggle',
      title: 'Cambia el tema',
      body: 'Alterna entre modo oscuro y claro. Tu preferencia se guarda automáticamente.',
    },
    {
      selector: '#features .section-header',
      title: 'Explora las funcionalidades',
      body: 'Ciudades, eventos, conciertos, avisos y personas: cada tarjeta muestra cómo se ve esa parte de la app.',
    },
    {
      selector: '.hero-actions .signup-capture',
      title: 'Crea tu cuenta',
      body: 'Escribe tu correo y sigue con el registro: el correo ya va puesto. Es gratis.',
    },
  ];

  let overlay, spot, card;
  let active = [];
  let index = 0;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    spot = document.createElement('div');
    spot.className = 'tour-spot';

    card = document.createElement('div');
    card.className = 'tour-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.innerHTML = `
      <button class="tour-close" aria-label="Cerrar tutorial" title="Cerrar tutorial">
        <i class="ri-close-line" aria-hidden="true"></i>
      </button>
      <p class="tour-count"></p>
      <h3 class="tour-title"></h3>
      <p class="tour-body"></p>
      <div class="tour-actions">
        <button class="tour-btn tour-btn--ghost" data-action="prev">Atrás</button>
        <button class="tour-btn tour-btn--primary" data-action="next">Siguiente</button>
      </div>
    `;

    overlay.appendChild(spot);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    card.querySelector('.tour-close').addEventListener('click', end);
    card.querySelector('[data-action="prev"]').addEventListener('click', () => go(index - 1));
    card.querySelector('[data-action="next"]').addEventListener('click', () => {
      if (index === active.length - 1) end();
      else go(index + 1);
    });
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') end();
  }

  function isVisible(el) {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function go(i) {
    index = i;
    const step = active[index];
    const target = step.el;
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    // deja que el scroll suave termine antes de posicionar
    setTimeout(() => {
      card.querySelector('.tour-count').textContent = `Paso ${index + 1} de ${active.length}`;
      card.querySelector('.tour-title').textContent = step.title;
      card.querySelector('.tour-body').textContent = step.body;
      card.querySelector('[data-action="prev"]').style.visibility = index === 0 ? 'hidden' : 'visible';
      card.querySelector('[data-action="next"]').textContent = index === active.length - 1 ? 'Entendido' : 'Siguiente';
      reposition();
    }, 260);
  }

  function reposition() {
    if (!active.length) return;
    const target = active[index].el;
    const r = target.getBoundingClientRect();
    const pad = 6;
    // transform y no top/left: ver el comentario de .tour-spot en style.css (CLS)
    spot.style.transform = `translate(${r.left - pad}px, ${r.top - pad}px)`;
    spot.style.width = `${r.width + pad * 2}px`;
    spot.style.height = `${r.height + pad * 2}px`;

    const cardRect = card.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const top = spaceBelow > cardRect.height + 24
      ? r.bottom + 16
      : Math.max(16, r.top - cardRect.height - 16);
    const left = Math.min(
      Math.max(16, r.left),
      window.innerWidth - cardRect.width - 16
    );
    card.style.transform = `translate(${left}px, ${top}px)`;
  }

  function end() {
    if (overlay) overlay.remove();
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', reposition);
    window.removeEventListener('scroll', reposition, true);
    overlay = null;
    active = [];
  }

  function start() {
    active = steps
      .map((step) => ({ ...step, el: document.querySelector(step.selector) }))
      .filter((step) => step.el && isVisible(step.el));
    if (!active.length) return;
    build();
    go(0);
  }

  window.CityStreamTour = { start };

  const replayBtn = document.getElementById('tour-replay');
  if (replayBtn) replayBtn.addEventListener('click', start);
})();
