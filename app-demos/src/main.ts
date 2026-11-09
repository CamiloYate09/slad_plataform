// Entry loaded by index.html. Every [data-demo] element gets its scene,
// fetched only when it can be seen: React and the scenes stay off the
// network until then.
import type { ComponentType } from 'react'

const scenes: Record<string, () => Promise<{ default: ComponentType }>> = {
  hero: () => import('./hero/CityStreamHero'),
  ciudades: () => import('./pillars/Ciudades'),
  eventos: () => import('./pillars/Eventos'),
  personas: () => import('./pillars/Personas'),
  conciertos: () => import('./pillars/Conciertos'),
}

async function start(host: HTMLElement) {
  const load = scenes[host.dataset.demo ?? '']
  if (!load) return
  const [{ mount }, { default: Scene }] = await Promise.all([import('./mount'), load()])
  mount(host, Scene)
}

// The page's own first paint comes first: no scene is fetched until the page
// has loaded and the browser is idle, so React never competes with the
// hero's text and logo (on a phone the hero's phone is in the first screen)
function afterLoad(run: () => void) {
  const idle = () => (window.requestIdleCallback ? window.requestIdleCallback(run, { timeout: 2000 }) : setTimeout(run, 200))
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
}

// Then each scene loads as it nears the viewport: the hero at once, the
// feature scenes as they are scrolled to
const demos = document.querySelectorAll<HTMLElement>('[data-demo]')
if (demos.length) afterLoad(() => {
  const near = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      near.unobserve(entry.target)
      start(entry.target as HTMLElement)
    }
  }, { rootMargin: '400px 0px' })
  demos.forEach((el) => near.observe(el))
})
