import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PrestamoRegistro {
  id: number;
  fechaInicio: Date;
  fechaFin: Date | null;
  prestadoA: string;
  anotaciones: string;
}

export interface Objeto {
  id: string;
  nombre: string;
  referencia: string;
  descripcion: string;
  sitioGuardado: string;
  prestadoActual: boolean;
  prestamos: PrestamoRegistro[];
}

@Injectable({ providedIn: 'root' })
export class PrestamoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/api/v1/objeto';

  constructor() {}

  getObjetos(): Observable<Objeto[]> {
    return this.http.get<Objeto[]>(`${this.apiUrl}/all`);
  }
  //metodo obtener solo disponibles
  getDisponibles(): Observable<Objeto[]> {
    return this.http.get<Objeto[]>(`${this.apiUrl}/disponibles`);
  }
  //metodo obtener solo prestados
  getPrestados(): Observable<Objeto[]> {
    return this.http.get<Objeto[]>(`${this.apiUrl}/prestados`);
  }

  addObjeto(objeto: {
    nombre: string;
    descripcion: string;
    sitioGuardado: string;
  }): Observable<Objeto> {
    return this.http.post<Objeto>(`${this.apiUrl}/add`, objeto);
  }

  prestarObjeto(
    nombre: string,
    prestamoData: {
      esDeAva: boolean;
      entidadAjena: string;
      inicioPrestamo: { anotaciones: string };
    },
  ): Observable<Objeto> {
    return this.http.post<Objeto>(`${this.apiUrl}/prestar?nombre=${nombre}`, prestamoData);
  }

  devolverObjeto(nombre: string, anotaciones: string): Observable<Objeto> {
    return this.http.put<Objeto>(
      `${this.apiUrl}/devolver?nombre=${nombre}&anotaciones=${anotaciones}`,
      {},
    );
  }

  eliminarObjeto(nombre: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete?nombre=${nombre}`, { responseType: 'text' });
  }
}
