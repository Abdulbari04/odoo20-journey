import { useState } from 'react'
import { createProfile, sbSignIn, sbSignUp } from './store'

export type User = { name: string; job: string }
type Rec = { salt: string; hash: string; job: string }
export const JOBS = ['طالب', 'بشتغل (موظف)', 'بشتغل لحسابي / صاحب بيزنس', 'محاسب / مالي', 'بدوّر على شغل', 'غير ذلك']

const rd = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
const wr = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('')
async function hash(pw: string, salt: string) {
  if (crypto?.subtle) return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pw)))
  return btoa(unescape(encodeURIComponent(salt + pw)))
}
const key = (n: string) => n.trim().toLowerCase()

export const session = (): User | null => {
  const s = rd<string | null>('odoo20-session', null); const u = s && rd<Record<string, Rec & { name: string }>>('odoo20-users', {})[s]
  return u ? { name: u.name, job: u.job } : null
}
export const logout = () => { try { localStorage.removeItem('odoo20-session') } catch { /* ignore */ } }

export function Auth({ onIn }: { onIn: (u: User, fresh: boolean) => void }) {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [n, setN] = useState(''); const [p, setP] = useState(''); const [p2, setP2] = useState('')
  const [job, setJob] = useState(JOBS[0]); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('')
    const name = n.trim(); if (!name) return setErr('اكتب اسم المستخدم')
    if (p.length < 4) return setErr('الباسورد لازم يكون 4 حروف أو أرقام على الأقل')
    const users = rd<Record<string, Rec & { name: string }>>('odoo20-users', {}); const id = key(name)
    setBusy(true)
    try {
      if (mode === 'up') {
        if (users[id]) return setErr('الاسم ده مستخدم قبل كده، جرّب اسم تاني أو سجّل دخول')
        if (p !== p2) return setErr('الباسورد وتأكيده مش متطابقين')
        const salt = crypto?.randomUUID ? crypto.randomUUID() : String(Math.random())
        users[id] = { name, salt, hash: await hash(p, salt), job }; wr('odoo20-users', users); wr('odoo20-session', id)
        onIn({ name, job }, true)
      } else {
        const u = users[id]
        if (!u || u.hash !== await hash(p, u.salt)) return setErr('الاسم أو الباسورد غلط')
        wr('odoo20-session', id); onIn({ name: u.name, job: u.job }, false)
      }
    } finally { setBusy(false) }
  }

  return (
    <div className="auth">
      <form className="auth-card" onSubmit={submit} noValidate>
        <div className="auth-logo">🗺️</div>
        <h1>أعظم رحلة لتخرج كونسلتنت أودو</h1>
        <div className="auth-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={mode === 'in'} onClick={() => { setMode('in'); setErr('') }}>تسجيل دخول</button>
          <button type="button" role="tab" aria-selected={mode === 'up'} onClick={() => { setMode('up'); setErr('') }}>حساب جديد</button>
        </div>
        <label>اسم المستخدم<input value={n} onChange={e => setN(e.target.value)} autoComplete="username" /></label>
        <label>الباسورد<input type="password" value={p} onChange={e => setP(e.target.value)} autoComplete={mode === 'up' ? 'new-password' : 'current-password'} /></label>
        {mode === 'up' && <>
          <label>تأكيد الباسورد<input type="password" value={p2} onChange={e => setP2(e.target.value)} autoComplete="new-password" /></label>
          <fieldset><legend>وظيفتك الحالية</legend>
            {JOBS.map(j => <label key={j} className="auth-opt"><input type="radio" name="job" checked={job === j} onChange={() => setJob(j)} />{j}</label>)}
          </fieldset></>}
        {err && <p className="auth-err" role="alert">{err}</p>}
        <button className="auth-go" disabled={busy}>{mode === 'in' ? 'دخول' : 'إنشاء الحساب'}</button>
        <p className="auth-note">الحساب محفوظ على جهازك ومتصفحك بس، مفيش سيرفر. لو مسحت بيانات المتصفح أو فتحت من جهاز تاني هتعمل حساب جديد.</p>
      </form>
    </div>
  )
}

export function Welcome2({ user, onClose }: { user: User; onClose: () => void }) {
  const msg = user.job === 'طالب' ? 'وإنت لسه طالب، بتبني أساس هيفرق معاك قدام.' : user.job.startsWith('بدوّر') ? 'كل موديول بتتقنه بيقرّبك من الشغل اللي بتدوّر عليه.' : 'وإنت ماشي بين شغلك والتعلم، دي خطوة تستاهل التقدير.'
  return (
    <div className="ab-ov" onClick={onClose}>
      <section className="ab hello" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className="hello-e">🎉</div>
        <h2>أهلًا يا {user.name}، مبروك!</h2>
        <p>مبروك على أول خطوة في رحلة التعلم. قرارك إنك تبدأ هو أصعب جزء، وكل موديول هتخلّصه بيقرّبك من هدفك إنك تبقى كونسلتنت أودو.</p>
        <p>{msg}</p>
        <button className="auth-go" onClick={onClose}>يلا نبدأ الرحلة</button>
      </section>
    </div>
  )
}

export function CloudSignup({ onDone }: { onDone: (u: User) => void }) {
  const [n, setN] = useState(''); const [job, setJob] = useState(JOBS[0]); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); const name = n.trim(); if (!name) return setErr('اكتب اسمك')
    setBusy(true)
    try { await createProfile({ name, job }); onDone({ name, job }) } catch { setErr('حصلت مشكلة في الحفظ، جرّب تاني') } finally { setBusy(false) }
  }
  return (
    <div className="auth">
      <form className="auth-card" onSubmit={go} noValidate>
        <div className="auth-logo">☁️</div>
        <h1>أهلًا بيك في الرحلة</h1>
        <p className="auth-note">حسابك هو حساب Claude بتاعك، ومتابعتك وملاحظاتك بتتحفظ على قاعدة بيانات Claude مش على المتصفح، وتلاقيها من أي جهاز.</p>
        <label>اسمك<input value={n} onChange={e => setN(e.target.value)} autoComplete="name" /></label>
        <fieldset><legend>وظيفتك الحالية</legend>
          {JOBS.map(j => <label key={j} className="auth-opt"><input type="radio" name="job" checked={job === j} onChange={() => setJob(j)} />{j}</label>)}
        </fieldset>
        {err && <p className="auth-err" role="alert">{err}</p>}
        <button className="auth-go" disabled={busy}>ابدأ الرحلة</button>
      </form>
    </div>
  )
}

export function SbAuth({ onIn }: { onIn: (u: User, fresh: boolean) => void }) {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [pw, setPw] = useState('')
  const [job, setJob] = useState(JOBS[0]); const [err, setErr] = useState(''); const [info, setInfo] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setInfo('')
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErr('اكتب إيميل صحيح')
    if (pw.length < 6) return setErr('الباسورد لازم يكون 6 حروف أو أرقام على الأقل')
    if (mode === 'up' && !name.trim()) return setErr('اكتب اسمك')
    setBusy(true)
    try {
      if (mode === 'up') {
        const r = await sbSignUp(email.trim(), pw, { name: name.trim(), job })
        if (!r) return setInfo('اتبعتلك إيميل تأكيد. اضغط على اللينك اللي فيه وبعدين سجّل دخول.')
        onIn(r.profile, true)
      } else {
        const r = await sbSignIn(email.trim(), pw)
        if (r.profile) onIn(r.profile, false)
        else { const p = { name: email.split('@')[0], job: JOBS[0] }; await createProfile(p); onIn(p, true) }
      }
    } catch (x) {
      const m = String((x as { message?: string })?.message || '')
      setErr(/invalid login/i.test(m) ? 'الإيميل أو الباسورد غلط' : /already|registered/i.test(m) ? 'الإيميل ده متسجّل قبل كده' : /confirm/i.test(m) ? 'لازم تأكّد الإيميل الأول' : 'حصلت مشكلة: ' + m)
    } finally { setBusy(false) }
  }
  return (
    <div className="auth">
      <form className="auth-card" onSubmit={submit} noValidate>
        <div className="auth-logo">🗺️</div>
        <h1>أعظم رحلة لتخرج كونسلتنت أودو</h1>
        <div className="auth-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={mode === 'in'} onClick={() => { setMode('in'); setErr('') }}>تسجيل دخول</button>
          <button type="button" role="tab" aria-selected={mode === 'up'} onClick={() => { setMode('up'); setErr('') }}>حساب جديد</button>
        </div>
        {mode === 'up' && <label>اسمك<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></label>}
        <label>الإيميل<input type="email" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
        <label>الباسورد<input type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete={mode === 'up' ? 'new-password' : 'current-password'} /></label>
        {mode === 'up' && <fieldset><legend>وظيفتك الحالية</legend>
          {JOBS.map(j => <label key={j} className="auth-opt"><input type="radio" name="job" checked={job === j} onChange={() => setJob(j)} />{j}</label>)}
        </fieldset>}
        {err && <p className="auth-err" role="alert">{err}</p>}
        {info && <p className="auth-note" role="status">{info}</p>}
        <button className="auth-go" disabled={busy}>{mode === 'in' ? 'دخول' : 'إنشاء الحساب'}</button>
        <p className="auth-note">بياناتك بتتحفظ على قاعدة بيانات أونلاين، وتقدر تدخل من أي جهاز.</p>
      </form>
    </div>
  )
}
