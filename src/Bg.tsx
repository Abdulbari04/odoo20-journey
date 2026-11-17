import { useMemo } from 'react'

const rnd = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x) }

/** Static full-page 3D backdrop: a fixed corridor of module cubes behind the text (no scroll motion). Text sits on glass panels above it. */
export function Bg() {
  // deep-space void: only stars at many depths, nothing else
  const stars = useMemo(() => Array.from({ length: 220 }, (_, i) => ({ x: (rnd(i + 1) - .5) * 3200, y: (rnd(i + 300) - .5) * 2400, z: -rnd(i + 600) * 6000 + 300, s: 2 + rnd(i + 9) * 4, o: .35 + rnd(i + 33) * .6, t: rnd(i + 77) })), [])
  return (
    <div className="bg3d" aria-hidden="true">
      <div className="stage3d"><div className="rail">
        {stars.map((d, i) => <i key={i} className="dot3" style={{ width: d.s, height: d.s, opacity: d.o, transform: `translate3d(${d.x}px,${d.y}px,${d.z}px)`, background: d.t > .8 ? '#9CC3FF' : d.t > .6 ? '#FFE3B0' : '#FFFFFF' }} />)}
      </div></div>
    </div>)
}
