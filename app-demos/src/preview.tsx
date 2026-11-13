// Dev only: mounts one scene from ?scene= for filming with stageshow's tools
import { mount } from './mount'

const scenes = import.meta.glob<{ default: React.ComponentType }>('./hero/*.tsx')
const params = new URLSearchParams(location.search)
if (params.get('theme') === 'light') document.body.classList.add('light-theme')
const name = params.get('scene') ?? 'CityStreamHero'
const load = Object.entries(scenes).find(([path]) => path.endsWith(`/${name}.tsx`))?.[1]
if (load) load().then(({ default: Scene }) => mount(document.getElementById('example')!, Scene))
