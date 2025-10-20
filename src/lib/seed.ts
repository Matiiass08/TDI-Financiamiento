import type { Item } from '@/types'
import { addDays, subDays } from 'date-fns'
import { uid } from './uid'


const iso = (d: Date) => d.toISOString()


export const seedItems = (): Item[] => {
const now = new Date()
return [
// Postulación a Fondos
{ id: uid(), categoria: 'postulacion_fondos', nombre: 'Fondo Juventud Araucanía', montoCLP: 4_000_000, visible: true, notas: 'Resolución en trámite', fecha: iso(subDays(now, 30)), createdAt: iso(now), updatedAt: iso(now) },
{ id: uid(), categoria: 'postulacion_fondos', nombre: 'Fondo Social Municipal', montoCLP: 2_000_000, visible: true, fecha: iso(subDays(now, 20)), createdAt: iso(now), updatedAt: iso(now) },


// Donaciones
{ id: uid(), categoria: 'donaciones', nombre: 'Empresa X', montoCLP: 3_500_000, visible: true, fecha: iso(subDays(now, 15)), createdAt: iso(now), updatedAt: iso(now) },
{ id: uid(), categoria: 'donaciones', nombre: 'Exalumnos UC', montoCLP: 1_200_000, visible: true, fecha: iso(subDays(now, 10)), createdAt: iso(now), updatedAt: iso(now) },


// Colectas
{ id: uid(), categoria: 'colectas', nombre: 'Colecta semáforo Apoquindo', montoCLP: 850_000, visible: true, fecha: iso(subDays(now, 7)), createdAt: iso(now), updatedAt: iso(now) },
{ id: uid(), categoria: 'colectas', nombre: 'Colecta campus San Joaquín', montoCLP: 420_000, visible: true, fecha: iso(subDays(now, 6)), createdAt: iso(now), updatedAt: iso(now) },


// Actividades
{ id: uid(), categoria: 'actividades', nombre: 'Bingo solidario', montoCLP: 1_100_000, visible: true, fecha: iso(subDays(now, 12)), createdAt: iso(now), updatedAt: iso(now) },
{ id: uid(), categoria: 'actividades', nombre: 'Asado pro-fondos', montoCLP: 650_000, visible: true, fecha: iso(subDays(now, 9)), createdAt: iso(now), updatedAt: iso(now) },


// Rifas
{ id: uid(), categoria: 'rifas', nombre: 'Rifa bicicleta', montoCLP: 900_000, visible: true, fecha: iso(subDays(now, 14)), createdAt: iso(now), updatedAt: iso(now) },
{ id: uid(), categoria: 'rifas', nombre: 'Rifa gift cards', montoCLP: 380_000, visible: true, fecha: iso(subDays(now, 8)), createdAt: iso(now), updatedAt: iso(now) },


// Cuotas
{ id: uid(), categoria: 'cuotas', nombre: 'Cuotas 1° giro', montoCLP: 1_500_000, visible: true, fecha: iso(addDays(now, -5)), createdAt: iso(now), updatedAt: iso(now) },
{ id: uid(), categoria: 'cuotas', nombre: 'Cuotas 2° giro', montoCLP: 1_050_000, visible: true, fecha: iso(addDays(now, -2)), createdAt: iso(now), updatedAt: iso(now) }
]
}