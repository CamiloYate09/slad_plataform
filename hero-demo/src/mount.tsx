import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CityStreamHero from './CityStreamHero'

export function mount(host: HTMLElement) {
  createRoot(host).render(
    <StrictMode>
      <CityStreamHero />
    </StrictMode>,
  )
  host.dataset.ready = ''
}
