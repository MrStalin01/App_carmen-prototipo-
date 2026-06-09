import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class CursoService {
  private URL = environment.apiURL;

  constructor(private http: HttpClient) {
  }
  getActividades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/actividad/all`);
  }
  addActividad(datos: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/actividad/add`, datos);
  }
  deleteActividad(id:string):Observable<any>{
    return this.http.delete<any>(`${this.URL}/actividad/delete/${id}`)
  }
}
