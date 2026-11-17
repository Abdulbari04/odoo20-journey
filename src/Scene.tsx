import { useEffect, useRef } from 'react'
import { ICON } from './icons'
import { N, COL, MODS, HR, E } from './Chapter'

const CX = 350, CY = 350, R = 240
const ring = (d: number): [number, number] => { const r = d * Math.PI / 180; return [CX + R * Math.cos(r), CY + R * Math.sin(r)] }
const POS: Record<string, [number, number]> = {
  a: [CX, CY], crm: ring(-90), s: ring(-45), pos: ring(0), i: ring(45), p: ring(90), m: ring(135), ai: ring(180), con: ring(225),
  emp: [CX, CY], rec: ring(-90), att: ring(0), pay: ring(90), to: ring(180),
}
const BUS = ['crm', 's', 'pos', 'i', 'p', 'm', 'ai', 'con', 'a']
const groupOf = (active: string | null) => (active && HR.includes(active) ? HR : BUS)
const ORDER_N = 9

export function Scene({ active, go }: { active: string | null; go: (k: string) => void }) {
  const stage = useRef<HTMLDivElement>(null), world = useRef<HTMLDivElement>(null), floor = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const st = stage.current!, w = world.current!, f = floor.current!
    const fit = () => {
      const mob = innerWidth <= 900; let s = Math.min(1, st.clientWidth / 680); if (mob) s = Math.min(s, .46)
      w.style.setProperty('--bs', String(mob ? 1.35 : 1)); w.style.setProperty('--s', String(s))
      st.style.height = Math.round((mob ? 500 : 520) * s) + 'px'
    }
    fit(); addEventListener('resize', fit); const ro = new ResizeObserver(fit); ro.observe(st)
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches; let hover = false, raf = 0
    const move = (e: PointerEvent) => { if (rm) return; hover = true; const r = st.getBoundingClientRect(); const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5; f.style.setProperty('--rz', (-20 + dx * 30) + 'deg'); f.style.setProperty('--rx', (58 - dy * 10) + 'deg') }
    const leave = () => { hover = false }
    st.addEventListener('pointermove', move); st.addEventListener('pointerleave', leave)
    return () => { removeEventListener('resize', fit); ro.disconnect(); st.removeEventListener('pointermove', move); st.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf) }
  }, [])
  const isMod = !!active && MODS.includes(active)
  const grp = groupOf(active)
  const ids = Object.keys(E).filter(id => grp.includes(E[id].a) && grp.includes(E[id].b))
  const onEdges = isMod ? ids.filter(id => E[id].a === active || E[id].b === active) : []
  const onNodes = isMod ? [active!, ...onEdges.map(id => E[id].a === active ? E[id].b : E[id].a)] : []
  const idx = active ? ['base', 'crm', 's', 'i', 'p', 'm', 'pos', 'a', 'grad'].indexOf(active) : -1
  return (
    <div className="stagebox">
      <div className="stage" ref={stage} aria-label="خريطة ثلاثية الأبعاد للموديولات">
        <div className="world" ref={world}><div className="persp"><div className="floor" ref={floor}>
          <div className="grid" />
          <svg className="edges" viewBox="0 0 700 700" width="700" height="700" aria-hidden="true">
            {ids.map(id => { const a = POS[E[id].a], b = POS[E[id].b]; return <line key={id} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={'edge ' + (isMod ? (onEdges.includes(id) ? 'on' : 'off') : 'all')} /> })}
          </svg>
          {grp.map(k => { const sz = (k === 'a' || k === 'emp') ? 140 : 120, p = POS[k]; return (
            <div key={k} className={'node' + (isMod && k === active ? ' act' : '') + (isMod && !onNodes.includes(k) ? ' dim' : '')} tabIndex={0} role="button" aria-label={N[k]}
              style={{ width: sz, height: sz, left: p[0] - sz / 2, top: p[1] - sz / 2, ['--c' as string]: `var(${COL[k]})` }}
              onClick={() => go(k)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(k) } }}>
              <div className="sh" /><div className="l l1" /><div className="l l2" /><div className="l l3" />
              <div className="badge"><div className="in"><div className="ico">{ICON[k]}</div><div className="nm">{N[k]}</div></div></div>
            </div>) })}
        </div></div></div>
      </div>
      <div className="status"><span>{active ? `الفصل ${idx + 1} من ${ORDER_N}` : 'اسحب الصفحة لتحت'}</span><b>{active ? N[active] : ''}</b></div>
    </div>)
}

/** Small fixed map: module names in a tiny font, linked circles glow. */
export function MiniMap({ active, go }: { active: string | null; go: (k: string) => void }) {
  const isMod = !!active && MODS.includes(active)
  const grp = groupOf(active)
  const ids = Object.keys(E).filter(id => grp.includes(E[id].a) && grp.includes(E[id].b))
  const onE = isMod ? ids.filter(id => E[id].a === active || E[id].b === active) : []
  return (
    <svg className="mini" viewBox="-10 30 720 680" role="group" aria-label="خريطة الموديولات">
      <defs><filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      {ids.map(id => { const a = POS[E[id].a], b = POS[E[id].b], on = onE.includes(id); return <line key={id} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={on ? 'var(--map-hi)' : 'var(--map-lo)'} strokeWidth={on ? 12 : 7} opacity={on ? 1 : isMod ? 0 : .55} filter="url(#glow)" /> })}
      {grp.map(k => { const on = k === active; return (
        <g key={k} onClick={() => go(k)} style={{ cursor: 'pointer' }} filter={on ? 'url(#glow)' : undefined}>
          <circle cx={POS[k][0]} cy={POS[k][1]} r={on ? 52 : 42} fill={`var(${COL[k]})`} stroke="var(--map-hi)" strokeWidth={on ? 9 : 4} />
          <text x={POS[k][0]} y={POS[k][1] + 88} textAnchor="middle" fontSize={50} fontWeight={700} fill="var(--map-text)" stroke="var(--map-halo)" strokeWidth={10} paintOrder="stroke" style={{ fontFamily: 'Cairo, sans-serif' }}>{N[k]}</text>
        </g>) })}
    </svg>)
}
