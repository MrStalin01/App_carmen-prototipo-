import { Injectable, signal } from '@angular/core';

export interface PrestamoRegistro {
  id: number;
  fechaInicio: Date;
  fechaFin: Date | null;
  prestadoA: string;
  anotaciones: string;
}

export interface objeto {
  id: number;
  nombre: string;
  referencia: string;
  descripcion: string;
  sitioGuardado: string;
  prestadoActual: boolean;
  prestamos: PrestamoRegistro[];
}

@Injectable({ providedIn: 'root' })
export class PrestamoService {
  private nextId = 1;
  private nextPrestamoId = 1;

  objetos = signal<objeto[]>([
    {
      id: this.nextId++,
      nombre: 'Martillo',
      referencia: '',
      descripcion: 'Martillo de carpintero',
      sitioGuardado: 'Cajón rojo',
      prestadoActual: false,
      prestamos: [],
    },
    {
      id: this.nextId++,
      nombre: 'Taladro',
      referencia: '',
      descripcion: 'Taladro percutor',
      sitioGuardado: 'Estante azul',
      prestadoActual: true,
      prestamos: [
        {
          id: this.nextPrestamoId++,
          fechaInicio: new Date(2026, 4, 10),
          fechaFin: null,
          prestadoA: 'Juan Pérez',
          anotaciones: 'Préstamo de ejemplo',
        },
      ],
    },
    {
      id: this.nextId++,
      nombre: 'Destornillador',
      referencia: '',
      descripcion: 'Destornillador de estrella',
      sitioGuardado: 'Cajón pequeño',
      prestadoActual: false,
      prestamos: [],
    },
  ]);

  getObjetos() {
    return this.objetos();
  }
  //metodo obtener solo disponibles
  getDisponibles() {
    return this.objetos().filter((o) => !o.prestadoActual);
  }
  //metodo obtener solo prestados
  getPrestados() {
    return this.objetos().filter((o) => o.prestadoActual);
  }

  addObjeto(nombre: string, descripcion: string, sitioGuardado: string) {
    this.objetos.update((lista) => [
      ...lista,
      {
        id: this.nextId++,
        nombre,
        referencia: '',
        descripcion,
        sitioGuardado,
        prestadoActual: false,
        prestamos: [],
      },
    ]);
  }

  prestarObjeto(id: number, prestadoA: string, anotaciones: string) {
    this.objetos.update((lista) =>
      lista.map((objeto) => {
        if (objeto.id === id && !objeto.prestadoActual) {
          const nuevoPrestamo = {
            id: this.nextPrestamoId++,
            fechaInicio: new Date(),
            fechaFin: null,
            prestadoA,
            anotaciones,
          };
          return {
            ...objeto,
            prestadoActual: true,
            prestamos: [...objeto.prestamos, nuevoPrestamo],
          };
        }
        return objeto;
      }),
    );
  }
  devolverObjeto(id: number, anotacionesDevolucion: string) {
    this.objetos.update((lista) =>
      lista.map((objeto) => {
        if (objeto.id === id && objeto.prestadoActual) {
          const prestamosActualizados = [...objeto.prestamos];
          const ultimoPrestamo = prestamosActualizados[prestamosActualizados.length - 1];
          if (ultimoPrestamo) {
            ultimoPrestamo.fechaFin = new Date();
            // Puedes guardar las anotaciones de devolución donde quieras
          }
          return {
            ...objeto,
            prestadoActual: false,
            prestamos: prestamosActualizados,
          };
        }
        return objeto;
      }),
    );
  }

  eliminarObjeto(id: number) {
    this.objetos.update((lista) => lista.filter((objeto) => objeto.id !== id));
  }
}
