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