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

// The hero column is hidden at 768px and below (style.css): its demo waits
// until the column shows
const hero = document.querySelector<HTMLElement>('[data-demo="hero"]')
if (hero) {
  const wide = window.matchMedia('(min-width: 769px)')
  let started = false
  const go = () => {
    if (started || !wide.matches) return
    started = true
    start(hero)
  }
  go()
  wide.addEventListener('change', go)
}

// The feature scenes sit further down: each loads as it nears the viewport
const below = document.querySelectorAll<HTMLElement>('[data-demo]:not([data-demo="hero"])')
if (below.length) {
  const near = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      near.unobserve(entry.target)
      start(entry.target as HTMLElement)
    }
  }, { rootMargin: '400px 0px' })
  below.forEach((el) => near.observe(el))
}
