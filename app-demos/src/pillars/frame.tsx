import type { ReactNode } from 'react'
import { Phone } from '../../kit/phone'
import type { Layout } from '../../kit/looks'
import './pillars.css'

// Shared by the four feature tiles (index.html, #features) so they read as
// one set: one size, one ground, one phone in one place, one satellite slot.
// The slot is the 7fr column (about 595 wide); on a phone it is the screen
// minus its gutters (358 at 390), where the satellite sits over the phone's
// lower half instead of beside it.
export const TILE = {
  width: 600,
  height: 380,
  compact: { below: 480, width: 358, height: 480 },
} as const

export const GROUND: [string, string, string] = ['#af40ff', '#5b42f3', '#00ddeb']

// Where the finger rests between taps, clear of the phone's content
export const REST = { wide: { x: 470, y: 350 }, compact: { x: 300, y: 430 } }

// The site's own app icon, served at the same URL in dev (publicDir) and on the page
export const APP_ICON = '/image/apple-touch-icon.png'

export function TilePhone({ layout, className, children }: { layout: Layout; className?: string; children: ReactNode }) {
  return (
    <Phone width={layout === 'compact' ? 326 : 340} className={`pl-phone${className ? ` ${className}` : ''}`}>
      {children}
    </Phone>
  )
}

export function Head({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="pl-head">
      <span className="pl-eyebrow">{eyebrow}</span>
      <span className="pl-title">{title}</span>
    </div>
  )
}
