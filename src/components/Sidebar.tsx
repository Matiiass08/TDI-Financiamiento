import { useApp } from '@/store/appStore'
import { categoriaLabel } from '@/lib/format'
import { categoriaIds, totalVisibleByCategory, countByCategory } from '@/lib/metrics'
import { fmtCLP } from '@/lib/format'
import {
  HandCoins,
  PiggyBank,
  HandHeart,
  BarChart4,
  TicketPercent,
  Users
} from 'lucide-react'

// Iconos por categoría
const icons: Record<string, any> = {
  postulacion_fondos: HandCoins,
  donaciones: HandHeart,
  colectas: PiggyBank,
  actividades: BarChart4,
  rifas: TicketPercent,
  cuotas: Users
}

export function Sidebar() {
  const { items, selectedCategory, setSelectedCategory } = useApp()

  return (
    <aside className="hidden md:flex w-72 shrink-0 flex-col gap-2 p-4 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      {/* Encabezado con logo TDI */}
      <div className="flex items-center gap-3 mb-4">
        {/* 🟡 Logo (asegúrate de tener src/assets/tdi-logo.png) */}
        <img
          src="/src/assets/tdi-logo.png"
          alt="Logo TDI"
          className="w-10 h-10 object-contain rounded-md bg-tdi-yellow/10 p-1"
        />
        <div>
          <div className="font-bold text-base leading-tight">Financiamiento TDI</div>
          <div className="text-xs text-neutral-500">Meta CLP $50.000.000</div>
        </div>
      </div>

      {/* Lista de categorías */}
      <nav className="flex flex-col gap-1">
        {categoriaIds.map((c) => {
          const total = fmtCLP(totalVisibleByCategory(items, c))
          const count = countByCategory(items, c)
          const Icon = icons[c]
          const active = selectedCategory === c
          return (
            <button
              key={c}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-neutral-800 ${
                active ? 'bg-gray-100 dark:bg-neutral-800' : ''
              }`}
              onClick={() => setSelectedCategory(c)}
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4" aria-hidden />
                <span className="font-medium">{categoriaLabel[c]}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="badge" title="Total visible">
                  {total}
                </span>
                <span className="badge" title="# ítems">
                  {count}
                </span>
              </span>
            </button>
          )
        })}
      </nav>

      {/* Botón inferior */}
      <button
        className="mt-auto text-sm text-neutral-500 hover:underline"
        onClick={() => useApp.getState().setSelectedCategory(null)}
      >
        Ver todo
      </button>
    </aside>
  )
}
