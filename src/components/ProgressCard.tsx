import { useApp } from '@/store/appStore'
import { totalVisible } from '@/lib/metrics'
import { fmtCLP, fmtPct } from '@/lib/format'
import { META_CLP } from '@/config'


export function ProgressCard() {
const items = useApp(s => s.items)
const total = totalVisible(items)
const pct = Math.min(100, (total / META_CLP) * 100)
const over = total > META_CLP ? total - META_CLP : 0


return (
<section className="card p-5">
<h2 className="font-semibold mb-3">Progreso hacia la meta</h2>
<div className="flex items-end gap-4 flex-wrap">
<div className="text-3xl font-extrabold">{fmtCLP(total)}</div>
<div className="text-neutral-500">de {fmtCLP(META_CLP)} ({fmtPct(pct)})</div>
{over > 0 && (
<span className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">+{fmtCLP(over)} sobre la meta</span>
)}
</div>
<div className="progress mt-4" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Avance hacia la meta">
<div style={{ width: `${pct}%` }} />
</div>
</section>
)
}