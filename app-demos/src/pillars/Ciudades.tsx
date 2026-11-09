import { Stage } from '../../kit/stage'
import type { Act } from '../../kit/act'
import { Card } from '../../kit/parts/Card'
import { Row } from '../../kit/parts/Row'
import { useSiteTheme } from '../site-theme'
import { TILE, GROUND, REST, TilePhone, Head } from './frame'

// "El mapa vivo de Colombia". Beats: Medellín's map with three pins (context),
// a tap on El Poblado (action), and what locals recommend there arrives
// beside the phone, one place per kind of plan (result). Plays once and holds
// the result; the stage replays it when the tile comes back into view.
//
// Real strings: Medellín, Explorar, El Poblado, the three places and their
// kinds. The map is shapes only.

type S = { pin: boolean; card: boolean }

const PLACES = [
  { name: 'Café Pergamino', kind: 'Gastronomía', art: 'pl-art--d' },
  { name: 'Museo de Antioquia', kind: 'Cultura', art: 'pl-art--c' },
  { name: 'Parque Lleras', kind: 'Vida nocturna', art: 'pl-art--e' },
]

async function script(a: Act<S>) {
  await a.wait(900)
  a.mark('tap')
  await a.click('pin')
  a.put({ pin: true })
  await a.wait(300)
  a.mark('card')
  a.put({ card: true })
  await a.wait(2400)
}

// Parks, the river and a few avenues: enough to read as a city map, no labels
function MapArt() {
  return (
    <svg viewBox="0 0 340 600" preserveAspectRatio="xMidYMin slice" aria-hidden>
      <path d="M-20 40 C 60 70, 120 30, 190 90 S 300 170, 360 150" className="cd-river" fill="none" strokeWidth="16" strokeLinecap="round" />
      <path d="M 30 150 q 40 -30 80 0 t 50 50 q -20 40 -70 30 t -60 -80 z" className="cd-park" />
      <path d="M 220 10 q 50 0 70 30 t -10 60 q -40 10 -60 -20 t 0 -70 z" className="cd-park" />
      <path d="M 250 250 q 40 -10 60 20 t -20 60 q -40 0 -50 -30 z" className="cd-park" />
      <g className="cd-roads" strokeLinecap="round" fill="none">
        <path d="M -10 120 L 360 60" strokeWidth="7" />
        <path d="M 120 -10 L 170 610" strokeWidth="7" />
        <path d="M -10 260 L 360 230" strokeWidth="5" />
        <path d="M 260 -10 L 230 610" strokeWidth="5" />
        <path d="M 40 -10 L 70 300" strokeWidth="3.5" />
        <path d="M -10 190 L 360 175" strokeWidth="3.5" />
        <path d="M 300 120 L 200 320" strokeWidth="3.5" />
      </g>
    </svg>
  )
}

export default function Ciudades() {
  const theme = useSiteTheme()
  return (
    <Stage<S>
      width={TILE.width}
      height={TILE.height}
      compact={TILE.compact}
      ground={GROUND}
      theme={theme}
      initial={{ pin: false, card: false }}
      poster={{ pin: true, card: true }}
      script={script}
      play="once"
      cursor={{ at: REST, style: 'touch' }}
      className="pl pl--ciudades"
    >
      {(s, _rect, layout) => (
        <>
          <TilePhone layout={layout} dark={theme === 'dark'}>
            <div className="pl-screen">
              <Head eyebrow="Explorar" title="Medellín" />
              <div className="cd-map">
                <MapArt />
                <span className="cd-pin" style={{ left: '22%', top: 34 }} />
                <span className="cd-pin" style={{ left: '74%', top: 58 }} />
                <span className="cd-pin cd-pin--main" style={{ left: '46%', top: 92 }} data-target="pin" data-on={s.pin || undefined}>
                  <span className="cd-label">El Poblado</span>
                </span>
              </div>
            </div>
          </TilePhone>
          <Card className="pl-sat" lift gap={6} pad="small" data-on={s.card || undefined}>
            <div className="pl-sat__head pl-sat__head--stack" style={{ padding: '4px 8px 4px' }}>
              <span className="pl-sat__title">El Poblado</span>
              <span className="pl-sat__meta">Recomendado por locales</span>
            </div>
            <div className="cd-rows">
              {PLACES.map((p, i) => (
                <div key={p.name} className="cd-row" style={{ transitionDelay: s.card ? `${160 + i * 110}ms` : '0ms' }}>
                  <Row pad={8} lead={<span className={`pl-thumb ${p.art}`} />} title={p.name} subtitle={p.kind} />
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </Stage>
  )
}
