import { STORAGE_KEY } from '@/config'
import type { Item } from '@/types'

export type Persisted = { metaCLP: number; items: Item[] }
export type SessionStatus = { available: boolean; authenticated: boolean }

let remoteStorageEnabled = false

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
      if (remoteStorageEnabled) void saveRemote(data).catch((e) => console.error('Error guardando en servidor', e))
    } catch (e) {
      console.error('Error guardando en localStorage', e)
    }
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY)
  },
  usesRemote() {
    return remoteStorageEnabled
  },
  async getSession(): Promise<SessionStatus> {
    try {
      const res = await fetch('/api/session', { credentials: 'same-origin' })
      if (res.status === 404) {
        remoteStorageEnabled = false
        return { available: false, authenticated: false }
      }
      if (!res.headers.get('content-type')?.includes('application/json')) {
        remoteStorageEnabled = false
        return { available: false, authenticated: false }
      }
      if (!res.ok) {
        remoteStorageEnabled = true
        return { available: true, authenticated: false }
      }
      const data = await res.json()
      remoteStorageEnabled = true
      return { available: true, authenticated: Boolean(data.authenticated) }
    } catch {
      remoteStorageEnabled = false
      return { available: false, authenticated: false }
    }
  },
  async login(accessKey: string) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ accessKey })
    })
    if (!res.ok) throw new Error('Clave incorrecta')
    remoteStorageEnabled = true
  },
  async logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' })
    remoteStorageEnabled = false
  },
  async loadRemote(): Promise<Persisted | null> {
    const res = await fetch('/api/state', { credentials: 'same-origin' })
    if (res.status === 401) throw new Error('No autorizado')
    if (!res.ok) throw new Error('No se pudo cargar el JSON guardado')
    const data = await res.json()
    if (!data || !Array.isArray(data.items)) return null
    return data
  }
}

async function saveRemote(data: Persisted) {
  const res = await fetch('/api/state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('No se pudo guardar el JSON')
}
