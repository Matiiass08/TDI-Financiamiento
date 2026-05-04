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
  showHiddenInCategory: true,
  chartType: 'pie',
  isHydrating: false,
  syncError: null,
  lastAddedItemId: null,

  addItem: (payload) => {
    const now = new Date().toISOString()
    const item: Item = {
      ...payload,
      id: uid(),
      visible: payload.visible ?? true,
      createdAt: now,
      updatedAt: now
    }
    set((s) => {
      const items = [item, ...s.items]
      persistSnapshot(s.metaCLP, items)
      return { items, lastAddedItemId: item.id }
    })
  },

  updateItem: (id, patch) => {
    const now = new Date().toISOString()
    set((s) => {
      const items = s.items.map(i => i.id === id ? { ...i, ...patch, updatedAt: now } : i)
      persistSnapshot(s.metaCLP, items)
      return { items }
    })
  },

  deleteItem: (id) => {
    set((s) => {
      const items = s.items.filter(i => i.id !== id)
      persistSnapshot(s.metaCLP, items)
      return { items }
    })
  },

  toggleVisible: (id) => {
    set((s) => {
      const items = s.items.map(i => i.id === id ? { ...i, visible: !i.visible, updatedAt: new Date().toISOString() } : i)
      persistSnapshot(s.metaCLP, items)
      return { items }
    })
  },

  setSelectedCategory: (c) => set({ selectedCategory: c }),
  setShowHiddenInCategory: (v) => set({ showHiddenInCategory: v }),
  setChartType: (t) => set({ chartType: t }),

  importState: (data) => {
    const metaCLP = data.metaCLP ?? META_CLP
    set({ metaCLP, items: data.items, lastAddedItemId: null })
    persistSnapshot(metaCLP, data.items)
  },

  hydrateFromServer: async () => {
    set({ isHydrating: true, syncError: null })
    try {
      const data = await storage.loadRemote()
      if (data) {
        set({ metaCLP: data.metaCLP ?? META_CLP, items: data.items, lastAddedItemId: null })
        storage.save({ metaCLP: data.metaCLP ?? META_CLP, items: data.items })
      } else {
        persist()
      }
    } catch (e: any) {
      set({ syncError: e?.message ?? 'No se pudo sincronizar' })
      throw e
    } finally {
      set({ isHydrating: false })
    }
  },

  exportState: () => {
    const s = get()
    const obj = { metaCLP: s.metaCLP, items: s.items }
    return JSON.stringify(obj, null, 2)
  },

  clearAll: () => {
    set((s) => {
      persistSnapshot(s.metaCLP, [])
      return { items: [], lastAddedItemId: null }
    })
  }
}))

function persist() {
  const s = useApp.getState()
  persistSnapshot(s.metaCLP, s.items)
}

function persistSnapshot(metaCLP: number, items: Item[]) {
  storage.save({ metaCLP, items })
}
