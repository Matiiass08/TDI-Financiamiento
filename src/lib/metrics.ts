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