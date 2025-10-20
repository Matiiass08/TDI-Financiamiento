# TDI Financiamiento – App web (Vite + React + TypeScript)

Aplicación completa para **alcanzar y monitorear la meta de CLP $50.000.000** de TDI, con colores institucionales **amarillo y negro**, estado global (Zustand), gráficos (Recharts), persistencia localStorage y exportar/importar JSON.

> **Justificación técnica**
> - **Recharts**: API declarativa, responsiva, accesible, tooltips y leyendas simples. Ideal para barras y tortas.
> - **Zustand**: liviano, sin boilerplate, escalable. Más simple que Redux Toolkit para un MVP local y fácil de extender.

---

## 📁 Estructura del proyecto

```
TDI-Financiamiento/
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ index.html
├─ postcss.config.cjs
├─ tailwind.config.ts
├─ README.md
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ index.css
   ├─ config.ts
   ├─ types.ts
   ├─ lib/
   │  ├─ format.ts
   │  ├─ storage.ts
   │  ├─ seed.ts
   │  ├─ uid.ts
   │  └─ metrics.ts
   ├─ store/
   │  └─ appStore.ts
   ├─ components/
   │  ├─ Sidebar.tsx
   │  ├─ Topbar.tsx
   │  ├─ ProgressCard.tsx
   │  ├─ ChartCard.tsx
   │  ├─ CategoryView.tsx
   │  ├─ ItemFormModal.tsx
   │  ├─ ConfirmDialog.tsx
   │  ├─ EmptyState.tsx
   │  ├─ Badge.tsx
   │  ├─ Toggle.tsx
   │  ├─ IconButton.tsx
   │  └─ Toast.tsx
   └─ tests/
      ├─ format.test.ts
      └─ totals.test.ts
```

---

## 🚀 Cómo correr

1) **Requisitos**: Node 18+.

2) Instalar dependencias y correr dev server:
```bash
npm i
npm run dev
```

3) Abre `http://localhost:5173`.

Al iniciar verás **progreso, gráficos y datos de ejemplo**. Al ocultar/mostrar ítems, **totales y gráficos se actualizan inmediatamente**.

---

## 📦 package.json

```json
{
  "name": "tdi-financiamiento",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^4.5.2",
    "recharts": "^2.12.7",
    "lucide-react": "^0.453.0",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite": "^5.4.8",
    "vitest": "^2.1.3",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.3",
    "jsdom": "^25.0.1"
  }
}
```

---

## 🔧 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

---

## ⚡ vite.config.ts
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

---

## 🧱 index.html
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Financiamiento TDI</title>
  </head>
  <body class="bg-gray-50">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 🎨 Tailwind

**postcss.config.cjs**
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**tailwind.config.ts**
```ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tdi: {
          yellow: '#FFD60A',
          black: '#0A0A0A',
          gray: {
            50: '#F5F5F5',
            200: '#E5E7EB'
          }
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      }
    }
  },
  plugins: []
} satisfies Config
```

**src/index.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
.dark { color-scheme: dark; }

/**** Utilidades ****/
.card { @apply bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800; }
.btn { @apply inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800; }
.btn-primary { @apply bg-tdi-yellow border-transparent hover:brightness-95; }
.input { @apply w-full rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2; }
.label { @apply text-sm font-medium; }
.badge { @apply inline-flex items-center rounded-full bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 text-xs font-medium; }
.icon-btn { @apply rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-neutral-800; }

.progress { @apply h-3 w-full rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden; }
.progress > div { @apply h-full bg-tdi-yellow; }
```

---

## ⚙️ src/config.ts
```ts
export const META_CLP = 50_000_000 as const
export const STORAGE_KEY = 'tdi-financiamiento-v1'
```

---

## 🧩 src/types.ts
```ts
export type CategoriaId =
  | 'postulacion_fondos'
  | 'donaciones'
  | 'colectas'
  | 'actividades'
  | 'rifas'
  | 'cuotas'

export type Item = {
  id: string
  categoria: CategoriaId
  nombre: string
  montoCLP: number // entero > 0
  visible: boolean // default true
  notas?: string
  fecha: string // ISO date (editable)
  createdAt: string // ISO
  updatedAt: string // ISO
}

export type ChartType = 'pie' | 'bar'

export type AppState = {
  metaCLP: number
  items: Item[]
  // UI state
  selectedCategory: CategoriaId | null
  showHiddenInCategory: boolean
  chartType: ChartType

  // CRUD
  addItem: (i: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'visible'> & { visible?: boolean }) => void
  updateItem: (id: string, patch: Partial<Item>) => void
  deleteItem: (id: string) => void
  toggleVisible: (id: string) => void
  setSelectedCategory: (c: CategoriaId | null) => void
  setShowHiddenInCategory: (v: boolean) => void
  setChartType: (t: ChartType) => void

  // import/export
  importState: (data: { metaCLP?: number; items: Item[] }) => void
  exportState: () => string
  clearAll: () => void
}
```

---

## 🔧 src/lib/format.ts
```ts
export const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
export const fmtCLP = (n: number) => clp.format(Math.round(n))

export const fmtPct = (n: number) => `${n.toFixed(1)}%`

export const categoriaLabel = {
  postulacion_fondos: 'Postulación a Fondos',
  donaciones: 'Donaciones',
  colectas: 'Colectas',
  actividades: 'Actividades',
  rifas: 'Rifas',
  cuotas: 'Cuotas'
} as const

export const sortBy = <T, K extends keyof T>(arr: T[], key: K, dir: 'asc' | 'desc' = 'asc') =>
  [...arr].sort((a, b) => (a[key]! < b[key]! ? (dir === 'asc' ? -1 : 1) : a[key]! > b[key]! ? (dir === 'asc' ? 1 : -1) : 0))
```

---

## 🗃️ src/lib/storage.ts
```ts
import { STORAGE_KEY } from '@/config'
import type { Item } from '@/types'

export type Persisted = { metaCLP: number; items: Item[] }

export const storage = {
  load(): Persisted | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const data = JSON.parse(raw)
      if (!data || !Array.isArray(data.items)) return null
      return data
    } catch {
      return null
    }
  },
  save(data: Persisted) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Error guardando en localStorage', e)
    }
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY)
  }
}
```

---

## 🌱 src/lib/seed.ts
```ts
import type { Item } from '@/types'
import { addDays, subDays } from 'date-fns'
import { uid } from './uid'

const iso = (d: Date) => d.toISOString()

export const seedItems = (): Item[] => {
  const now = new Date()
  return [
    // Postulación a Fondos
    { id: uid(), categoria: 'postulacion_fondos', nombre: 'Fondo Juventud Araucanía', montoCLP: 4_000_000, visible: true, notas: 'Resolución en trámite', fecha: iso(subDays(now, 30)), createdAt: iso(now), updatedAt: iso(now) },
    { id: uid(), categoria: 'postulacion_fondos', nombre: 'Fondo Social Municipal', montoCLP: 2_000_000, visible: true, fecha: iso(subDays(now, 20)), createdAt: iso(now), updatedAt: iso(now) },

    // Donaciones
    { id: uid(), categoria: 'donaciones', nombre: 'Empresa X', montoCLP: 3_500_000, visible: true, fecha: iso(subDays(now, 15)), createdAt: iso(now), updatedAt: iso(now) },
    { id: uid(), categoria: 'donaciones', nombre: 'Exalumnos UC', montoCLP: 1_200_000, visible: true, fecha: iso(subDays(now, 10)), createdAt: iso(now), updatedAt: iso(now) },

    // Colectas
    { id: uid(), categoria: 'colectas', nombre: 'Colecta semáforo Apoquindo', montoCLP: 850_000, visible: true, fecha: iso(subDays(now, 7)), createdAt: iso(now), updatedAt: iso(now) },
    { id: uid(), categoria: 'colectas', nombre: 'Colecta campus San Joaquín', montoCLP: 420_000, visible: true, fecha: iso(subDays(now, 6)), createdAt: iso(now), updatedAt: iso(now) },

    // Actividades
    { id: uid(), categoria: 'actividades', nombre: 'Bingo solidario', montoCLP: 1_100_000, visible: true, fecha: iso(subDays(now, 12)), createdAt: iso(now), updatedAt: iso(now) },
    { id: uid(), categoria: 'actividades', nombre: 'Asado pro-fondos', montoCLP: 650_000, visible: true, fecha: iso(subDays(now, 9)), createdAt: iso(now), updatedAt: iso(now) },

    // Rifas
    { id: uid(), categoria: 'rifas', nombre: 'Rifa bicicleta', montoCLP: 900_000, visible: true, fecha: iso(subDays(now, 14)), createdAt: iso(now), updatedAt: iso(now) },
    { id: uid(), categoria: 'rifas', nombre: 'Rifa gift cards', montoCLP: 380_000, visible: true, fecha: iso(subDays(now, 8)), createdAt: iso(now), updatedAt: iso(now) },

    // Cuotas
    { id: uid(), categoria: 'cuotas', nombre: 'Cuotas 1° giro', montoCLP: 1_500_000, visible: true, fecha: iso(addDays(now, -5)), createdAt: iso(now), updatedAt: iso(now) },
    { id: uid(), categoria: 'cuotas', nombre: 'Cuotas 2° giro', montoCLP: 1_050_000, visible: true, fecha: iso(addDays(now, -2)), createdAt: iso(now), updatedAt: iso(now) }
  ]
}
```

---

## 🔑 src/lib/uid.ts
```ts
export const uid = () => crypto.randomUUID()
```

---

## 📐 src/lib/metrics.ts
```ts
import type { CategoriaId, Item } from '@/types'

export const visibleItems = (items: Item[]) => items.filter(i => i.visible)

export const totalVisible = (items: Item[]) => visibleItems(items).reduce((acc, i) => acc + i.montoCLP, 0)

export const totalVisibleByCategory = (items: Item[], cat: CategoriaId) =>
  items.filter(i => i.visible && i.categoria === cat).reduce((acc, i) => acc + i.montoCLP, 0)

export const countByCategory = (items: Item[], cat: CategoriaId) => items.filter(i => i.categoria === cat).length

export const categoriaIds: CategoriaId[] = [
  'postulacion_fondos',
  'donaciones',
  'colectas',
  'actividades',
  'rifas',
  'cuotas'
]
```

---

## 🗂️ src/store/appStore.ts (Zustand + persistencia)
```ts
import { create } from 'zustand'
import { META_CLP } from '@/config'
import type { AppState, Item } from '@/types'
import { storage } from '@/lib/storage'
import { seedItems } from '@/lib/seed'
import { uid } from '@/lib/uid'

const persisted = storage.load()

export const useApp = create<AppState>((set, get) => ({
  metaCLP: persisted?.metaCLP ?? META_CLP,
  items: persisted?.items ?? seedItems(),
  selectedCategory: null,
  showHiddenInCategory: false,
  chartType: 'pie',

  addItem: (payload) => {
    const now = new Date().toISOString()
    const item: Item = {
      id: uid(),
      visible: payload.visible ?? true,
      createdAt: now,
      updatedAt: now,
      ...payload
    }
    set(s => ({ items: [item, ...s.items] }))
    persist()
  },

  updateItem: (id, patch) => {
    const now = new Date().toISOString()
    set(s => ({ items: s.items.map(i => i.id === id ? { ...i, ...patch, updatedAt: now } : i) }))
    persist()
  },

  deleteItem: (id) => {
    set(s => ({ items: s.items.filter(i => i.id !== id) }))
    persist()
  },

  toggleVisible: (id) => {
    set(s => ({ items: s.items.map(i => i.id === id ? { ...i, visible: !i.visible, updatedAt: new Date().toISOString() } : i) }))
    persist()
  },

  setSelectedCategory: (c) => set({ selectedCategory: c }),
  setShowHiddenInCategory: (v) => set({ showHiddenInCategory: v }),
  setChartType: (t) => set({ chartType: t }),

  importState: (data) => {
    set({ metaCLP: data.metaCLP ?? META_CLP, items: data.items })
    persist()
  },

  exportState: () => {
    const s = get()
    const obj = { metaCLP: s.metaCLP, items: s.items }
    return JSON.stringify(obj, null, 2)
  },

  clearAll: () => {
    set({ items: [] })
    persist()
  }
}))

function persist() {
  const s = useApp.getState()
  storage.save({ metaCLP: s.metaCLP, items: s.items })
}
```

---

## 🧠 src/main.tsx
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

## 🧭 src/App.tsx (layout + wiring)
```tsx
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { ProgressCard } from '@/components/ProgressCard'
import { ChartCard } from '@/components/ChartCard'
import { CategoryView } from '@/components/CategoryView'
import { useApp } from '@/store/appStore'
import { ToastViewport } from '@/components/Toast'

export default function App() {
  const selected = useApp(s => s.selectedCategory)
  return (
    <div className="min-h-screen bg-tdi-gray-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Topbar />
          <div className="p-4 lg:p-6 grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <ProgressCard />
              <ChartCard />
            </div>
            <CategoryView key={selected ?? 'all'} />
          </div>
        </main>
      </div>
      <ToastViewport />
    </div>
  )
}
```

---

## 🧱 src/components/Sidebar.tsx
```tsx
import { useApp } from '@/store/appStore'
import { categoriaLabel } from '@/lib/format'
import { categoriaIds, totalVisibleByCategory, countByCategory } from '@/lib/metrics'
import { fmtCLP } from '@/lib/format'
import { HandCoins, PiggyBank, HandHeart, BarChart4, TicketPercent, Users } from 'lucide-react'

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
      <div className="flex items-center gap-3 mb-2">
        <div className="size-9 rounded-xl bg-tdi-yellow" />
        <div>
          <div className="font-bold">Financiamiento TDI</div>
          <div className="text-xs text-neutral-500">Meta CLP $50.000.000</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {categoriaIds.map((c) => {
          const total = fmtCLP(totalVisibleByCategory(items, c))
          const count = countByCategory(items, c)
          const Icon = icons[c]
          const active = selectedCategory === c
          return (
            <button
              key={c}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-neutral-800 ${active ? 'bg-gray-100 dark:bg-neutral-800' : ''}`}
              onClick={() => setSelectedCategory(c)}
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4" aria-hidden />
                <span className="font-medium">{categoriaLabel[c]}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="badge" title="Total visible">{total}</span>
                <span className="badge" title="# ítems">{count}</span>
              </span>
            </button>
          )
        })}
      </nav>

      <button className="mt-auto text-sm text-neutral-500 hover:underline" onClick={() => useApp.getState().setSelectedCategory(null)}>
        Ver todo
      </button>
    </aside>
  )
}
```

---

## 🧱 src/components/Topbar.tsx
```tsx
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
```

---

## 📊 src/components/ProgressCard.tsx
```tsx
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
```

---

## 📈 src/components/ChartCard.tsx
```tsx
import { useApp } from '@/store/appStore'
import { categoriaIds } from '@/lib/metrics'
import { categoriaLabel, fmtCLP } from '@/lib/format'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORS = ['#FFD60A', '#FFC300', '#FFB703', '#F59E0B', '#D97706', '#A16207']

export function ChartCard() {
  const { items, chartType } = useApp()

  const data = categoriaIds.map((c, idx) => ({
    key: c,
    name: categoriaLabel[c],
    value: items.filter(i => i.visible && i.categoria === c).reduce((a, b) => a + b.montoCLP, 0),
    fill: COLORS[idx % COLORS.length]
  }))

  return (
    <section className="card p-5">
      <h2 className="font-semibold mb-3">Distribución por categoría</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie dataKey="value" data={data} nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={1}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <RTooltip formatter={(v: any, _n: any, p: any) => [fmtCLP(v), p?.payload?.name]} />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tickFormatter={(v) => fmtCLP(v)} width={90} />
              <RTooltip formatter={(v: any, _n: any, p: any) => [fmtCLP(v), p?.payload?.name]} />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  )}
```

---

## 📋 src/components/CategoryView.tsx
```tsx
import { useApp } from '@/store/appStore'
import { categoriaLabel, fmtCLP, sortBy } from '@/lib/format'
import { totalVisibleByCategory } from '@/lib/metrics'
import { Eye, EyeOff, Pencil, Trash2, Filter, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ItemFormModal } from './ItemFormModal'
import { ConfirmDialog } from './ConfirmDialog'
import { EmptyState } from './EmptyState'

export function CategoryView() {
  const { items, selectedCategory, showHiddenInCategory, setShowHiddenInCategory, toggleVisible } = useApp()
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<'montoCLP'|'fecha'>('fecha')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc')
  const [editId, setEditId] = useState<string | null>(null)
  const [delId, setDelId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = items
    if (selectedCategory) list = list.filter(i => i.categoria === selectedCategory)
    if (!showHiddenInCategory) list = list.filter(i => i.visible)
    if (query) list = list.filter(i => i.nombre.toLowerCase().includes(query.toLowerCase()))
    return sortBy(list, sortKey, sortDir)
  }, [items, selectedCategory, showHiddenInCategory, query, sortKey, sortDir])

  const totalCat = selectedCategory ? totalVisibleByCategory(items, selectedCategory) : null

  return (
    <section className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-semibold">
          {selectedCategory ? `Categoría: ${categoriaLabel[selectedCategory]}` : 'Todos los ítems'}
        </h2>
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showHiddenInCategory} onChange={e => setShowHiddenInCategory(e.target.checked)} /> Ver también ocultos</label>
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Filter className="size-4" />
            <input className="input" placeholder="Buscar por nombre…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className="btn" onClick={() => setSortDir(d => d==='asc'?'desc':'asc')}>
              <ArrowUpDown className="size-4" /> Orden: {sortKey} {sortDir}
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={selectedCategory ? 'Aún no hay ítems en esta categoría' : 'No hay ítems'} cta="Agregar ítem desde el botón superior" />
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-500">
              <tr>
                <th className="py-2">Nombre</th>
                <th className="py-2">Monto</th>
                <th className="py-2">Fecha</th>
                <th className="py-2">Visibilidad</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-t border-gray-200 dark:border-neutral-800">
                  <td className="py-2 pr-2">{i.nombre}</td>
                  <td className="py-2 pr-2 font-medium">{fmtCLP(i.montoCLP)}</td>
                  <td className="py-2 pr-2">{i.fecha.slice(0,10)}</td>
                  <td className="py-2 pr-2">
                    <button className="icon-btn" aria-label="Alternar visibilidad" onClick={() => toggleVisible(i.id)}>
                      {i.visible ? <Eye className="size-5" aria-hidden /> : <EyeOff className="size-5" aria-hidden />}
                    </button>
                  </td>
                  <td className="py-2 pr-2 flex gap-1">
                    <button className="icon-btn" aria-label="Editar" onClick={() => setEditId(i.id)}><Pencil className="size-5" /></button>
                    <button className="icon-btn" aria-label="Eliminar" onClick={() => setDelId(i.id)}><Trash2 className="size-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCategory && (
        <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Total visible de la categoría: <span className="font-semibold">{fmtCLP(totalCat ?? 0)}</span>
        </div>
      )}

      <ItemFormModal open={editId !== null} onOpenChange={(o) => !o && setEditId(null)} editId={editId ?? undefined} />
      <ConfirmDialog id={delId} onClose={() => setDelId(null)} />
    </section>
  )
}
```

---

## 🧾 src/components/ItemFormModal.tsx
```tsx
import { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/store/appStore'
import type { CategoriaId } from '@/types'
import { categoriaLabel } from '@/lib/format'
import { showToast } from './Toast'

const cats: { id: CategoriaId; name: string }[] = [
  'postulacion_fondos','donaciones','colectas','actividades','rifas','cuotas'
].map((c) => ({ id: c as CategoriaId, name: (categoriaLabel as any)[c] }))

type Props = { open: boolean; onOpenChange: (v: boolean) => void; editId?: string }

export function ItemFormModal({ open, onOpenChange, editId }: Props) {
  const { addItem, updateItem, items, selectedCategory } = useApp()
  const editing = useMemo(() => items.find(i => i.id === editId), [items, editId])

  const [categoria, setCategoria] = useState<CategoriaId>(selectedCategory ?? 'donaciones')
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState<number | ''>('')
  const [notas, setNotas] = useState('')
  const [fecha, setFecha] = useState<string>(new Date().toISOString().slice(0,10))

  useEffect(() => {
    if (editing) {
      setCategoria(editing.categoria)
      setNombre(editing.nombre)
      setMonto(editing.montoCLP)
      setNotas(editing.notas ?? '')
      setFecha(editing.fecha.slice(0,10))
    } else if (open) {
      setCategoria(selectedCategory ?? 'donaciones')
      setNombre('')
      setMonto('')
      setNotas('')
      setFecha(new Date().toISOString().slice(0,10))
    }
  }, [open, editing, selectedCategory])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validaciones
    if (!nombre.trim()) { showToast('El nombre es obligatorio'); return }
    const val = typeof monto === 'string' ? parseInt(monto) : monto
    if (!Number.isInteger(val) || val <= 0) { showToast('El monto debe ser un entero CLP > 0'); return }

    const isoDate = new Date(fecha).toISOString()

    if (editing) {
      updateItem(editing.id, { nombre, montoCLP: val, notas: notas || undefined, categoria, fecha: isoDate })
      showToast('Ítem actualizado')
    } else {
      addItem({ nombre, montoCLP: val, notas: notas || undefined, categoria, fecha: isoDate })
      showToast('Ítem agregado')
    }
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" role="dialog" aria-modal>
      <form onSubmit={onSubmit} className="card w-full max-w-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{editing ? 'Editar ítem' : 'Agregar ítem'}</h3>
          <button type="button" className="icon-btn" onClick={() => onOpenChange(false)} aria-label="Cerrar">✕</button>
        </div>

        <div className="grid gap-3">
          <label className="label">Categoría
            <select className="input mt-1" value={categoria} onChange={e => setCategoria(e.target.value as CategoriaId)}>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>

          <label className="label">Nombre
            <input className="input mt-1" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej.: Rifa notebook" required />
          </label>

          <label className="label">Monto (CLP)
            <input className="input mt-1" inputMode="numeric" pattern="[0-9]*" value={monto} onChange={e => setMonto(e.target.value === '' ? '' : Number(e.target.value.replace(/\D/g,'')))} placeholder="Ej.: 500000" required />
          </label>

          <label className="label">Fecha
            <input className="input mt-1" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
          </label>

          <label className="label">Notas (opcional)
            <textarea className="input mt-1" value={notas} onChange={e => setNotas(e.target.value)} rows={3} />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="btn" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  )
}
```

---

## 🗑️ src/components/ConfirmDialog.tsx
```tsx
import { useApp } from '@/store/appStore'
import { showToast } from './Toast'

type Props = { id: string | null, onClose: () => void }

export function ConfirmDialog({ id, onClose }: Props) {
  const del = useApp(s => s.deleteItem)
  if (!id) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" role="dialog" aria-modal>
      <div className="card w-full max-w-sm p-5">
        <h3 className="font-semibold mb-2">Eliminar ítem</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Esta acción no se puede deshacer.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => { del(id); onClose(); showToast('Ítem eliminado') }}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}
```

---

## ℹ️ src/components/EmptyState.tsx
```tsx
export function EmptyState({ title, cta }: { title: string, cta?: string }) {
  return (
    <div className="text-center py-10 text-neutral-600 dark:text-neutral-400">
      <div className="text-lg font-medium mb-1">{title}</div>
      {cta && <div className="text-sm">{cta}</div>}
    </div>
  )
}
```

---

## 🧰 src/components/Toast.tsx (toasts mínimos accesibles)
```tsx
import { useEffect, useState } from 'react'

let push: ((msg: string) => void) | null = null

export function showToast(message: string) {
  push?.(message)
}

export function ToastViewport() {
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])
  useEffect(() => {
    push = (msg: string) => {
      const id = Date.now()
      setToasts((t) => [...t, { id, msg }])
      setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), 2500)
    }
    return () => { push = null }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} role="status" className="card px-3 py-2 text-sm shadow-lg">{t.msg}</div>
      ))}
    </div>
  )
}
```

---

## 🧩 src/components/IconButton.tsx
```tsx
import { type ButtonHTMLAttributes } from 'react'

export function IconButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...rest } = props
  return <button className={`icon-btn ${className}`} {...rest} />
}
```

---

## 🧪 Tests (Vitest)

**src/tests/format.test.ts**
```ts
import { describe, it, expect } from 'vitest'
import { fmtCLP } from '@/lib/format'

describe('fmtCLP', () => {
  it('formatea sin decimales', () => {
    expect(fmtCLP(1234567)).toMatch(/\$\s?1\.?234\.?567/)
  })
})
```

**src/tests/totals.test.ts**
```ts
import { describe, it, expect } from 'vitest'
import { totalVisible, totalVisibleByCategory } from '@/lib/metrics'
import type { Item } from '@/types'

const sample: Item[] = [
  { id: '1', categoria: 'donaciones', nombre: 'A', montoCLP: 1000, visible: true, fecha: new Date().toISOString(), createdAt: '', updatedAt: '' },
  { id: '2', categoria: 'donaciones', nombre: 'B', montoCLP: 2000, visible: false, fecha: new Date().toISOString(), createdAt: '', updatedAt: '' },
  { id: '3', categoria: 'rifas', nombre: 'R', montoCLP: 3000, visible: true, fecha: new Date().toISOString(), createdAt: '', updatedAt: '' }
]

describe('totales', () => {
  it('suma solo visibles', () => {
    expect(totalVisible(sample)).toBe(4000)
  })
  it('por categoría considera visibles', () => {
    expect(totalVisibleByCategory(sample, 'donaciones')).toBe(1000)
  })
})
```

---

## ✅ Criterios de aceptación (checklist)

- [x] **Meta fija**: 50.000.000 CLP en `src/config.ts`.
- [x] **Total visible**: suma de ítems `visible=true`.
- [x] **% progreso** con `min(100, ...)` y mensaje "+$X sobre la meta" si excede.
- [x] **Selector gráfico** Torta/Barras (solo visibles) en Topbar.
- [x] **Navbar** izquierda con totales visibles por categoría y badge de cantidad de ítems.
- [x] **Vista categoría**: lista con nombre, monto, fecha, ojo (toggle), editar, eliminar. Filtro "ver también ocultos".
- [x] **Crear/editar ítem** en modal con validaciones (nombre obligatorio, monto entero > 0, fecha editable, notas opcional).
- [x] **Persistencia**: localStorage (servicio desacoplado) + exportar/importar JSON.
- [x] **Accesibilidad**: labels, roles, aria-label en icono de visibilidad.
- [x] **Formato monetario**: `Intl.NumberFormat('es-CL',{currency:'CLP', maximumFractionDigits:0})`.
- [x] **Responsive** (layout en grid), **modo oscuro** listo (toggle en Topbar).
- [x] **Tests**: formateo CLP y totales visibles.

---

## 📝 README.md

```md
# Financiamiento TDI (Vite + React + TS)

App para monitorear y alcanzar la meta de **CLP $50.000.000** con categorías e ítems visibles/ocultos, gráficos y persistencia local.

## Stack
- React + Vite + TypeScript
- **Zustand** (estado global)
- **Recharts** (gráficos torta/barras)
- **TailwindCSS** (UI)

> Elegimos **Zustand** por su simplicidad y bajo boilerplate para un MVP; y **Recharts** por su enfoque declarativo y responsivo.

## Correr
```bash
npm i
npm run dev
```
Abrir `http://localhost:5173`.

## Funcionalidades clave
- Meta fija de $50.000.000 (ver `src/config.ts`).
- Progreso con barra y porcentaje; muestra sobrecumplimiento.
- Selector de gráfico Torta/Barras (solo ítems visibles).
- Navbar con 6 categorías y totales visibles + cantidad de ítems.
- Vista de categoría con CRUD, ocultar/mostrar (ojo), filtro "ver también ocultos".
- Importar/Exportar JSON.
- Modo oscuro (toggle) y diseño responsive.
- Formato CLP local (es-CL, sin decimales).

## Datos
- Carga datos de ejemplo (semilla) en el primer arranque. Persistencia en `localStorage`.
- Exporta a un JSON con `{ metaCLP, items }`. Importa el mismo formato.

## Accesibilidad
- Navegable con teclado, labels en inputs, `aria-label` en icono de visibilidad.

## Tests
```bash
npm run test
```
Incluye pruebas para formateo CLP y totales visibles.

## Próximos pasos (opcional)
- Filtro por rango de fechas.
- Exportar CSV.
- KPIs adicionales (ticket promedio, # de ítems por categoría, etc.).
- Migrar persistencia a Supabase/SQLite manteniendo el servicio de `storage`.
```

---

### Notas finales
- Toda la **interfaz está en español chileno** y los **montos en CLP**.
- Ítems **ocultos no se contabilizan** en totales ni gráficos.
- La arquitectura deja preparado cambiar `storage` a una base real sin modificar UI/estado.

