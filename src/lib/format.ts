export const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
export const fmtCLP = (n: number) => clp.format(Math.round(n))


export const fmtPct = (n: number) => `${n.toFixed(1)}%`


export const categoriaLabel = {
postulacion_fondos: 'Postulación a Fondos',
donaciones: 'Donaciones',
colectas: 'Colectas',
actividades: 'Actividades',
rifas: 'Rifas',
cuotas: 'Cuotas'
} as const


export const sortBy = <T, K extends keyof T>(arr: T[], key: K, dir: 'asc' | 'desc' = 'asc') =>
[...arr].sort((a, b) => (a[key]! < b[key]! ? (dir === 'asc' ? -1 : 1) : a[key]! > b[key]! ? (dir === 'asc' ? 1 : -1) : 0))