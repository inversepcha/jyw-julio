import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpcionesInformesService {

  public url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.url;
  }

  addOpciones(data: any): Observable<any> {

    return this._http.post(this.url + '/api/v1/post-opciones-informes', data).map((res) => res);
  }

  getOpciones(informe_id: any): Observable<any> {

    return this._http.get(this.url + `/api/v1/get-opciones-informes/${informe_id}`).map((res) => res);
  }



  putOpciones(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-o-pullOff/${id}`, data).map((res) => res)

  }
}
