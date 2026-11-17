import { useEffect, useMemo, useRef, useState } from 'react'
import type { Data } from './types'
import { N, COL, GUIDES, ORDER, sid } from './Chapter'
import { LEVELS, levelIdx } from './levels'
import { SkipExam, unlocked, type Passed } from './Levels'

type Rec = { k: string; kind: string; text: string }
const norm = (s: string) => s.toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')

function buildIndex(data: Data): Rec[] {
  const r: Rec[] = []
  for (const k of ORDER) {
    r.push({ k, kind: 'موديول', text: N[k] })
    const c = data.CORE[k]
    if (c) { r.push({ k, kind: 'شرح', text: c.t + ' ' + c.en + ' ' + c.intro }); c.terms.forEach(t => r.push({ k, kind: 'مصطلح', text: t[0] + ': ' + t[1] })) }
    const g = GUIDES[k]; if (!g) continue
    if (g.title) r.push({ k, kind: 'موديول', text: g.title })
    g.when.forEach(x => r.push({ k, kind: 'بنستخدمه أمتى', text: x }))
    g.config.forEach(x => r.push({ k, kind: 'إعداد', text: x[0] + ': ' + x[1] }))
    g.menus.forEach(m => { r.push({ k, kind: 'قايمة', text: m.name + ': ' + m.what }); m.fields?.forEach(f => r.push({ k, kind: 'خانة في ' + m.name.split('>').pop()!.trim(), text: f[0] + ': ' + f[1] })); m.buttons?.forEach(b => r.push({ k, kind: 'زرار', text: b[0] + ': ' + b[1] })) })
    g.howto.forEach(h => r.push({ k, kind: 'إزاي نعمل', text: h.t + ' ' + h.steps.join(' ') }))
    g.reports.forEach(x => r.push({ k, kind: 'تقرير', text: x[0] + ': ' + x[1] }))
    g.topics?.forEach(t => r.push({ k, kind: 'مفهوم', text: t.t + ': ' + t.points.join(' ') }))
    g.mistakes.forEach(x => r.push({ k, kind: 'خطأ شائع', text: x }))
  }
  return r
}
const snip = (t: string, q: string) => {
  const i = norm(t).indexOf(q); const a = Math.max(0, (i < 0 ? 0 : i) - 30)
  return (a > 0 ? '…' : '') + t.slice(a, a + 130) + (t.length > a + 130 ? '…' : '')
}

export function Search({ open, onClose, data, passed, onPassAll, go, goSub }: { open: boolean; onClose: () => void; data: Data; passed: Passed; onPassAll: (ids: number[]) => void; go: (k: string) => void; goSub: (k: string, id: string) => void }) {
  const [q, setQ] = useState('')
  const [lockK, setLockK] = useState<string | null>(null)
  const inp = useRef<HTMLInputElement>(null)
  const idx = useMemo(() => buildIndex(data), [data])
  useEffect(() => { if (open) { setLockK(null); setTimeout(() => inp.current?.focus(), 50) } }, [open])
  const nq = norm(q.trim())
  const groups = useMemo(() => {
    if (nq.length < 2) return []
    const by = new Map<string, { k: string; score: number; hits: Rec[] }>()
    for (const r of idx) {
      const t = norm(r.text); const i = t.indexOf(nq); if (i < 0) continue
      const g = by.get(r.k) ?? { k: r.k, score: 0, hits: [] }
      g.score += r.kind === 'موديول' ? 50 : i < 20 ? 3 : 1
      if (g.hits.length < 3) g.hits.push(r)
      by.set(r.k, g)
    }
    return [...by.values()].sort((a, b) => b.score - a.score).slice(0, 12)
  }, [idx, nq])
  if (!open) return null
  const choose = (k: string) => {
    if (!unlocked(levelIdx(k), passed)) { setLockK(k); return }
    onClose(); if (GUIDES[k]) goSub(k, sid(k, 'guide')); else go(k)
  }
  const lk = lockK ? levelIdx(lockK) : -1
  const nowOpen = lockK != null && unlocked(lk, passed)
  return (
    <div className="ab-ov srch-ov" onClick={onClose}>
      <section className="srch" role="dialog" aria-modal="true" aria-label="بحث" onClick={e => e.stopPropagation()}>
        <div className="srch-h">
          <input ref={inp} type="search" value={q} onChange={e => { setQ(e.target.value); setLockK(null) }} placeholder="دوّر في الموديولات والإعدادات والخانات…" aria-label="بحث" />
          <button className="sb-x" onClick={onClose} aria-label="اقفل البحث">×</button>
        </div>
        {lockK && <div className={'srch-lock' + (nowOpen ? ' ok' : '')}>
          {nowOpen
            ? <><p>اتفتح لك «{N[lockK]}». يلا نروحله.</p><button className="cta" onClick={() => { onClose(); if (GUIDES[lockK]) goSub(lockK, sid(lockK, 'guide')); else go(lockK) }}>افتح {N[lockK]}</button></>
            : <><p>🔒 «{N[lockK]}» موجود في المستوى {LEVELS[lk].id} وهو لسه مقفول. اختبر نفسك الأول في اللي قبله وهيتفتح لك.</p>
                <SkipExam li={lk} passed={passed} onPassAll={onPassAll} compact /></>}
        </div>}
        {!lockK && <div className="srch-r">
          {nq.length < 2 && <p className="srch-hint">اكتب كلمتين على الأقل. بتدوّر في اسماء الموديولات والقوائم والخانات والخطوات والمفاهيم.</p>}
          {nq.length >= 2 && groups.length === 0 && <p className="srch-hint">مفيش نتايج لـ «{q}». جرّب كلمة تانية أو بالإنجليزي.</p>}
          {groups.map(g => {
            const lvl = levelIdx(g.k), lock = !unlocked(lvl, passed)
            return (
              <button key={g.k} className={'srch-g' + (lock ? ' is-lk' : '')} style={{ ['--c' as string]: `var(${COL[g.k]})` }} onClick={() => choose(g.k)}>
                <span className="srch-t"><i />{N[g.k]}<small>المستوى {LEVELS[lvl].id}</small>{lock && <em>🔒 مقفول، اختبر نفسك</em>}</span>
                {g.hits.map((h, i) => <span key={i} className="srch-s"><b>{h.kind}</b> {snip(h.text, nq)}</span>)}
              </button>)
          })}
        </div>}
      </section>
    </div>
  )
}
