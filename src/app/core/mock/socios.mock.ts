export interface Socio {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  piso: string;
  puerta: string;
  fechaAlta: Date;
  activo: boolean;
}

export const SOCIOS_MOCK: Socio[] = [
  {
    id: '1',
    nombre: 'Carlos',
    apellidos: 'García López',
    dni: '12345678A',
    email: 'carlos.garcia@email.com',
    telefono: '612345678',
    piso: '1',
    puerta: 'A',
    fechaAlta: new Date('2022-01-15'),
    activo: true,
  },
  {
    id: '2',
    nombre: 'María',
    apellidos: 'Martínez Ruiz',
    dni: '87654321B',
    email: 'maria.martinez@email.com',
    telefono: '698765432',
    piso: '2',
    puerta: 'B',
    fechaAlta: new Date('2021-06-20'),
    activo: true,
  },
  {
    id: '3',
    nombre: 'Juan',
    apellidos: 'Sánchez Pérez',
    dni: '11223344C',
    email: 'juan.sanchez@email.com',
    telefono: '677889900',
    piso: '3',
    puerta: 'A',
    fechaAlta: new Date('2023-03-10'),
    activo: false,
  },
  {
    id: '4',
    nombre: 'Ana',
    apellidos: 'Fernández Torres',
    dni: '44332211D',
    email: 'ana.fernandez@email.com',
    telefono: '655443322',
    piso: '4',
    puerta: 'C',
    fechaAlta: new Date('2020-11-05'),
    activo: true,
  },
];
