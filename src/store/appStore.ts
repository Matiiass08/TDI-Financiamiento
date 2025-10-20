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