import { useApp } from '@/store/appStore'
import { categoriaLabel, fmtCLP, sortBy } from '@/lib/format'
import { totalVisibleByCategory } from '@/lib/metrics'
import { Eye, EyeOff, Pencil, Trash2, Filter, ArrowUpDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ItemFormModal } from './ItemFormModal'
import { ConfirmDialog } from './ConfirmDialog'
import { EmptyState } from './EmptyState'

export function CategoryView() {
  const { items, selectedCategory, showHiddenInCategory, setShowHiddenInCategory, toggleVisible, lastAddedItemId } = useApp()
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<'montoCLP'|'fecha'>('fecha')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc')
  const [editId, setEditId] = useState<string | null>(null)
  const [delId, setDelId] = useState<string | null>(null)
  const seenAddedItemId = useRef<string | null>(lastAddedItemId)

  useEffect(() => {
    if (!lastAddedItemId || seenAddedItemId.current === lastAddedItemId) return
    seenAddedItemId.current = lastAddedItemId
    setQuery('')
    setSortKey('fecha')
    setSortDir('desc')
  }, [lastAddedItemId])

  const filtered = useMemo(() => {
    let list = items
    if (selectedCategory) list = list.filter(i => i.categoria === selectedCategory)
    if (!showHiddenInCategory) list = list.filter(i => i.visible)
    if (query) list = list.filter(i => i.nombre.toLowerCase().includes(query.toLowerCase()))
    return sortBy(list, sortKey, sortDir)
  }, [items, selectedCategory, showHiddenInCategory, query, sortKey, sortDir])

  const totalCat = selectedCategory ? totalVisibleByCategory(items, selectedCategory) : null
  const sortLabel = sortKey === 'fecha' ? 'Fecha' : 'Monto'

  const renderControls = () => (
    <>
      <label className="flex shrink-0 items-center gap-2 text-sm">
        <input type="checkbox" checked={showHiddenInCategory} onChange={e => setShowHiddenInCategory(e.target.checked)} />
        Ver también ocultos
      </label>
      <div className="flex min-w-0 flex-1 items-center gap-2 text-sm sm:min-w-52 sm:max-w-72">
        <Filter className="size-4 shrink-0" />
        <input className="input min-w-0" placeholder="Buscar por nombre..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <select className="input w-full sm:w-32" value={sortKey} onChange={(e) => setSortKey(e.target.value as 'montoCLP'|'fecha')}>
        <option value="fecha">Fecha</option>
        <option value="montoCLP">Monto</option>
      </select>
      <button className="btn shrink-0 justify-center" onClick={() => setSortDir(d => d==='asc'?'desc':'asc')}>
        <ArrowUpDown className="size-4" /> {sortLabel}: {sortDir === 'desc' ? 'desc.' : 'asc.'}
      </button>
    </>
  )

  return (
    <section className="card p-4 sm:p-5">
      <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <h2 className="min-w-0 font-semibold">
          {selectedCategory ? `Categoría: ${categoriaLabel[selectedCategory]}` : 'Todos los ítems'}
        </h2>
        <div className="hidden min-w-0 flex-wrap items-center gap-2 sm:flex lg:justify-end">
          {renderControls()}
        </div>
      </div>

      <div className="mb-4 grid gap-2 sm:hidden">
        {renderControls()}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={selectedCategory ? 'Aún no hay ítems en esta categoría' : 'No hay ítems'} cta="Agregar ítem desde el botón superior" />
      ) : (
        <>
        <div className="grid gap-3 md:hidden">
          {filtered.map((i) => (
            <article key={i.id} className="rounded-lg border border-gray-200 bg-white/70 p-3 dark:border-white/10 dark:bg-slate-950/35">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="break-words font-medium leading-snug">{i.nombre}</h3>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-slate-400">{i.fecha.slice(0,10)}</p>
                </div>
                <div className="shrink-0 whitespace-nowrap text-right font-semibold">{fmtCLP(i.montoCLP)}</div>
              </div>
              {!selectedCategory && (
                <div className="mt-2 text-xs text-neutral-500 dark:text-slate-400">
                  {categoriaLabel[i.categoria]}
                </div>
              )}
              <div className="mt-3 flex items-center justify-end gap-1">
                <button className="icon-btn" aria-label="Alternar visibilidad" onClick={() => toggleVisible(i.id)}>
                  {i.visible ? <Eye className="size-5" aria-hidden /> : <EyeOff className="size-5" aria-hidden />}
                </button>
                <button className="icon-btn" aria-label="Editar" onClick={() => setEditId(i.id)}><Pencil className="size-5" /></button>
                <button className="icon-btn" aria-label="Eliminar" onClick={() => setDelId(i.id)}><Trash2 className="size-5" /></button>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10 md:block">
          <table className="w-full min-w-[760px] table-fixed text-sm">
            <colgroup>
              <col className={selectedCategory ? 'w-[38%]' : 'w-[30%]'} />
              {!selectedCategory && <col className="w-[22%]" />}
              <col className="w-[18%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead className="text-left text-neutral-500">
              <tr>
                <th className="px-3 py-2">Nombre</th>
                {!selectedCategory && <th className="px-3 py-2">Categoría</th>}
                <th className="px-3 py-2">Monto</th>
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2">Visibilidad</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-t border-gray-200 dark:border-white/10">
                  <td className="px-3 py-2">
                    <div className="truncate" title={i.nombre}>{i.nombre}</div>
                  </td>
                  {!selectedCategory && (
                    <td className="px-3 py-2 text-neutral-600 dark:text-slate-400">
                      <div className="truncate" title={categoriaLabel[i.categoria]}>{categoriaLabel[i.categoria]}</div>
                    </td>
                  )}
                  <td className="whitespace-nowrap px-3 py-2 font-medium">{fmtCLP(i.montoCLP)}</td>
                  <td className="whitespace-nowrap px-3 py-2">{i.fecha.slice(0,10)}</td>
                  <td className="px-3 py-2">
                    <button className="icon-btn" aria-label="Alternar visibilidad" onClick={() => toggleVisible(i.id)}>
                      {i.visible ? <Eye className="size-5" aria-hidden /> : <EyeOff className="size-5" aria-hidden />}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                    <button className="icon-btn" aria-label="Editar" onClick={() => setEditId(i.id)}><Pencil className="size-5" /></button>
                    <button className="icon-btn" aria-label="Eliminar" onClick={() => setDelId(i.id)}><Trash2 className="size-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}

      {selectedCategory && (
        <div className="mt-4 text-sm text-neutral-600 dark:text-slate-400">
          Total visible de la categoría: <span className="font-semibold">{fmtCLP(totalCat ?? 0)}</span>
        </div>
      )}

      <ItemFormModal open={editId !== null} onOpenChange={(o) => !o && setEditId(null)} editId={editId ?? undefined} />
      <ConfirmDialog id={delId} onClose={() => setDelId(null)} />
    </section>
  )
}
