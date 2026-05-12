import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root',
})
export class AuthCookieService {
  constructor(
    private cookieService: CookieService
  ) {
  }

  // crear/modificar la cookie, definimos entre otras cosass el tiempo de vida
  set(key: string, value: string, days: number = 5) {
    this.cookieService.set(
      key,
      value,
      days,
      "/", // Todas las páginas de mi web pueden acceder a esta cookie
      undefined,
      false, // ¿Solo permitimos HTTPS?
      "Strict"
    );
  }

  get(key: string) {
    return this.cookieService.get(key) // Solo retorna el VALUE
  }

  remove(key: string) {
    this.cookieService.delete(key)
  }

  exists(key: string): boolean {
    return this.cookieService.check(key)
  }

  removeAll(): void {
    this.cookieService.deleteAll();
  }
}
