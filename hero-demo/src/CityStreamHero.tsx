// Imported file by file: kit/index.ts would pull every part, and its CSS, into the bundle
import { Stage } from '../kit/stage'
import type { Act } from '../kit/act'
import { Phone } from '../kit/phone'
import { Bar } from '../kit/window'
import { Avatar } from '../kit/parts/Avatar'
import { Facepile } from '../kit/parts/Facepile'
import { Icon } from '../kit/parts/Icon'
import { Meter } from '../kit/parts/Meter'
import { Expand } from '../kit/motion/Expand'
import { Roll } from '../kit/motion/Roll'
import { States } from '../kit/motion/States'
import './citystream.css'

// Hero demo for citystream.tech, built from stageshow's phone-touch example. Story in
// three beats: this week's events in Medellín (context), a tap on "Feria de
// las Flores" opens its card into the event (action), "Asistiré" confirms on
// its own button and the count of people going rolls by one (result). It
// loops by being put back: close, and the card folds into its place in the
// list; the RSVP resets while hidden behind the card's clip.
//
// Real strings: Medellín, Esta semana, the three event names, the date line,
// Asistiré / Vas a ir, Van a ir and the count. Everything else is bars.

type S = { open: boolean; going: boolean; n: number }

const GOING = 1204
const START: S = { open: false, going: false, n: GOING }

const CARD = { x: 16, h: 132 }
const TOPS = [150, 296, 442, 588]
const PICK = 1
const REST = { x: 200, y: 300 }
const HEADER = 300

const ART = ['cs-art--salsa', 'cs-art--flores', 'cs-art--mercado', 'cs-art--night']
const CARD_NAMES: Record<number, string> = { 0: 'Noche de salsa', 2: 'Mercado de pulgas' }
const LIST_TEXT = [
  { eyebrow: 38, title: 128, sub: 44 },
  null,
  { eyebrow: 46, title: 104, sub: 52 },
  { eyebrow: 34, title: 140, sub: 40 },
]

const count = (n: number) => n.toLocaleString('es-CO')

const script = async (a: Act<S>) => {
  await a.wait(1100)
  a.mark('tap')
  await a.click('card')
  a.put({ open: true })
  await a.wait(1400)
  a.mark('rsvp')
  await a.click('rsvp')
  a.put({ going: true })
  await a.wait(500)
  a.put((s) => ({ n: s.n + 1 }))
  await a.wait(2600)
  a.mark('close')
  await a.click('close')
  a.put({ open: false })
  await a.wait(900)
  // Hidden behind the card's clip now: reset the RSVP unseen
  await a.snap({ going: false, n: GOING })
  await a.move(REST)
  await a.wait(300)
}

export default function CityStreamHero() {
  return (
    <Stage<S>
      width={400}
      height={520}
      compact={{ below: 400, width: 358, height: 520 }}
      initial={START}
      poster={{ open: true, going: true, n: GOING + 1 }}
      script={script}
      cursor={{ at: REST, style: 'touch' }}
      className="cs"
    >
      {(s, rect, layout) => {
        const top = TOPS[PICK]
        return (
          <>
            <Phone width={layout === 'compact' ? 326 : 300} className="cs-phone" data-open={s.open || undefined}>
              <div className="cs-list" data-back={s.open || undefined}>
                <header className="cs-head">
                  <span className="cs-city">Medellín</span>
                  <div className="cs-head__row">
                    <span className="cs-title">Esta semana</span>
                    <Avatar name="Camila" size={36} />
                  </div>
                </header>
                {TOPS.map((y, i) =>
                  i === PICK ? (
                    <span key={i} className="cs-slot" data-target="card" style={{ top: y }} />
                  ) : (
                    <div key={i} className={`cs-card ${ART[i]}`} style={{ top: y }}>
                      <span className="cs-card__text">
                        <span className="cs-line" style={{ width: LIST_TEXT[i]!.eyebrow, height: 7, opacity: 0.55 }} />
                        {CARD_NAMES[i] ? <span className="cs-card__title">{CARD_NAMES[i]}</span> : <span className="cs-line" style={{ width: LIST_TEXT[i]!.title, height: 13 }} />}
                        <span className="cs-line" style={{ width: LIST_TEXT[i]!.sub, height: 7, opacity: 0.55 }} />
                      </span>
                    </div>
                  ),
                )}
                <nav className="cs-tabs">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="cs-tab" data-on={i === 0 || undefined}>
                      <span className="cs-tab__icon" />
                      <span className="cs-tab__label" />
                    </span>
                  ))}
                </nav>
              </div>

              {/* The picked card and its event page are one element */}
              <div className="cs-press" style={{ transformOrigin: `50% ${top + CARD.h / 2}px` }}>
                <Expand className="cs-detail" open={s.open} from={rect('card')} radius={22} duration={620}>
                  <div className="cs-detail__inner" style={{ transform: `translateY(${s.open ? 0 : CARD.h - HEADER}px)` }}>
                    <div className={`cs-hero ${ART[PICK]}`} style={{ clipPath: s.open ? 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)' : `inset(0px ${CARD.x}px 0px ${CARD.x}px round 0px 0px 22px 22px)` }}>
                      <span className="cs-close" data-target="close">
                        <Icon name="close" size={14} stroke={2} />
                      </span>
                      <span className="cs-hero__text" style={{ transform: `translateX(${s.open ? 0 : CARD.x}px)` }}>
                        <span className="cs-hero__eyebrow" />
                        <span className="cs-hero__title">Feria de las Flores</span>
                        <span className="cs-hero__sub">Medellín · 1–10 ago</span>
                      </span>
                    </div>
                    <div className="cs-body">
                      <div className="cs-panel">
                        <div className="cs-about" data-hide={s.going || undefined}>
                          <div className="cs-stats">
                            {[
                              [34, 46],
                              [40, 30],
                              [28, 38],
                            ].map(([l, v], i) => (
                              <span key={i} className="cs-stat">
                                <Bar w={l} h={6} r={3} tone={3} />
                                <Bar w={v} h={11} r={4} tone={5} />
                              </span>
                            ))}
                          </div>
                          <div className="cs-desc">
                            <Bar w="92%" h={7} r={3} tone={2} />
                            <Bar w="84%" h={7} r={3} tone={2} />
                            <Bar w="58%" h={7} r={3} tone={2} />
                          </div>
                        </div>
                        <div className="cs-going" data-show={s.going || undefined}>
                          <span className="cs-going__label">Van a ir</span>
                          <span className="cs-going__row">
                            <span className="cs-going__count">
                              <Roll>{count(s.n)}</Roll>
                            </span>
                            <Facepile names={['Camila', 'Andrés', 'Valentina']} size={30} />
                          </span>
                          <Meter value={0.68} className="cs-meter" />
                        </div>
                      </div>
                      <span className="cs-rsvp" data-target="rsvp" data-going={s.going || undefined}>
                        <States
                          value={s.going ? 'going' : 'idle'}
                          states={{
                            idle: (
                              <>
                                <Icon name="calendar" size={16} stroke={2} /> Asistiré
                              </>
                            ),
                            going: (
                              <>
                                <Icon name="check" size={16} stroke={2.4} /> Vas a ir
                              </>
                            ),
                          }}
                        />
                      </span>
                      <div className="cs-intervals">
                        <Bar w={72} h={8} r={4} tone={4} />
                        {[86, 64, 92].map((w, i) => (
                          <span key={i} className="cs-interval">
                            <span className="cs-interval__dot" data-i={i} />
                            <Bar w={w} h={8} r={4} tone={3} />
                            <Bar w={30} h={8} r={4} tone={2} />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Expand>
              </div>
            </Phone>
          </>
        )
      }}
    </Stage>
  )
}
