import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SociosService {

  private URL = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  /** GET /socio/all — devuelve la lista completa de socios */
  getSocios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/socio/all`);
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
  guardar(payload: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/socio/add`, payload);
  }

  /**
   * DELETE /socio/delete — elimina un socio.
   * Acepta id, identificacion o nombre como query param.
   * Aquí usamos `id` como preferente; si no existe usamos `nombre`.
   */
  deleteSocio(id?: string, nombre?: string): Observable<any> {
    let params: Record<string, string> = {};
    if (id) {
      params['id'] = id;
    } else if (nombre) {
      params['nombre'] = nombre;
    }
    return this.http.delete<any>(`${this.URL}/socio/delete`, { params });
  }

  update(id: string, actividad: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.patch<any>(`${this.URL}/actividad/update`, actividad, { params });
  }

}
