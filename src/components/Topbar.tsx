import { useApp } from '@/store/appStore'
import { ItemFormModal } from './ItemFormModal'
import { useState, useRef } from 'react'
import { Download, Upload, Plus, Moon, Sun, PieChart, BarChart3 } from 'lucide-react'
import { showToast } from './Toast'


export function Topbar() {
const { setChartType, chartType, exportState, importState } = useApp()
const [open, setOpen] = useState(false)
const fileRef = useRef<HTMLInputElement>(null)


const onExport = () => {
const data = exportState()
const blob = new Blob([data], { type: 'application/json' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `tdi-financiamiento-${new Date().toISOString().slice(0,10)}.json`
a.click()
URL.revokeObjectURL(url)
showToast('Datos exportados como JSON')
}


const onImport = async (file: File | null) => {
if (!file) return
try {
const text = await file.text()
const json = JSON.parse(text)
// permite {items, metaCLP?} o {metaCLP, items}
if (!json.items || !Array.isArray(json.items)) throw new Error('Formato inválido: falta items[]')
importState({ metaCLP: json.metaCLP, items: json.items })
showToast('Datos importados')
} catch (e: any) {
showToast('Error al importar JSON: ' + (e?.message ?? ''))
} finally {
if (fileRef.current) fileRef.current.value = ''
}
}


const toggleTheme = () => {
const root = document.documentElement
const next = root.classList.toggle('dark')
localStorage.setItem('theme', next ? 'dark' : 'light')
}


// Restaurar preferencia de tema al cargar
if (typeof window !== 'undefined') {
const pref = localStorage.getItem('theme')
if (pref) document.documentElement.classList.toggle('dark', pref === 'dark')
}


return (
<header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-950/70 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800">
<div className="px-4 lg:px-6 h-14 flex items-center gap-3">
<h1 className="font-semibold">Financiamiento TDI</h1>
<div className="ml-auto flex items-center gap-2">
<div className="hidden sm:flex rounded-xl overflow-hidden border border-gray-300 dark:border-neutral-700">
<button className={`px-3 py-2 flex items-center gap-1 ${chartType==='pie'?'bg-gray-100 dark:bg-neutral-800':''}`} onClick={() => setChartType('pie')}>
<PieChart className="size-4" /> Torta
</button>
<button className={`px-3 py-2 flex items-center gap-1 ${chartType==='bar'?'bg-gray-100 dark:bg-neutral-800':''}`} onClick={() => setChartType('bar')}>
<BarChart3 className="size-4" /> Barras
</button>
</div>


<button className="btn" onClick={() => setOpen(true)}>
<Plus className="size-4" /> Agregar ítem
</button>
<button className="btn" onClick={onExport}>
<Download className="size-4" /> Exportar
</button>
<label className="btn cursor-pointer">
<Upload className="size-4" /> Importar
<input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => onImport(e.target.files?.[0] ?? null)} />
</label>
<button className="icon-btn" onClick={toggleTheme} aria-label="Alternar modo oscuro">
<Moon className="size-5 hidden dark:block" />
<Sun className="size-5 dark:hidden" />
</button>
</div>
</div>
<ItemFormModal open={open} onOpenChange={setOpen} />
</header>
)
}