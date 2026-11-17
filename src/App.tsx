import { Fragment, useEffect, useMemo, useState } from 'react'
import raw from './data.json'
import type { Data, Chg } from './types'
import { Scene, MiniMap } from './Scene'
import { Bg } from './Bg'
import { Sidebar } from './Sidebar'
import { About, VERSION } from './About'
import { Auth, Welcome2, session, logout, type User } from './Auth'
import { TipToast } from './Tips'
import { LEVELS, levelIdx } from './levels'
import { Search } from './Search'
import { Intro, SkipExam, LevelHead, LevelExam, LockedCard, unlocked, type Passed } from './Levels'
import * as store from './store'
import { CloudSignup, SbAuth } from './Auth'
import { ChapterView, GuideChapter, Welcome, ORDER, N, COL, CHK } from './Chapter'

const data = raw as unknown as Data
const load = store.get
const save = store.set

function useDesktop() {
  const q = '(min-width: 901px)'
  const [d, setD] = useState(() => matchMedia(q).matches)
  useEffect(() => { const m = matchMedia(q), f = () => setD(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f) }, [])
  return d
}

function Main({ user, fresh, onOut }: { user: User; fresh: boolean; onOut: () => void }) {
  const [hello, setHello] = useState(fresh)
  const [syncErr, setSyncErr] = useState('')
  useEffect(() => store.onSyncError(setSyncErr), [])
  const desktop = useDesktop()
  const [active, setActive] = useState<string | null>(null)
  const [done, setDone] = useState<Record<string, boolean>>(() => { try { return JSON.parse(load('odoo20-done') || '{}') } catch { return {} } })
  const [mode, setMode] = useState<'space' | 'notebook'>(() => (load('odoo20-mode') === 'space' ? 'space' : 'notebook'))
  useEffect(() => { document.documentElement.dataset.mode = mode; save('odoo20-mode', mode) }, [mode])
  const [view, setView] = useState<'intro' | 'course'>('intro')
  const [passed, setPassed] = useState<Passed>(() => { try { return JSON.parse(load('odoo20-levels') || '{}') } catch { return {} } })
  const [started, setStarted] = useState(() => load('odoo20-started') === '1')
  const lockedK = (k: string) => !unlocked(levelIdx(k), passed)
  const [about, setAbout] = useState(false)
  const [srch, setSrch] = useState(false)
  const [menu, setMenu] = useState(false)
  const [fold, setFold] = useState<Record<string, boolean>>({})
  const [name, setName] = useState(user.name)
  const scrollTo2 = (id: string, wait: number) => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), wait)
  const go = (k: string) => {
    const open = fold[k]; if (open) setFold(f => ({ ...f, [k]: false }))
    if (view === 'intro') setView('course')
    scrollTo2('ch-' + k, open || view === 'intro' ? 120 : 0)
  }
  const goLevel = (i: number) => { setView('course'); scrollTo2('lv-' + LEVELS[i].id, 120) }
  const startJourney = () => {
    setView('course'); setStarted(true); save('odoo20-started', '1')
    const cur = LEVELS.findIndex((l, i) => unlocked(i, passed) && !passed[l.id])
    if (started && cur >= 0) scrollTo2('lv-' + LEVELS[cur].id, 120); else setTimeout(() => scrollTo({ top: 0 }), 0)
  }
  const passAll = (ids: number[]) => setPassed(p => { const n = { ...p }; ids.forEach(i => { n[i] = true }); save('odoo20-levels', JSON.stringify(n)); return n })
  const passLevel = (id: number) => setPassed(p => { const n = { ...p, [id]: true }; save('odoo20-levels', JSON.stringify(n)); return n })
  const goSub = (k: string, id: string) => {
    if (view === 'intro') setView('course')
    const f = fold[k]; if (f) setFold(x => ({ ...x, [k]: false }))
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), f ? 80 : 0)
  }
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); setAbout(false); setSrch(false) } }; addEventListener('keydown', h); return () => removeEventListener('keydown', h) }, [])
  const allCollapsed = ORDER.every(k => fold[k])
  const toggleAll = () => setFold(Object.fromEntries(ORDER.map(k => [k, !allCollapsed])))
  const total = useMemo(() => Object.keys(CHK).filter(k => k !== 'base').reduce((n, k) => n + (data.CHG[CHK[k]] as Chg[]).length, 0), [])

  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.k || null) }), { rootMargin: '-30% 0px -60% 0px' })
    document.querySelectorAll('main section.ch').forEach(s => io.observe(s))
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches
    const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); tio.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
    if (!rm) document.querySelectorAll('.ch .term,.ch .steps li,.ch .ent,.ch .ex,.ch .ana,.ch .lk,.ch .qz details,.ch .bridge').forEach(x => { x.classList.add('tilt'); tio.observe(x) })
    return () => { io.disconnect(); tio.disconnect() }
  }, [view, passed])
  const toggleDone = (k: string) => lockedK(k) || setDone(d => { const n = { ...d, [k]: !d[k] }; save('odoo20-done', JSON.stringify(n)); return n })
  const start = (v: string) => { if (v) { save('odoo20-name', v); setName(v) } go('base'); setStarted(true); save('odoo20-started', '1') }

  const course = view === 'course'
  const docked = desktop && course
  useEffect(() => { document.body.classList.toggle('docked', docked); return () => document.body.classList.remove('docked') }, [docked])
  const outFn = () => { if (store.getBackend() === 'claude') { setView('intro'); setMenu(false) } else onOut() }
  const tip = <TipToast k={course ? active : null} name={k => N[k]} dock={desktop} />

  return (<>
    <Bg />
    {course && <Sidebar docked={docked} cloud={store.getBackend() === 'claude'} user={user} onOut={outFn} onAbout={() => setAbout(true)} open={menu} onClose={() => setMenu(false)} active={active} done={done} passed={passed} onToggleDone={toggleDone} go={go} goSub={goSub} data={data} onIntro={() => { setView('intro'); setMenu(false) }} />}
    {hello && <Welcome2 user={user} onClose={() => setHello(false)} />}
    {syncErr && <div className="syncerr" role="alert">⚠ مش قادر يحفظ على قاعدة البيانات دلوقتي، تقدّمك الأخير ممكن ما يتحفظش. <button onClick={() => setSyncErr('')}>×</button></div>}
    {!desktop && tip}
    <Search open={srch} onClose={() => setSrch(false)} data={data} passed={passed} onPassAll={passAll} go={go} goSub={goSub} />
    {about && <About onClose={() => setAbout(false)} />}
    <div className="bar">
      {course && <button className="menub" onClick={() => setMenu(m => !m)} aria-expanded={menu} aria-label="قايمة الفصول" title="قايمة الفصول">☰</button>}
      <button className="brand brandb" onClick={() => { setView('intro'); scrollTo({ top: 0 }) }} title="صفحة البداية">خريطة أودو 20</button>
      <span className="prog" aria-live="polite">{ORDER.filter(k => done[k]).length}/{ORDER.length}</span>
      <button className="modeb srchb" onClick={() => setSrch(true)} aria-label="بحث" title="بحث">🔍</button>
      <button className="modeb" onClick={() => setMode(m => (m === 'space' ? 'notebook' : 'space'))} aria-label={mode === 'space' ? 'وضع الدفتر' : 'الوضع الليلي'} title={mode === 'space' ? 'وضع الدفتر' : 'الوضع الليلي'}>{mode === 'space' ? '✎' : '☾'}</button>
    </div>
    {!course && <Intro name={user.name} passed={passed} done={done} started={started} onStart={startJourney} onJump={goLevel} />}
    {course && <div className="layout">
      {desktop && <aside className="scenecol"><Scene active={active} go={go} />{tip}</aside>}
      {!desktop && <MiniMap active={active} go={go} />}
      <main className="chaps">
        <Welcome name={name} total={total} onStart={start} onAll={toggleAll} allCollapsed={allCollapsed}>{!desktop && <Scene active={active} go={go} />}</Welcome>
        {LEVELS.map((lv, li) => {
          const open = unlocked(li, passed)
          return (
            <Fragment key={lv.id}>
              <LevelHead lv={lv} state={passed[lv.id] ? 'passed' : open ? 'open' : 'locked'} />
              {!open && <SkipExam li={li} passed={passed} onPassAll={passAll} />}
              {lv.ch.map(k => open
                ? (!data.CORE[k] ? <GuideChapter key={k} k={k} i={ORDER.indexOf(k)} done={!!done[k]} onDone={() => toggleDone(k)} go={go} collapsed={!!fold[k]} onToggle={() => setFold(f => ({ ...f, [k]: !f[k] }))} /> : <ChapterView key={k} k={k} i={ORDER.indexOf(k)} data={data} done={!!done[k]} onDone={() => toggleDone(k)} go={go} collapsed={!!fold[k]} onToggle={() => setFold(f => ({ ...f, [k]: !f[k] }))} />)
                : <LockedCard key={k} k={k} lv={lv} />)}
              {open && <LevelExam lv={lv} passed={!!passed[lv.id]} onPass={() => passLevel(lv.id)} onNext={LEVELS[li + 1] ? () => goLevel(li + 1) : null} />}
            </Fragment>)
        })}
      </main>
    </div>}
    <footer>
      <p>تفاصيل Odoo 20 مأخوذة من صفحات iVentureTeam لملاحظات الإصدار (كل صفحة بتقول إنها ملخّص لملاحظات أودو الرسمية، وأنا ما قدرتش أفتح صفحة أودو الرسمية للمقارنة). الفروق العامة من Versich. شرح المفاهيم والمسارات والأمثلة الرقمية تعليمي عام، وأسماء القوائم ممكن تختلف شوية في نسختك. القيود المحاسبية أمثلة مبسطة.</p>
      <p>مصادر عامة: {[['فهرس iVentureTeam', 'https://iventureteam.com/odoo-20-release-notes/'], ['وثائق Odoo (19.0)', 'https://www.odoo.com/documentation/19.0/applications/'], ['Webkul', 'https://webkul.com/blog/odoo-20-whats-new-key-features-and-comparison/'], ['Versich', 'https://versich.com/blog/odoo-19-to-20-upgrade-key-changes-and-testing-checklist/']].map(([t, u], i) => <span key={u}>{i ? ' · ' : ''}<a href={u} target="_blank" rel="noopener noreferrer" className="lnk">{t}</a></span>)}</p>
          <p className="credit">تم الصنع بواسطة <b>Muhammed Abdul Bari</b> · النسخة <bdi dir="ltr">v{VERSION}</bdi></p>
    </footer>
  </>)
}

export default function App() {
  const [u, setU] = useState<User | null>(null)
  const [fresh, setFresh] = useState(false)
  const [phase, setPhase] = useState<'boot' | 'signup' | 'sbauth' | 'local' | 'in'>('boot')
  useEffect(() => {
    let off = false
    ;(async () => {
      const r = await store.initCloud()
      if (off) return
      if (r) { if (r.profile) { setU(r.profile); setPhase('in') } else setPhase('signup'); return }
      if (store.hasSupabase) {
        try {
          const s = await store.initSupabase(); if (off) return
          if (s === 'noauth') setPhase('sbauth'); else if (s.profile) { setU(s.profile); setPhase('in') } else setPhase('sbauth')
          return
        } catch { /* لو القاعدة مش متاحة نكمل بالتخزين المحلي */ }
      }
      setU(session()); setPhase('local')
    })()
    return () => { off = true }
  }, [])
  if (phase === 'boot') return <><Bg /><div className="auth"><p className="auth-note">بنفتح حسابك…</p></div></>
  if (phase === 'signup') return <><Bg /><CloudSignup onDone={x => { setFresh(true); setU(x); setPhase('in') }} /></>
  if (phase === 'sbauth') return <><Bg /><SbAuth onIn={(x, f) => { setFresh(f); setU(x); setPhase('in') }} /></>
  if (!u) return <><Bg /><Auth onIn={(x, f) => { setFresh(f); setU(x) }} /></>
  return <Main user={u} fresh={fresh} onOut={() => { if (store.getBackend() === 'sb') { void store.signOut().then(() => { setFresh(false); setU(null); setPhase('sbauth') }) } else { logout(); setFresh(false); setU(null) } }} />
}
