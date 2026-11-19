// ============================================
// BLOG — lo más relevante primero, filtro por ciudad y cuenta atrás
// El HTML ya trae todo en orden de relevancia (el primer <article> abre la
// portada); sin JS se ve así. Aquí solo se baja lo que ya terminó, se reparte
// quién es destacado y se filtra por ciudad.
// ============================================
(() => {
  const grid = document.querySelector('.blog-grid');
  if (!grid) return;

  const DAY = 864e5;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const at = (iso) => new Date(`${iso}T00:00:00`);

  // Terminado: la fecha de fin ya pasó. Los eventos "por confirmar" no tienen fecha.
  const posts = [...grid.querySelectorAll('.blog-post')];
  posts.forEach((post) => {
    const end = post.dataset.end || post.dataset.date;
    post.classList.toggle('is-past', Boolean(end) && at(end) < today);
  });
  // sort es estable: dentro de cada grupo se respeta el orden del HTML
  const ranked = [...posts].sort((a, b) => a.classList.contains('is-past') - b.classList.contains('is-past'));
  ranked.forEach((post) => grid.appendChild(post));

  // Los tres primeros visibles son destacados y el primero, el principal
  let city = 'Todas';
  function render() {
    let shown = 0;
    ranked.forEach((post) => {
      const visible = city === 'Todas' || post.dataset.city === city;
      post.hidden = !visible;
      post.classList.toggle('is-hero', visible && shown < 3);
      post.classList.toggle('is-main', visible && shown === 0);
      if (visible) shown += 1;
    });
  }

  const filter = document.querySelector('.blog-filter');
  if (filter) {
    ['Todas', ...new Set(posts.map((post) => post.dataset.city))].forEach((name) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = name;
      button.setAttribute('aria-pressed', String(name === city));
      button.addEventListener('click', () => {
        city = name;
        filter.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
        render();
      });
      filter.appendChild(button);
    });
    filter.hidden = false;
  }
  render();

  // Próximas fechas: cuenta atrás de lo que tiene fecha cierta
  document.querySelectorAll('.blog-rank li[data-date]').forEach((item) => {
    const when = item.querySelector('.blog-rank__when');
    const days = Math.ceil((at(item.dataset.date) - today) / DAY);
    if (days > 0) when.textContent = `${when.textContent} · Faltan ${days} ${days === 1 ? 'día' : 'días'}`;
    else if (at(item.dataset.end) >= today) when.textContent = `${when.textContent} · En curso`;
    else when.textContent = `${when.textContent} · Terminó`;
  });
})();
