import { useState } from 'react'
import type { User } from './Auth'
import type { Data } from './types'
import { N, COL, CHK, MODS, sid, ORDER, GUIDES } from './Chapter'
import { LEVELS, levelIdx } from './levels'
import { unlocked, type Passed } from './Levels'

const subs = (k: string, data: Data): [string, string][] => {
  if (!data.CORE[k]) return [['guide', 'الدليل التفصيلي'], ['note', 'ملاحظاتي']]
  const r: [string, string][] = [['draw', 'الرسمة'], ['terms', 'المصطلحات'], ['steps', 'خطوة بخطوة']]
  if (GUIDES[k]) r.push(['guide', 'الدليل التفصيلي'])
  r.push(['acc', 'الأثر المحاسبي'])
  if (MODS.includes(k)) r.push(['links', 'مربوط بـ'])
  if (CHK[k]) r.push(['vs', 'Odoo 20 مقابل 19'])
  if (data.CORE[k].up) r.push(['up', 'قايمة اختبار الترقية'])
  r.push(['quiz', 'اختبر نفسك'], ['note', 'ملاحظاتي'], ['src', 'المصادر'])
  return r
}

export function Sidebar({ docked, passed, onIntro, cloud, user, onOut, onAbout, open, onClose, active, done, onToggleDone, go, goSub, data }: {
  docked: boolean; passed: Passed; onIntro: () => void; cloud: boolean; user: User; onOut: () => void; onAbout: () => void; open: boolean; onClose: () => void; active: string | null; done: Record<string, boolean>
  onToggleDone: (k: string) => void; go: (k: string) => void; goSub: (k: string, id: string) => void; data: Data
}) {
  const [exp, setExp] = useState<Record<string, boolean>>({})
  const isOpen = (k: string) => exp[k] ?? k === active
  const count = ORDER.filter(k => done[k]).length
  const narrow = () => !docked
  const lockedK = (k: string) => !unlocked(levelIdx(k), passed)
  return (<>
    <div className={'sb-ov' + (open && !docked ? ' on' : '')} onClick={onClose} aria-hidden="true" />
    <aside className={'sb' + (open || docked ? ' on' : '') + (docked ? ' docked' : '')} aria-label="قايمة الفصول" inert={!open && !docked}>
      <div className="sb-h"><b>المحتويات</b><span className="sb-p">{count}/{ORDER.length} مكتمل</span>{!docked && <button className="sb-x" onClick={onClose} aria-label="اقفل القايمة">×</button>}</div>
      <nav className="sb-l">
        <button className="sb-home" onClick={onIntro}>🏠 صفحة البداية</button>
        {LEVELS.map((lv, li) => {
          const lvLocked = !unlocked(li, passed)
          return (
            <div key={lv.id} className="sb-g">
              <div className={'sb-lh' + (lvLocked ? ' is-lk' : '') + (passed[lv.id] ? ' ps' : '')}>{lvLocked ? '🔒' : passed[lv.id] ? '✓' : '▶'} المستوى {lv.id}: {lv.t}</div>
              {lv.ch.map(k => {
                const i = ORDER.indexOf(k), lk = lvLocked, dn = !!done[k]
                return (
                  <div key={k} className={'sb-c' + (active === k ? ' cur' : '') + (dn ? ' done' : '') + (lk ? ' is-lk' : '')} style={{ ['--c' as string]: `var(${COL[k]})` }}>
                    <div className="sb-r">
                      <button className="sb-t" disabled={lk} aria-expanded={!lk && isOpen(k)} onClick={() => setExp(e => ({ ...e, [k]: !isOpen(k) }))} aria-label={'عناوين ' + N[k]}>{lk ? '' : isOpen(k) ? '▾' : '◂'}</button>
                      <button className="sb-n" onClick={() => { go(k); if (narrow()) onClose() }}><i /><span className="sb-i">{lk ? '🔒' : i + 1}</span><span className="sb-nm">{N[k]}</span></button>
                      <button className={'sb-d' + (dn ? ' on' : '')} disabled={lk} aria-pressed={dn} aria-label={dn ? 'الفصل مكتمل' : 'علّم كمكتمل'} title={dn ? 'مكتمل' : 'علّم كمكتمل'} onClick={() => onToggleDone(k)}>✓</button>
                    </div>
                    {!lk && isOpen(k) && <ul className="sb-s">{subs(k, data).map(([id, t]) => <li key={id}><button onClick={() => { goSub(k, sid(k, id)); if (narrow()) onClose() }}>{t}</button></li>)}</ul>}
                  </div>)
              })}
            </div>)
        })}
      </nav>
      <button className="sb-ab" onClick={() => { onClose(); onAbout() }}>ℹ️ عن الموقع (About me)</button>
      <div className="sb-u"><span>👤 {user.name} · {user.job}</span>{cloud && <em>☁️ محفوظ على Claude</em>}</div>
      <button className="sb-out" onClick={onOut}>تسجيل خروج</button>
    </aside>
  </>)
}
