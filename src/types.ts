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
  isHydrating: boolean
  syncError: string | null

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
  hydrateFromServer: () => Promise<void>
  exportState: () => string
  clearAll: () => void
}
