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