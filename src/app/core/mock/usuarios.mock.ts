export interface Usuario {
  id: string;
  username: string;
  email: string;
  rol: 'ADMIN' | 'VECINO' | 'PRESIDENTE';
  socioId?: string;
  activo: boolean;
}

export const USUARIOS_MOCK: Usuario[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@comunidad.com',
    rol: 'ADMIN',
    activo: true,
  },
  {
    id: '2',
    username: 'carlos.garcia',
    email: 'carlos.garcia@email.com',
    rol: 'PRESIDENTE',
    socioId: '1',
    activo: true,
  },
  {
    id: '3',
    username: 'maria.martinez',
    email: 'maria.martinez@email.com',
    rol: 'VECINO',
    socioId: '2',
    activo: true,
  },
];
