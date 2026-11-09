import { Stage } from '../../kit/stage'
import type { Act } from '../../kit/act'
import { Bar } from '../../kit/window'
import { Avatar } from '../../kit/parts/Avatar'
import { Card } from '../../kit/parts/Card'
import { Icon } from '../../kit/parts/Icon'
import { Badge } from '../../kit/controls/Badge'
import { Button } from '../../kit/controls/Button'
import { TILE, GROUND, REST, TilePhone, Head } from './frame'

// "Personas reales, conexiones reales". Beats: someone nearby with their
// interests (context), the two you share light up and say so (the reason to
// connect, not an algorithm's), and a tap on Conectar confirms on the same
// button (result). Plays once and holds the connection.
//
// Real strings: Chapinero, Personas, the name and distance, four interests,
// the shared count, Conectar / Conectados.

type S = { shared: boolean; connected: boolean }

const INTERESTS = [
  { label: 'Senderismo', shared: true },
  { label: 'Café', shared: false },
  { label: 'Jazz', shared: true },
  { label: 'Fotografía', shared: false },
]

async function script(a: Act<S>) {
  await a.wait(900)
  a.mark('shared')
  a.put({ shared: true })
  await a.wait(1500)
  a.mark('connect')
  await a.click('connect')
  a.put({ connected: true })
  await a.wait(2400)
}

export default function Personas() {
  return (
    <Stage<S>
      width={TILE.width}
      height={TILE.height}
      compact={TILE.compact}
      ground={GROUND}
      initial={{ shared: false, connected: false }}
      poster={{ shared: true, connected: true }}
      script={script}
      play="once"
      cursor={{ at: REST, style: 'touch' }}
      className="pl pl--personas"
    >
      {(s, _rect, layout) => (
        <TilePhone layout={layout} className="pl-phone--center">
          <div className="pl-screen">
            <Head eyebrow="Chapinero" title="Personas" />
            <div className="ps-stack">
            <Card pad="large" gap={14}>
              <div className="ps-who">
                <Avatar name="Laura Gómez" size={48} />
                <span className="ps-name">
                  <strong>Laura Gómez</strong>
                  <span>A 1,2 km de ti</span>
                </span>
                <span className="ps-common" data-on={s.shared || undefined}>
                  <Badge tone="accent">2 en común</Badge>
                </span>
              </div>
              <div className="ps-tags">
                {INTERESTS.map((it) => (
                  <Badge key={it.label} tone={s.shared && it.shared ? 'accent' : 'neutral'}>
                    {it.label}
                  </Badge>
                ))}
              </div>
              <div>
                <Button
                  size="large"
                  variant={s.connected ? 'secondary' : 'primary'}
                  icon={s.connected ? <Icon name="check" size={14} stroke={2.4} /> : undefined}
                  data-target="connect"
                >
                  {s.connected ? 'Conectados' : 'Conectar'}
                </Button>
              </div>
            </Card>
            <Card pad="large" gap={10}>
              <div className="ps-who">
                <Avatar size={48} />
                <span className="ps-name ps-name--bars">
                  <Bar w={120} h={10} r={5} tone={4} />
                  <Bar w={76} h={8} r={4} tone={3} />
                </span>
              </div>
            </Card>
            </div>
          </div>
        </TilePhone>
      )}
    </Stage>
  )
}
