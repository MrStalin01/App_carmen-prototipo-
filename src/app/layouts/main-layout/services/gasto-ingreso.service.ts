import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Gasto {
  id?:          string;
  monto:        number;
  descripcion:  string;
  fecha_gasto:  string;
}

export interface Ingreso {
  id?:          string;
  monto:        number;
  descripcion:  string;
  fechaIngreso: string;
}

@Injectable({ providedIn: 'root' })
export class GastoIngresoService {

  private URL = environment.apiURL;

  constructor(private http: HttpClient) {}



  getGastos(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.URL}/gastos/all`);
  }

  addGasto(gasto: Omit<Gasto, 'id'>): Observable<Gasto> {
    return this.http.post<Gasto>(`${this.URL}/gastos/add`, gasto);
  }

  deleteGasto(id: string): Observable<void> {
    const params = new HttpParams().set('id', id);
    return this.http.delete<void>(`${this.URL}/gastos/delete`, { params });
  }

  getTotalGastos(): Observable<number> {
    return this.http.get<number>(`${this.URL}/gastos/total`);
  }



  getIngresos(): Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(`${this.URL}/ingresos/all`);
  }

  addIngreso(ingreso: Omit<Ingreso, 'id'>): Observable<Ingreso> {
    return this.http.post<Ingreso>(`${this.URL}/ingresos/add`, ingreso);
  }

  deleteIngreso(id: string): Observable<void> {
    const params = new HttpParams().set('id', id);
    return this.http.delete<void>(`${this.URL}/ingresos/delete`, { params });
  }

  getTotalIngresos(): Observable<number> {
    return this.http.get<number>(`${this.URL}/ingresos/total`);
  }
}
