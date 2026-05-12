import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {


  set(key:string,value:string){
    sessionStorage.setItem(key,JSON.stringify(value));
  }

  get(key:string){
    const value = sessionStorage.getItem(key);
    if(value){
      return JSON.parse(value);
    }
    return undefined;
  }

  check(key:string){
    return !!sessionStorage.getItem(key);
  }
  remove(key: string) {
    if (this.check(key)) {
      sessionStorage.removeItem(key);
    }
  }

  removeAll() {
    sessionStorage.clear();
  }
}
