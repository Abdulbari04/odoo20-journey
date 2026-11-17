// تخزين المفاتيح: سحابة Claude (db) لو متاحة، وإلا localStorage على الجهاز
type Doc = { set(d: Record<string, unknown>): Promise<void> }
type Cloud = { doc: Doc; uid: string }
type Backend = 'claude' | 'sb' | 'local'
let backend: Backend = 'local'
export const getBackend = () => backend
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sb: any = null
const SB_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const hasSupabase = !!(SB_URL && SB_KEY)
export type Profile = { name: string; job: string }

let cloud: Cloud | null = null
let cache: Record<string, string> = {}
let timer: number | undefined
let busy: Promise<void> | null = null
let dirty = false
let profile: Profile | null = null
const errs = new Set<(m: string) => void>()

export const isCloud = () => !!cloud
export const onSyncError = (f: (m: string) => void) => { errs.add(f); return () => { errs.delete(f) } }

export function get(k: string): string | null {
  if (cloud) return cache[k] ?? null
  try { return localStorage.getItem(k) } catch { return null }
}
async function flush() {
  if (!cloud) return
  if (busy) { dirty = true; return }
  dirty = false
  busy = cloud.doc.set({ ...profile, kv: cache, updatedAt: Date.now() }).catch(e => { errs.forEach(f => f(String(e?.message || e?.code || 'error'))) }).finally(() => { busy = null; if (dirty) void flush() })
  await busy
}
export function set(k: string, v: string) {
  if (cloud) { cache[k] = v; clearTimeout(timer); timer = window.setTimeout(() => void flush(), 800); return }
  try { localStorage.setItem(k, v) } catch { /* ignore */ }
}

// يحاول يفتح قاعدة بيانات Claude: يرجّع {profile|null} لو السحابة شغالة، أو undefined لو مش متاحة
export async function initCloud(): Promise<{ profile: Profile | null } | undefined> {
  try {
    const c = (window as unknown as { claude?: { use(n: string): Promise<any> } }).claude // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!c?.use) return undefined
    const [db, user] = await Promise.all([c.use('db'), c.use('user')])
    if (!db || !user) return undefined
    if (user.can && user.can('data.write') === false) return undefined
    const uid = await user.id()
    if (!uid) return undefined
    const doc = db.doc('data/users/' + uid + '/profile')
    const snap = await doc.get()
    cloud = { doc, uid }; backend = 'claude'
    const d = snap.exists ? snap.data() : null
    if (d && d.name) { profile = { name: String(d.name), job: String(d.job || '') }; cache = { ...(d.kv as Record<string, string> || {}) }; return { profile } }
    return { profile: null }
  } catch { cloud = null; return undefined }
}
export async function createProfile(p: Profile) { profile = p; cache = {}; await flush() }

// ---- Supabase (قاعدة بيانات أونلاين لما الموقع يتنشر على GitHub Pages) ----
export async function initSupabase(): Promise<{ profile: Profile | null } | 'noauth'> {
  if (!sb) { const { createClient } = await import('@supabase/supabase-js'); sb = createClient(SB_URL!, SB_KEY!) }
  const { data } = await sb.auth.getSession()
  return data.session ? loadSb(data.session.user.id) : 'noauth'
}
async function loadSb(uid: string): Promise<{ profile: Profile | null }> {
  const { data, error } = await sb.from('profiles').select('name,job,kv').eq('id', uid).maybeSingle()
  if (error) throw error
  cloud = { uid, doc: { set: async d => { const { error: e } = await sb.from('profiles').upsert({ id: uid, name: d.name, job: d.job, kv: d.kv, updated_at: new Date().toISOString() }); if (e) throw e } } }
  backend = 'sb'
  if (data?.name) { profile = { name: data.name, job: data.job || '' }; cache = { ...(data.kv || {}) }; return { profile } }
  return { profile: null }
}
export async function sbSignIn(email: string, password: string) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password }); if (error) throw error
  return loadSb(data.user.id)
}
// بيرجّع null لو لازم تأكّد الإيميل الأول
export async function sbSignUp(email: string, password: string, p: Profile): Promise<{ profile: Profile } | null> {
  const { data, error } = await sb.auth.signUp({ email, password }); if (error) throw error
  if (!data.session) return null
  await loadSb(data.user.id); await createProfile(p); return { profile: p }
}
export async function signOut() {
  if (backend === 'sb' && sb) await sb.auth.signOut()
  cloud = null; cache = {}; profile = null; backend = 'local'
}
