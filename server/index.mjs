import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const dataDir = process.env.DATA_DIR || path.join(rootDir, 'data')
const statePath = path.join(dataDir, 'tdi-financiamiento-state.json')
const isProduction = process.env.NODE_ENV === 'production'
const accessKey = process.env.ACCESS_KEY || (isProduction ? '' : 'tdi-dev')
const sessionSecret = process.env.SESSION_SECRET || accessKey
const app = express()

if (!accessKey) {
  console.warn('ACCESS_KEY no esta configurada. El login quedara deshabilitado.')
}

app.use(express.json({ limit: '1mb' }))

app.get('/api/session', (req, res) => {
  res.json({ authenticated: isAuthenticated(req) })
})

app.post('/api/login', (req, res) => {
  if (!accessKey || req.body?.accessKey !== accessKey) {
    return res.status(401).json({ error: 'Clave incorrecta' })
  }

  res.setHeader('Set-Cookie', buildSessionCookie(sessionToken(), 60 * 60 * 24 * 30))
  res.json({ ok: true })
})

app.post('/api/logout', (_req, res) => {
  res.setHeader('Set-Cookie', buildSessionCookie('', 0))
  res.json({ ok: true })
})

app.get('/api/state', requireAuth, async (_req, res, next) => {
  try {
    const state = await readState()
    res.json(state)
  } catch (error) {
    next(error)
  }
})

app.put('/api/state', requireAuth, async (req, res, next) => {
  try {
    const state = normalizeState(req.body)
    await writeState(state)
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

app.use(express.static(distDir))
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(error.status || 500).json({ error: error.message || 'Error interno' })
})

const port = Number(process.env.PORT || 3000)
app.listen(port, () => {
  console.log(`TDI Financiamiento listo en http://localhost:${port}`)
})

function requireAuth(req, res, next) {
  if (isAuthenticated(req)) return next()
  res.status(401).json({ error: 'No autorizado' })
}

function isAuthenticated(req) {
  const cookieToken = parseCookies(req.headers.cookie).tdi_session
  return Boolean(accessKey && cookieToken && safeEqual(cookieToken, sessionToken()))
}

function sessionToken() {
  return crypto.createHmac('sha256', sessionSecret).update(`tdi:${accessKey}`).digest('hex')
}

function buildSessionCookie(value, maxAgeSeconds) {
  const parts = [
    `tdi_session=${encodeURIComponent(value)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${maxAgeSeconds}`
  ]
  if (isProduction) parts.push('Secure')
  return parts.join('; ')
}

function parseCookies(header = '') {
  return header.split(';').reduce((cookies, part) => {
    const [rawKey, ...rawValue] = part.trim().split('=')
    if (!rawKey) return cookies
    cookies[rawKey] = decodeURIComponent(rawValue.join('='))
    return cookies
  }, {})
}

function safeEqual(a, b) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && crypto.timingSafeEqual(left, right)
}

async function readState() {
  try {
    const raw = await fs.readFile(statePath, 'utf8')
    return normalizeState(JSON.parse(raw))
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

async function writeState(state) {
  await fs.mkdir(dataDir, { recursive: true })
  const tmpPath = `${statePath}.${process.pid}.tmp`
  await fs.writeFile(tmpPath, JSON.stringify(state, null, 2), 'utf8')
  await fs.rename(tmpPath, statePath)
}

function normalizeState(data) {
  if (!data || !Array.isArray(data.items)) {
    const error = new Error('Formato invalido: falta items[]')
    error.status = 400
    throw error
  }

  return {
    metaCLP: Number.isFinite(data.metaCLP) ? data.metaCLP : 0,
    items: data.items
  }
}
