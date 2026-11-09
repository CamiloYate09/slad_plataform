import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'

export function mount(host: HTMLElement, Scene: ComponentType) {
  createRoot(host).render(
    <StrictMode>
      <Scene />
    </StrictMode>,
  )
  host.dataset.ready = ''
}
