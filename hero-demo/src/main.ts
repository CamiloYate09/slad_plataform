// Entry loaded by index.html. The hero column is hidden at 768px and below
// (style.css), so React and the demo are only fetched once it can be seen.
const host = document.getElementById('hero-demo')
const wide = window.matchMedia('(min-width: 769px)')
let started = false

function start() {
  if (started || !host) return
  started = true
  import('./mount').then(({ mount }) => mount(host))
}

if (host) {
  if (wide.matches) start()
  else wide.addEventListener('change', (e) => e.matches && start())
}
