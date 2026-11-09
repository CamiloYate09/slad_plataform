import { Stage } from '../../kit/stage'
import type { Act } from '../../kit/act'
import { Bar } from '../../kit/window'
import { Avatar } from '../../kit/parts/Avatar'
import { Card } from '../../kit/parts/Card'
import { Icon } from '../../kit/parts/Icon'
import { Row } from '../../kit/parts/Row'
import { Button } from '../../kit/controls/Button'
import { Collapse } from '../../kit/motion/Collapse'
import { Roll } from '../../kit/motion/Roll'
import { useSiteTheme } from '../site-theme'
import { TILE, GROUND, REST, TilePhone } from './frame'

// "El ritmo de Colombia en tus manos". Beats: the festival's page (context),
// a tap on Comprar entrada confirms on the same button (action), and the
// group fills up beside the phone as friends join, its count rolling with
// each one (result). Plays once and holds the full group.
//
// Real strings: the festival, its place and date, the button's two labels,
// Tu grupo, the count and the three friends.

type S = { bought: boolean; group: boolean; joined: number }

const FRIENDS = ['Andrés', 'Valentina', 'Sebastián']

async function script(a: Act<S>) {
  await a.wait(900)
  a.mark('buy')
  await a.click('buy')
  a.put({ bought: true })
  await a.wait(700)
  a.mark('group')
  a.put({ group: true })
  for (let i = 1; i <= FRIENDS.length; i++) {
    await a.wait(650)
    a.put({ joined: i })
  }
  await a.wait(2200)
}

export default function Conciertos() {
  const theme = useSiteTheme()
  return (
    <Stage<S>
      width={TILE.width}
      height={TILE.height}
      compact={TILE.compact}
      ground={GROUND}
      theme={theme}
      initial={{ bought: false, group: false, joined: 0 }}
      poster={{ bought: true, group: true, joined: FRIENDS.length }}
      script={script}
      play="once"
      cursor={{ at: REST, style: 'touch' }}
      className="pl pl--conciertos"
    >
      {(s, _rect, layout) => {
        // On a phone-width tile the group sits under the button: denser rows
        // keep all four inside the tile
        const rowPad = layout === 'compact' ? 6 : 8
        const face = layout === 'compact' ? 24 : 28
        return (
        <>
          <TilePhone layout={layout} dark={theme === 'dark'} className="cc-phone">
            <div className="pl-screen" style={{ background: 'var(--app-sheet)' }}>
              <div className="cc-art">
                <span className="cc-art__text">
                  <span className="cc-art__title">Rock al Parque</span>
                  <span className="cc-art__sub">Parque Simón Bolívar · 15 nov</span>
                </span>
              </div>
              <div className="cc-body">
                <div>
                  <Button
                    size="large"
                    variant={s.bought ? 'secondary' : 'primary'}
                    icon={s.bought ? <Icon name="check" size={14} stroke={2.4} /> : undefined}
                    data-target="buy"
                  >
                    {s.bought ? 'Entrada lista' : 'Comprar entrada'}
                  </Button>
                </div>
                <div className="cc-lines">
                  <Bar w="88%" h={8} r={4} tone={2} />
                  <Bar w="72%" h={8} r={4} tone={2} />
                  <Bar w="54%" h={8} r={4} tone={2} />
                </div>
                <div className="cc-lines">
                  <Bar w={84} h={10} r={5} tone={4} />
                  <Bar w="80%" h={8} r={4} tone={2} />
                  <Bar w="66%" h={8} r={4} tone={2} />
                </div>
              </div>
            </div>
          </TilePhone>
          <Card className="pl-sat" lift gap={2} pad="small" data-on={s.group || undefined}>
            <div className="pl-sat__head" style={{ padding: '4px 8px 6px' }}>
              <span className="pl-sat__title">Tu grupo</span>
              <span className="pl-sat__meta">
                <Roll>{String(s.joined + 1)}</Roll> de 4
              </span>
            </div>
            <Row pad={rowPad} lead={<Avatar name="Tú" size={face} tone="accent" />} title="Tú" />
            {FRIENDS.map((name, i) => (
              <Collapse key={name} open={s.joined > i}>
                <Row pad={rowPad} lead={<Avatar name={name} size={face} />} title={name} />
              </Collapse>
            ))}
          </Card>
        </>
        )
      }}
    </Stage>
  )
}
