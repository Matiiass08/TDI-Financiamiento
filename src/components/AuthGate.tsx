import { FormEvent, ReactNode, useEffect, useState } from 'react'
import { LockKeyhole } from 'lucide-react'
import { storage } from '@/lib/storage'
import { useApp } from '@/store/appStore'

type GateState = 'checking' | 'locked' | 'ready'

export function AuthGate({ children }: { children: ReactNode }) {
  const hydrateFromServer = useApp(s => s.hydrateFromServer)
  const syncError = useApp(s => s.syncError)
  const [gateState, setGateState] = useState<GateState>('checking')
  const [accessKey, setAccessKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let alive = true

    async function boot() {
      const session = await storage.getSession()
      if (!alive) return

      if (!session.available) {
        setGateState('ready')
        return
      }

      if (!session.authenticated) {
        setGateState('locked')
        return
      }

      try {
        await hydrateFromServer()
        if (alive) setGateState('ready')
      } catch {
        if (alive) setGateState('locked')
      }
    }

    void boot()
    return () => {
      alive = false
    }
  }, [hydrateFromServer])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await storage.login(accessKey)
      await hydrateFromServer()
      setGateState('ready')
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo entrar')
    } finally {
      setSubmitting(false)
    }
  }

  if (gateState === 'checking') {
    return (
      <div className="min-h-screen grid place-items-center bg-tdi-gray-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="text-sm text-neutral-500">Cargando...</div>
      </div>
    )
  }

  if (gateState === 'locked') {
    return (
      <div className="min-h-screen grid place-items-center bg-tdi-gray-50 px-4 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <form className="w-full max-w-sm card p-5 grid gap-4" onSubmit={onSubmit}>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-tdi-yellow text-neutral-950">
              <LockKeyhole className="size-5" />
            </div>
            <div>
              <h1 className="font-semibold">Financiamiento TDI</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Acceso privado</p>
            </div>
          </div>

          <label className="grid gap-2">
            <span className="label">Clave</span>
            <input
              className="input"
              type="password"
              value={accessKey}
              autoFocus
              onChange={(event) => setAccessKey(event.target.value)}
            />
          </label>

          {(error || syncError) && (
            <p className="text-sm text-red-600 dark:text-red-400">{error || syncError}</p>
          )}

          <button className="btn btn-primary justify-center" type="submit" disabled={submitting}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    )
  }

  return children
}
