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