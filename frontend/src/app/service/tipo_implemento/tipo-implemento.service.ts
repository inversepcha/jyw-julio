import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoImplementoService {

  public url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.url;
  }

  addTipoImplemento(data: any): Observable<any> {

    return this._http
      .post(this.url + '/api/v1/saveTipoImplemento', data)
      .map((res) => res);
  }

  getTiposImplementos(): Observable<any> {

    return this._http
      .get(this.url + '/api/v1/getTiposImplementos')
      .map((res) => res);
  }


  getTipoImplemento(id :any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getTipoImplemento/${id}`)
      .map((res) => res);
  }

  updateTipoImplemento(data: any): Observable<any> {

    return this._http
      .put(this.url + `/api/v1/updateTipoImplemento`, data)
      .map((res) => res);
  }


  deleteTipoImplemento( id : any): Observable<any> {

    return this._http
      .delete(this.url + `/api/v1/deleteTipoImplemento/${id}`)
      .map((res) => res);
  }

}
