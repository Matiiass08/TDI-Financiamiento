import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useApp } from '@/store/appStore'
import type { CategoriaId } from '@/types'
import { categoriaLabel } from '@/lib/format'
import { showToast } from './Toast'

const cats: { id: CategoriaId; name: string }[] = [
  'postulacion_fondos','donaciones','colectas','actividades','rifas','cuotas'
].map((c) => ({ id: c as CategoriaId, name: (categoriaLabel as any)[c] }))

type Props = { open: boolean; onOpenChange: (v: boolean) => void; editId?: string }

export function ItemFormModal({ open, onOpenChange, editId }: Props) {
  const { addItem, updateItem, items, selectedCategory, setSelectedCategory } = useApp()
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
    const cleanName = nombre.trim()
    const cleanNotes = notas.trim()
    if (!cleanName) { showToast('El nombre es obligatorio'); return }
    const val = typeof monto === 'string' ? parseInt(monto) : monto
    if (!Number.isInteger(val) || val === 0) {
      showToast('El monto debe ser un entero distinto de 0 (positivo o negativo)')
      return
    }


    if (!fecha) {
      showToast('La fecha es obligatoria')
      return
    }

    const dateValue = new Date(`${fecha}T12:00:00`)
    if (Number.isNaN(dateValue.getTime())) {
      showToast('La fecha no es válida')
      return
    }

    const isoDate = dateValue.toISOString()

    if (editing) {
      updateItem(editing.id, { nombre: cleanName, montoCLP: val, notas: cleanNotes || undefined, categoria, fecha: isoDate })
      showToast('Ítem actualizado')
    } else {
      addItem({ nombre: cleanName, montoCLP: val, notas: cleanNotes || undefined, categoria, fecha: isoDate })
      if (selectedCategory && selectedCategory !== categoria) setSelectedCategory(categoria)
      showToast('Ítem agregado')
    }
    onOpenChange(false)
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-3 py-4 sm:px-6 sm:py-8" role="dialog" aria-modal>
      <form onSubmit={onSubmit} className="card mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col p-5 sm:min-h-0 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold">{editing ? 'Editar ítem' : 'Agregar ítem'}</h3>
          <button type="button" className="icon-btn" onClick={() => onOpenChange(false)} aria-label="Cerrar">✕</button>
        </div>

        <div className="grid flex-1 content-start gap-4 sm:grid-cols-2">
          <label className="label">Categoría
            <select className="input mt-1" value={categoria} onChange={e => setCategoria(e.target.value as CategoriaId)}>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>

          <label className="label">Nombre
            <input className="input mt-1" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej.: Rifa notebook" required />
          </label>

          <label className="label">Monto (CLP)
            <input
              className="input mt-1"
              type="number"
              value={monto}
              onChange={e => setMonto(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Ej.: 500000 o -250000"
              required
            />
          </label>

          <label className="label">Fecha
            <input className="input mt-1" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
          </label>

          <label className="label sm:col-span-2">Notas (opcional)
            <textarea className="input mt-1 min-h-28" value={notas} onChange={e => setNotas(e.target.value)} rows={4} />
          </label>
        </div>

        <div className="sticky bottom-0 -mx-5 mt-6 flex justify-end gap-2 border-t border-gray-200 bg-white px-5 pt-4 max-sm:flex-col-reverse dark:border-white/10 dark:bg-slate-900 sm:-mx-7 sm:px-7">
          <button type="button" className="btn" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </form>
    </div>,
    document.body
  )
}
