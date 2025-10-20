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