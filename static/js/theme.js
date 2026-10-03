// Tema dark/light compartido por todas las paginas.
// Se carga sin `defer` justo despues de <body> para que la clase quede
// aplicada antes del primer paint (si no, hay flash oscuro en light).
// El listener va delegado en document porque el boton todavia no existe
// cuando corre este script.
(function () {
  var KEY = 'citystream-theme';

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  var saved = stored();
  if (saved === 'light' ||
      (!saved && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    document.body.classList.add('light-theme');
  }

  function applyTheme() {
    var isLight = document.body.classList.toggle('light-theme');
    try { localStorage.setItem(KEY, isLight ? 'light' : 'dark'); } catch (e) {}
    // main.js escucha esto para repintar lo que no puede hacer solo con CSS
    // (chars del hero con background inline, canvas de particulas).
    document.dispatchEvent(new CustomEvent('themechange', { detail: { isLight: isLight } }));
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.theme-toggle');
    if (!btn) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced && document.startViewTransition) {
      var rect = btn.getBoundingClientRect();
      var root = document.documentElement.style;
      root.setProperty('--vt-origin-x', Math.round(rect.left + rect.width / 2) + 'px');
      root.setProperty('--vt-origin-y', Math.round(rect.top + rect.height / 2) + 'px');
      document.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  });
})();
