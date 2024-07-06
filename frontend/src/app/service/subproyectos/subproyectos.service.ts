import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubproyectosService {

  public url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.url;
  }

  addSubProyecto(data: any): Observable<any> {

    return this._http
      .post(this.url + '/api/v1/addSubProyecto', data)
      .map((res) => res);
  }

  getSubproyectos(idProyecto :any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getSubProyectos/${idProyecto}`)
      .map((res) => res);
  }

  getSubProyecto(id :any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getSubProyecto/${id}`)
      .map((res) => res);
  }

  updateSubProyecto(data: any): Observable<any> {

    return this._http
      .put(this.url + `/api/v1/updateSubProyecto`, data)
      .map((res) => res);
  }

  updateEstadoSubProyecto(Sub_status: any): Observable<any> {

    return this._http
      .put(this.url + `/api/v1/updateEstadoSubProyecto/`, Sub_status)
      .map((res) => res);
  }

  deleteSubProyecto( id : any): Observable<any> {

    return this._http
      .delete(this.url + `/api/v1/deleteSubProyecto/${id}`)
      .map((res) => res);
  }

}
