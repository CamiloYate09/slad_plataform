import { Stage } from '../../kit/stage'
import type { Act } from '../../kit/act'
import { Notification } from '../../kit/phone'
import { Bar } from '../../kit/window'
import { Button } from '../../kit/controls/Button'
import { Collapse } from '../../kit/motion/Collapse'
import { Row } from '../../kit/parts/Row'
import { TILE, GROUND, REST, APP_ICON, TilePhone, Head } from './frame'

// "Nunca más te pierdas de nada". Beats: this week's events in Bogotá
// (context), a tap on "Este finde" closes up what isn't this weekend
// (action), and CityStream's alert drops in before the tickets run out
// (result). Plays once and holds the alert.
//
// Real strings: Bogotá, Eventos, the three filters, the two events that stay,
// and the alert. The events the filter removes are bars.

type S = { filter: boolean; alert: boolean }

type Ev = { title?: string; when?: string; art: string; weekend: boolean; bars?: [number, number] }

const EVENTS: Ev[] = [
  { art: 'pl-art--c', weekend: false, bars: [132, 86] },
  { title: 'Rock al Parque', when: 'Sáb 15 · Parque Simón Bolívar', art: 'pl-art--b', weekend: true },
  { art: 'pl-art--d', weekend: false, bars: [110, 92] },
  { title: 'Noche de jazz', when: 'Dom 16 · Chapinero', art: 'pl-art--a', weekend: true },
  { art: 'pl-art--e', weekend: true, bars: [124, 70] },
  { art: 'pl-art--c', weekend: true, bars: [98, 80] },
]

async function script(a: Act<S>) {
  await a.wait(900)
  a.mark('filter')
  await a.click('weekend')
  a.put({ filter: true })
  await a.wait(1500)
  a.mark('alert')
  a.put({ alert: true })
  await a.wait(2600)
}

export default function Eventos() {
  return (
    <Stage<S>
      width={TILE.width}
      height={TILE.height}
      compact={TILE.compact}
      ground={GROUND}
      initial={{ filter: false, alert: false }}
      poster={{ filter: true, alert: true }}
      script={script}
      play="once"
      cursor={{ at: REST, style: 'touch' }}
      className="pl pl--eventos"
    >
      {(s, _rect, layout) => (
        <TilePhone layout={layout} className="pl-phone--center">
          <div className="pl-screen">
            <Head eyebrow="Bogotá" title="Eventos" />
            <div className="ev-chips">
              <Button size="large" variant={s.filter ? 'primary' : 'secondary'} data-target="weekend">
                Este finde
              </Button>
              <Button size="large">Música</Button>
              <Button size="large">Gratis</Button>
            </div>
            <div className="ev-list">
              {EVENTS.map((ev, i) => (
                <Collapse key={i} open={!s.filter || ev.weekend}>
                  <Row
                    lead={<span className={`ev-art ${ev.art}`} />}
                    title={ev.title ?? <Bar w={ev.bars![0]} h={10} r={5} tone={4} />}
                    subtitle={ev.when ?? <Bar w={ev.bars![1]} h={8} r={4} tone={3} />}
                  />
                </Collapse>
              ))}
            </div>
          </div>
          <div className="ev-banner" data-on={s.alert || undefined}>
            <Notification
              banner
              icon={<img className="ev-icon" src={APP_ICON} alt="" />}
              title="CityStream"
              time="ahora"
              body="Rock al Parque: quedan 50 entradas. Asegura la tuya antes de que se agoten."
            />
          </div>
        </TilePhone>
      )}
    </Stage>
  )
}
