import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImplementosService {
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.url;
  }

  getImplementos(): Observable<any> {
    return this._http
      .get(this.url + '/api/v1/getImplementos')
      .map((res) => res);
  }

  addImplementos(data: any): Observable<any> {

    return this._http
      .post(this.url + '/api/v1/SaveImplementos', data)
      .map((res) => res);
  }


  getSeriales(id: any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getSeriales/${id}`)
      .map((res) => res);
  }


  deleteImplemento(id: any): Observable<any> {
    return this._http
      .delete(this.url + `/api/v1/deleteImplemento/${id}`)
      .map((res) => res);
  }

  deleteSerial(id: any): Observable<any> {
    return this._http
      .delete(this.url + `/api/v1/deleteSerial/${id}`)
      .map((res) => res);
  }

  addSerial(data: any): Observable<any> {

    return this._http
      .post(this.url + '/api/v1/addSerial', data)
      .map((res) => res);
  }


  getImplemento(id: any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getImplemento/${id}`)
      .map((res) => res);
  }

  updateImplemento(data: any): Observable<any> {

    return this._http
      .put(this.url + `/api/v1/updateImplemento`, data)
      .map((res) => res);
  }

  getImplementoSelect(): Observable<any> {

    return this._http
    .get(this.url + `/api/v1/getImplementosSelect`)
    .map((res) => res)

  }

}
