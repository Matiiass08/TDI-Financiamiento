import { useApp } from '@/store/appStore'
import { ItemFormModal } from './ItemFormModal'
import { useState, useRef } from 'react'
import { Download, Upload, Plus, Moon, Sun, PieChart, BarChart3, LogOut } from 'lucide-react'
import { showToast } from './Toast'
import { storage } from '@/lib/storage'

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

  const onLogout = async () => {
    await storage.logout()
    window.location.reload()
  }

  // Restaurar preferencia de tema al cargar
  if (typeof window !== 'undefined') {
    const pref = localStorage.getItem('theme')
    if (pref) document.documentElement.classList.toggle('dark', pref === 'dark')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-slate-950/80 dark:supports-[backdrop-filter]:bg-slate-950/65">
      <div className="px-3 sm:px-4 lg:px-6 min-h-14 flex flex-wrap items-center gap-2 py-2">
        <h1 className="font-semibold text-sm sm:text-base">Financiamiento TDI</h1>
        <div className="ml-auto flex min-w-0 items-center gap-2 overflow-x-auto">
          <div className="hidden sm:flex rounded-xl overflow-hidden border border-gray-300 dark:border-white/10 dark:bg-slate-900/60">
            <button className={`px-3 py-2 flex items-center gap-1 ${chartType==='pie'?'bg-gray-100 dark:bg-amber-300 dark:text-slate-950':''}`} onClick={() => setChartType('pie')}>
              <PieChart className="size-4" /> Torta
            </button>
            <button className={`px-3 py-2 flex items-center gap-1 ${chartType==='bar'?'bg-gray-100 dark:bg-amber-300 dark:text-slate-950':''}`} onClick={() => setChartType('bar')}>
              <BarChart3 className="size-4" /> Barras
            </button>
          </div>

          <button className="btn max-sm:px-2 max-sm:text-xs" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Agregar ítem
          </button>
          <button className="btn max-sm:px-2 max-sm:text-xs" onClick={onExport}>
            <Download className="size-4" /> Exportar
          </button>
          <label className="btn max-sm:px-2 max-sm:text-xs cursor-pointer">
            <Upload className="size-4" /> Importar
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => onImport(e.target.files?.[0] ?? null)} />
          </label>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Alternar modo oscuro">
            <Moon className="size-5 hidden dark:block" />
            <Sun className="size-5 dark:hidden" />
          </button>
          {storage.usesRemote() && (
            <button className="icon-btn" onClick={onLogout} aria-label="Cerrar sesión">
              <LogOut className="size-5" />
            </button>
          )}
        </div>
      </div>
      <ItemFormModal open={open} onOpenChange={setOpen} />
    </header>
  )
}
