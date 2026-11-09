// Dev only: mounts one scene from ?scene= for filming with stageshow's tools
import { mount } from './mount'

const scenes = import.meta.glob<{ default: React.ComponentType }>(['./pillars/[A-Z]*.tsx', './hero/*.tsx'])
const name = new URLSearchParams(location.search).get('scene') ?? 'Ciudades'
const load = Object.entries(scenes).find(([path]) => path.endsWith(`/${name}.tsx`))?.[1]
if (load) load().then(({ default: Scene }) => mount(document.getElementById('example')!, Scene))
