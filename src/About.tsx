export const VERSION = '4.1.0'
export function About({ onClose }: { onClose: () => void }) {
  return (
    <div className="ab-ov" onClick={onClose}>
      <section className="ab" role="dialog" aria-modal="true" aria-label="عن الموقع" onClick={e => e.stopPropagation()}>
        <button className="sb-x ab-x" onClick={onClose} aria-label="اقفل">×</button>
        <h2>عن الموقع</h2>
        <p className="ab-v">النسخة <bdi dir="ltr">v{VERSION}</bdi></p>
        <p>«أعظم رحلة لتخرج كونسلتنت أودو» موقع تعليمي بالعربي المصري بيشرح Odoo 20 خطوة بخطوة، من الأساسيات لحد الموديولات الكاملة: المبيعات والمشتريات والمخازن والتصنيع والمحاسبة والموارد البشرية وغيرها.</p>
        <p>كل فصل فيه رسمة كرتونية، مصطلحات بالإنجليزي مع شرحها بالعربي، خطوات عملية، الأثر المحاسبي، الفروق بين Odoo 20 و19، اختبار قصير، وخانة ملاحظات شخصية. وتقدر تتابع تقدمك بعلامة «مكتمل» وتختار بين وضع الفضا ووضع الدفتر.</p>
        <p className="ab-n">المحتوى تعليمي ومأخوذ من ملاحظات الإصدار المنشورة، وأسماء القوائم ممكن تختلف شوية في نسختك.</p>
        <p className="ab-by">تم الصنع بواسطة <b>Muhammed Abdul Bari</b></p>
      </section>
    </div>
  )
}
