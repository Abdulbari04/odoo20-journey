import { useState } from 'react'
import { Ar } from './Chapter'

export type Guide = {
  k: string; title?: string; intro?: string; topics?: { t: string; points: string[]; example?: string }[]; level: string; levelWhy: string; when: string[]; install: string[]
  config: [string, string, string][]
  menus: { name: string; what: string; how?: string[]; fields?: [string, string, string][]; buttons?: [string, string][] }[]
  howto: { t: string; steps: string[] }[]
  reports: [string, string, string][]
  mistakes: string[]
  src: [string, string][]
}
const TABS = [['topics', 'مفاهيم وأمثلة'], ['install', 'التثبيت'], ['config', 'الإعدادات'], ['menus', 'القوائم والخانات'], ['howto', 'إزاي نعمل'], ['reports', 'التقارير'], ['mistakes', 'أخطاء شائعة']] as const
type Tab = typeof TABS[number][0]

function Rows({ rows, heads }: { rows: string[][]; heads: string[] }) {
  return (
    <div className="gtab" role="table">
      <div className="gr gh" role="row">{heads.map(h => <span key={h} role="columnheader">{h}</span>)}</div>
      {rows.map((r, i) => <div className="gr" role="row" key={i}>{r.map((c, j) => <span key={j} role="cell" className={j === 0 ? 'gk' : ''}><Ar>{c}</Ar></span>)}</div>)}
    </div>)
}

export function GuideView({ g }: { g: Guide }) {
  const has: Record<Tab, boolean> = { topics: !!g.topics?.length, install: g.install.length > 0, config: g.config.length > 0, menus: g.menus.length > 0, howto: g.howto.length > 0, reports: g.reports.length > 0, mistakes: g.mistakes.length > 0 }
  const tabs = TABS.filter(([id]) => has[id])
  const [tab0, setTab] = useState<Tab | null>(null)
  const tab: Tab = tab0 && has[tab0] ? tab0 : (has.install ? 'install' : tabs[0]?.[0] ?? 'install')
  return (
    <div className="guide">
      <div className="glev"><span className={'badge lv-' + (g.level === 'مبتدئ' ? 1 : g.level === 'متوسط' ? 2 : 3)}>مستوى الموديول: {g.level}</span><span><Ar>{g.levelWhy}</Ar></span></div>
      <div className="gwhen"><b>بنستخدمه أمتى؟</b><ul>{g.when.map((w, i) => <li key={i}><Ar>{w}</Ar></li>)}</ul></div>
      <div className="gtabs" role="tablist">{tabs.map(([id, t]) => <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{t}</button>)}</div>
      <div className="gpane" role="tabpanel">
        {tab === 'topics' && <div className="gmenus">{g.topics!.map((t, i) => (
          <details className="gm" key={t.t} open={i === 0}><summary><Ar>{t.t}</Ar></summary>
            <ul className="gmist">{t.points.map((p, j) => <li key={j}><Ar>{p}</Ar></li>)}</ul>
            {t.example && <p className="gex"><b>مثال: </b><Ar>{t.example}</Ar></p>}
          </details>))}</div>}
        {tab === 'install' && <ol className="steps">{g.install.map((s, i) => <li key={i}><span><Ar>{s}</Ar></span></li>)}</ol>}
        {tab === 'config' && <Rows heads={['الإعداد', 'بيعمل إيه', 'إمتى تفعّله']} rows={g.config} />}
        {tab === 'menus' && <div className="gmenus">{g.menus.map((m, i) => (
          <details className="gm" key={m.name} open={i === 0}>
            <summary><Ar>{m.name}</Ar></summary>
            <p><Ar>{m.what}</Ar></p>
            {m.how && <ol className="steps">{m.how.map((s, j) => <li key={j}><span><Ar>{s}</Ar></span></li>)}</ol>}
            {m.fields && m.fields.length > 0 && <Rows heads={['الخانة', 'معناها', 'إزاي تملاها']} rows={m.fields} />}
            {m.buttons && m.buttons.length > 0 && <Rows heads={['الزرار', 'بيعمل إيه']} rows={m.buttons} />}
          </details>))}</div>}
        {tab === 'howto' && <div className="gmenus">{g.howto.map((h, i) => (
          <details className="gm" key={h.t} open={i === 0}><summary><Ar>{h.t}</Ar></summary><ol className="steps">{h.steps.map((s, j) => <li key={j}><span><Ar>{s}</Ar></span></li>)}</ol></details>))}</div>}
        {tab === 'reports' && <Rows heads={['التقرير', 'بيوريك إيه', 'بنستخدمه إمتى']} rows={g.reports} />}
        {tab === 'mistakes' && <ul className="gmist">{g.mistakes.map((m, i) => <li key={i}><Ar>{m}</Ar></li>)}</ul>}
      </div>
      <p className="gnote">الشرح مبني على وثائق Odoo الرسمية (النسخة 19) وكتاب الكورس وخبرة تطبيقية عامة. أسماء القوائم والخانات في Odoo 20 ممكن تختلف شوية، فتأكد من نسختك.</p>
      {g.src.length > 0 && <ul className="srcs">{g.src.map(s => <li key={s[1]}><a href={s[1]} target="_blank" rel="noopener noreferrer">{s[0]}</a></li>)}</ul>}
    </div>)
}
