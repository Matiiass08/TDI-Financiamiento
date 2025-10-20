import { useApp } from '@/store/appStore'
import { showToast } from './Toast'

type Props = { id: string | null, onClose: () => void }

export function ConfirmDialog({ id, onClose }: Props) {
  const del = useApp(s => s.deleteItem)
  if (!id) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" role="dialog" aria-modal>
      <div className="card w-full max-w-sm p-5">
        <h3 className="font-semibold mb-2">Eliminar ítem</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Esta acción no se puede deshacer.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => { del(id); onClose(); showToast('Ítem eliminado') }}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}