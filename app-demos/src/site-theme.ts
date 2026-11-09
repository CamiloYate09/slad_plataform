import { useSyncExternalStore } from 'react'
import type { Theme } from '../kit/looks'

// The site is dark unless theme.js puts .light-theme on <body> (the visitor's
// preference or the toggle). The scenes follow it, live, so the app on the
// phone matches the page around it.
function subscribe(onChange: () => void) {
  const watch = new MutationObserver(onChange)
  watch.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  return () => watch.disconnect()
}

const read = (): Theme => (document.body.classList.contains('light-theme') ? 'light' : 'dark')

export function useSiteTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => 'light')
}
