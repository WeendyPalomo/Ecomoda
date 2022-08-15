import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetApiService {

  constructor(public _http: HttpClient) { 

  }

  obtenerDatos<T>(url: string){
    return this._http.get<T[]>('http://ecoshopepn.herokuapp.com/api/products');
  }
}
