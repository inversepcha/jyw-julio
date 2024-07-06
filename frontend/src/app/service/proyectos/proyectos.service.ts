import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.url;
  }

  getProyectos(): Observable<any> {
    return this._http
      .get(this.url + '/api/v1/getProyectos')
      .map((res) => res);
  }


  addProyecto(data: any): Observable<any> {

    return this._http
      .post(this.url + '/api/v1/saveProyectos', data)
      .map((res) => res);
  }


  getProyecto(id : any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getProyecto/${id}`)
      .map((res) => res);
  }


  updateProyecto(data: any): Observable<any> {

    return this._http
      .put(this.url + '/api/v1/updateProyecto', data)
      .map((res) => res);
  }

  deleteProyecto(id : any): Observable<any> {
    return this._http
      .delete(this.url + `/api/v1/deleteProyecto/${id}`)
      .map((res) => res);
  }


}
