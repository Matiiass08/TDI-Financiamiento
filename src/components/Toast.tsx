import { useEffect, useState } from 'react'

let push: ((msg: string) => void) | null = null

export function showToast(message: string) {
  push?.(message)
}

export function ToastViewport() {
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])
  useEffect(() => {
    push = (msg: string) => {
      const id = Date.now()
      setToasts((t) => [...t, { id, msg }])
      setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), 2500)
    }
    return () => { push = null }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} role="status" className="card px-3 py-2 text-sm shadow-lg">{t.msg}</div>
      ))}
    </div>
  )
}