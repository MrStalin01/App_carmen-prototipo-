import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class SocioService {
  constructor(private http: HttpClient) {}

  /** GET /socio/all — devuelve la lista completa de socios */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/socio/all`);
  }

  /**
   * POST /socio/add — crea un nuevo socio.
   * El payload debe seguir la estructura anidada del servidor:
   * {
   *   informacionPersonalModel: { identificacion, nombres, apellidos, correo, telefono, contrasena },
   *   estado_Socio, tipo_socio, ultimo_pago, fecha_vencimiento,
   *   historial_pagos, actividades
   * }
   */
  add(socio: any): Observable<any> {
    return this.http.post<any>(`${BASE}/socio/add`, socio);
  }

  /** PATCH /socio/update?id=… — actualiza un socio existente */
  update(id: string, socio: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.patch<any>(`${BASE}/socio/update`, socio, { params });
  }

  /**
   * DELETE /socio/delete — elimina un socio.
   * Usa `id` como parámetro preferente; si no existe, cae en `nombre`.
   */
  delete(id?: string, nombre?: string): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.set('id', id);
    } else if (nombre) {
      params = params.set('nombre', nombre);
    }
    return this.http.delete<any>(`${BASE}/socio/delete`, { params });
  }
}
