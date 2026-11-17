import type { ReactNode } from 'react'
import { Ar } from './Chapter'

const INK = '#0E1621'
const st = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
const P: Record<string, ReactNode> = {
  doc: <g><rect x="-22" y="-30" width="44" height="58" rx="5" fill="#fff" {...st} /><path d="M-13 -16h26M-13 -6h26M-13 4h18" fill="none" {...st} /></g>,
  box: <g><path d="M-28 -12 0 -26 28 -12 28 18 0 32 -28 18Z" fill="#E8B77A" {...st} /><path d="M-28 -12 0 2 28 -12M0 2V32" fill="none" {...st} /><path d="M-14 -19 14 -5" stroke="#fff" strokeWidth="5" /></g>,
  truck: <g><rect x="-36" y="-22" width="42" height="34" rx="4" fill="#fff" {...st} /><path d="M6 -10h18l10 12v10H6Z" fill="#F2A541" {...st} /><circle cx="-18" cy="16" r="8" fill="#555" {...st} /><circle cx="22" cy="16" r="8" fill="#555" {...st} /></g>,
  cart: <g><path d="M-34 -26h12l8 36h34l8-26h-46" fill="#fff" {...st} /><circle cx="-8" cy="22" r="5" fill="#555" {...st} /><circle cx="22" cy="22" r="5" fill="#555" {...st} /></g>,
  coin: <g><circle r="26" fill="#FFD166" {...st} /><circle r="17" fill="none" {...st} strokeWidth="2" /><path d="M-5 -9c0-6 10-6 10 0 0 6-10 4-10 10 0 6 10 6 10 0M0 -13v26" fill="none" {...st} strokeWidth="2.5" /></g>,
  gear: <g>{[0, 45, 90, 135].map(a => <rect key={a} x="-6" y="-30" width="12" height="60" rx="3" fill="#A3B1C2" {...st} transform={`rotate(${a})`} />)}<circle r="20" fill="#CBD5E1" {...st} /><circle r="8" fill={INK} /></g>,
  calendar: <g><rect x="-28" y="-26" width="56" height="54" rx="6" fill="#fff" {...st} /><path d="M-28 -12h56" {...st} fill="none" /><rect x="-28" y="-26" width="56" height="14" rx="6" fill="#F87171" {...st} />{[-14, 0, 14].map(x => [4, 16].map(y => <circle key={x + '-' + y} cx={x} cy={y} r="3.5" fill={INK} />))}</g>,
  clock: <g><circle r="28" fill="#fff" {...st} /><path d="M0 -16V0l12 8" fill="none" {...st} /><circle r="3" fill={INK} /></g>,
  idcard: <g><rect x="-30" y="-22" width="60" height="44" rx="7" fill="#fff" {...st} /><circle cx="-14" cy="-3" r="8" fill="#FFD2AE" {...st} strokeWidth="2.5" /><path d="M2 -10h20M2 0h20M-24 12h46" fill="none" {...st} strokeWidth="2.5" /></g>,
  robot: <g><path d="M0 -34v-8" {...st} /><circle cy="-44" r="4" fill="#E879F9" {...st} /><rect x="-26" y="-34" width="52" height="44" rx="12" fill="#CBD5E1" {...st} /><circle cx="-10" cy="-14" r="6" fill="#38BDF8" {...st} strokeWidth="2.5" /><circle cx="10" cy="-14" r="6" fill="#38BDF8" {...st} strokeWidth="2.5" /><path d="M-10 0h20" fill="none" {...st} /><rect x="-18" y="14" width="36" height="16" rx="6" fill="#94A3B8" {...st} /></g>,
  house: <g><path d="M-32 -2 0 -30 32 -2" fill="#F87171" {...st} /><rect x="-24" y="-2" width="48" height="32" fill="#fff" {...st} /><rect x="-7" y="10" width="14" height="20" fill="#8A6B3F" {...st} /></g>,
  bag: <g><path d="M-22 28c-12-18-6-36 4-40h28c10 4 16 22 4 40Z" fill="#8FD19E" {...st} /><path d="M-12 -12l-4-12h32l-4 12" fill="#8FD19E" {...st} /><path d="M-5 0c0-6 10-6 10 0 0 6-10 4-10 10 0 6 10 6 10 0M0 -4v20" fill="none" {...st} strokeWidth="2.5" /></g>,
  magnifier: <g><circle cx="-6" cy="-6" r="20" fill="#DDF1FF" {...st} /><path d="M9 9l20 20" {...st} strokeWidth="7" /></g>,
  check: <g><circle r="28" fill="#6FD7A2" {...st} /><path d="M-13 1l9 10L14 -10" fill="none" {...st} strokeWidth="6" /></g>,
  receipt: <g><path d="M-22 -30h44v58l-7-5-7 5-7-5-7 5-7-5-9 5Z" fill="#fff" {...st} /><path d="M-12 -18h24M-12 -8h24M-12 2h14" fill="none" {...st} strokeWidth="2.5" /></g>,
  register: <g><rect x="-30" y="-8" width="60" height="34" rx="5" fill="#CBD5E1" {...st} /><rect x="-20" y="-30" width="40" height="22" rx="4" fill="#38BDF8" {...st} /><path d="M-20 6h40M-20 15h24" fill="none" {...st} strokeWidth="2.5" /></g>,
  funnel: <g><path d="M-30 -26h60L6 4v26l-12-8V4Z" fill="#C4B5FD" {...st} /></g>,
  chat: <g><path d="M-30 -22h60a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6H-6l-16 14V20h-8a6 6 0 0 1-6-6v-26a6 6 0 0 1 6-6Z" fill="#fff" {...st} /><circle cx="-14" cy="-2" r="3" fill={INK} /><circle cy="-2" r="3" fill={INK} /><circle cx="14" cy="-2" r="3" fill={INK} /></g>,
  camera: <g><rect x="-30" y="-16" width="60" height="42" rx="8" fill="#CBD5E1" {...st} /><path d="M-12 -16l4-9h16l4 9" fill="#CBD5E1" {...st} /><circle cy="5" r="13" fill="#38BDF8" {...st} /></g>,
  umbrella: <g><path d="M-34 -4a34 34 0 0 1 68 0Z" fill="#2DD4BF" {...st} /><path d="M0 -4v30a6 6 0 0 1-12 0" fill="none" {...st} /></g>,
  chart: <g><rect x="-30" y="-28" width="60" height="56" rx="6" fill="#fff" {...st} /><rect x="-20" y="4" width="10" height="16" fill="#6E9BF2" {...st} strokeWidth="2" /><rect x="-5" y="-8" width="10" height="28" fill="#6FD7A2" {...st} strokeWidth="2" /><rect x="10" y="-18" width="10" height="38" fill="#F2A541" {...st} strokeWidth="2" /></g>,
  factory: <g><path d="M-34 28V-2l18 10V-2l18 10V-2l18 10V-22h14v50Z" fill="#CBD5E1" {...st} /><rect x="-26" y="14" width="8" height="8" fill="#FFD166" {...st} strokeWidth="2" /></g>,
  book: <g><path d="M-30 -22c14-4 24-2 30 4 6-6 16-8 30-4v44c-14-4-24-2-30 4-6-6-16-8-30-4Z" fill="#fff" {...st} /><path d="M0 -18v44" fill="none" {...st} /></g>,
  mail: <g><rect x="-30" y="-20" width="60" height="42" rx="6" fill="#fff" {...st} /><path d="M-30 -18l30 22 30-22" fill="none" {...st} /></g>,
  cap: <g><path d="M-36 -6 0 -24 36 -6 0 12Z" fill="#1E293B" {...st} /><path d="M-20 4v14c8 8 32 8 40 0V4" fill="#334155" {...st} /><path d="M32 -4v22" {...st} /><circle cx="32" cy="22" r="4" fill="#FFD166" {...st} strokeWidth="2" /></g>,
}
const SKIN = ['#FFD2AE', '#E8B48A', '#C68B5E', '#FFD9BF']
const HAIR = ['#3B2A20', '#1B1B1B', '#6B3E26', '#2B2B52']

function Person({ x, y, i, mood }: { x: number; y: number; i: number; mood: 'happy' | 'think' }) {
  const skin = SKIN[i % 4], hair = HAIR[(i + 1) % 4]
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="66" rx="30" ry="6" fill="#000" opacity=".25" />
      <path d="M-14 62v-8M14 62v-8" {...st} strokeWidth="6" />
      <rect x="-19" y="22" width="38" height="36" rx="13" style={{ fill: 'var(--c)' }} {...st} />
      <path d="M19 32 40 22" {...st} strokeWidth="8" /><path d="M19 32 40 22" stroke={skin} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M-19 32-27 48" {...st} strokeWidth="8" /><path d="M-19 32-27 48" stroke={skin} strokeWidth="3.5" strokeLinecap="round" />
      <circle r="21" fill={skin} {...st} />
      <path d="M-21 -3Q-22 -26 0 -26Q22 -26 21 -3Q12 -14-21 -3Z" fill={hair} {...st} />
      <circle cx="-7" cy="3" r="2.6" fill={INK} /><circle cx="7" cy="3" r="2.6" fill={INK} />
      {mood === 'happy' ? <path d="M-8 10Q0 19 8 10" fill="none" {...st} strokeWidth="2.5" /> : <path d="M-6 12h12" fill="none" {...st} strokeWidth="2.5" />}
      {mood === 'think' && <circle cx="26" cy="-22" r="3" fill="#fff" opacity=".9" />}
    </g>)
}

type Panel = [prop: string, cap: string, mood?: 'happy' | 'think']
const S: Record<string, Panel[]> = {
  base: [['book', 'تعلّم المصطلحات الأول (Terms)'], ['gear', 'كل موديول اسمه App'], ['house', 'قاعدة بيانات واحدة (Database)'], ['check', 'والكل مربوط ببعض', 'happy']],
  crm: [['funnel', 'عميل محتمل يسأل (Lead)', 'think'], ['chat', 'نتابعه بمكالمة (Activity)'], ['doc', 'نبعتله عرض (New Quotation)'], ['check', 'الفرصة تنجح (Won)', 'happy']],
  s: [['doc', 'عرض سعر (Quotation)', 'think'], ['check', 'العميل يوافق (Confirm)'], ['truck', 'التسليم (Delivery)'], ['receipt', 'الفاتورة (Invoice)', 'happy']],
  i: [['box', 'بضاعة توصل (Receipt)'], ['house', 'تتخزن في المخزن (Warehouse)'], ['truck', 'وتخرج للعميل (Delivery)'], ['check', 'جرد الرصيد (Adjustment)', 'happy']],
  p: [['doc', 'نطلب سعر (RFQ)', 'think'], ['check', 'نأكّد الأمر (Purchase Order)'], ['box', 'نستلم البضاعة (Receipt)'], ['receipt', 'فاتورة المورد (Vendor Bill)', 'happy']],
  m: [['box', 'مكونات من المخزن (Components)'], ['gear', 'أمر تصنيع (Manufacturing Order)', 'think'], ['factory', 'مراكز العمل (Work Centers)'], ['check', 'منتج تام (Finished Product)', 'happy']],
  pos: [['register', 'افتح جلسة (Session)'], ['cart', 'الزبون يطلب (Order)'], ['coin', 'يدفع (Payment)'], ['receipt', 'إيصال وقفل (Closing)', 'happy']],
  a: [['receipt', 'فاتورة (Invoice)'], ['coin', 'دفع (Payment)', 'think'], ['book', 'قيد يومية (Journal Entry)'], ['chart', 'تقارير (Reports)', 'happy']],
  con: [['idcard', 'كارت جهة (Contact)'], ['house', 'عناوين (Addresses)'], ['doc', 'رقم ضريبي (Tax ID)', 'think'], ['mail', 'مراسلات (Cc)', 'happy']],
  ai: [['chat', 'تسأل الوكيل', 'think'], ['robot', 'وكيل ذكي (Agent)'], ['check', 'كارت تأكيد (Confirm)'], ['doc', 'ينشئ السجل (Create Records)', 'happy']],
  rec: [['doc', 'وظيفة (Job Position)'], ['magnifier', 'طلبات (Applications)', 'think'], ['chat', 'مقابلة (Interview)'], ['idcard', 'تعيين (Create Employee)', 'happy']],
  emp: [['idcard', 'ملف الموظف (Employee)'], ['calendar', 'جدول العمل (Schedule)'], ['house', 'مكان العمل (Location)'], ['doc', 'العقد (Contract)', 'happy']],
  att: [['clock', 'دخول (Check In)'], ['camera', 'صورة (Photo)'], ['clock', 'خروج (Check Out)', 'think'], ['chart', 'أوفر تايم (Overtime)', 'happy']],
  to: [['umbrella', 'طلب إجازة (Request)', 'happy'], ['check', 'موافقة (Approval)'], ['calendar', 'جدول الفريق (Overview)'], ['coin', 'أثرها في الراتب (Payroll)']],
  pay: [['calendar', 'فترة المرتب (Pay Run)'], ['doc', 'قسيمة (Payslip)', 'think'], ['bag', 'دفع الصافي (Payment)'], ['book', 'قيد المرتبات (Journal Entry)', 'happy']],
  grad: [['book', 'ذاكر الأساس'], ['gear', 'طبّق على قاعدة تجريبية'], ['magnifier', 'اختبر الترقية من 19 لـ 20', 'think'], ['cap', 'بقيت Consultant', 'happy']],
}

export function Storyboard({ k }: { k: string }) {
  const panels = S[k]
  if (!panels) return null
  return (
    <div className="story" role="img" aria-label="رسومات توضيحية للخطوات">
      {panels.map((p, i) => (
        <figure className="panel" key={i}>
          <svg viewBox="0 0 200 150" aria-hidden="true">
            <rect width="200" height="150" rx="16" className="pbg" />
            <path d="M0 126h200" stroke={INK} strokeOpacity=".25" strokeWidth="3" />
            <Person x={58} y={42} i={i + k.length} mood={p[2] || 'happy'} />
            <g transform="translate(142 70) scale(1.05)">{P[p[0]]}</g>
            <g style={{ fill: 'var(--c)' }}><circle cx="170" cy="26" r="3.5" /><circle cx="108" cy="30" r="2.5" /><path d="M186 100v8M182 104h8" stroke="var(--c)" strokeWidth="2" /></g>
          </svg>
          <figcaption><span className="pn">{i + 1}</span><span><Ar>{p[1]}</Ar></span></figcaption>
        </figure>))}
    </div>)
}
