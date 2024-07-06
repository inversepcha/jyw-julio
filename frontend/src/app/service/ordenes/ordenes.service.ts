import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  public url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.url;
  }

  getOrdenes(id: any): Observable<any> {

    if (id == null) {
      return this._http
        .get(this.url + '/api/v1/getOrdenesTrabajo')
        .map((res) => res);
    }
    else {
      return this._http
        .get(this.url + `/api/v1/getOrdenesTrabajo/${id}`)
        .map((res) => res);
    }
  }

  getUsuariosOrdenes(id_orden: any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getUsuariosOrdenes/${id_orden}`)
      .map((res) => res);
  }

  getImplementosOrdenes(id_orden: any): Observable<any> {

    return this._http
      .get(this.url + `/api/v1/getImplementosOrdenes/${id_orden}`)

  }

  getOrden(id: any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getOrden/${id}`)
      .map((res) => res);
  }

  deleteOrden(id: any): Observable<any> {
    return this._http
      .delete(this.url + `/api/v1/deleteOrden/${id}`)
      .map((res) => res);
  }

  addOrdenes(data: any): Observable<any> {

    return this._http
      .post(this.url + '/api/v1/addOrdenes', data)
      .map((res) => res);
  }

  addUsuarioOrdenes(data: any): Observable<any> {

    return this._http
      .post(this.url + '/api/v1/addUsuarioOrden', data)
      .map((res) => res)

  }


  updateUsuarioOrdenes(data: any): Observable<any> {

    return this._http
      .put(this.url + `/api/v1/edit-usuario-orden`, data)
      .map((res) => res);
  }
  deleteUsuarioOrden(id: any): Observable<any> {
    return this._http
      .delete(this.url + `/api/v1/deleteUsuarioOrden/${id}`)
      .map((res) => res)
  }

  getUsuariosOrdenesHistorial(id_orden: any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getUsuariosOrdenesHistorial/${id_orden}`)
      .map((res) => res);
  }

  getImplemntosOrdenesHistorial(id_orden: any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getImplemntosOrdenesHistorial/${id_orden}`)
      .map((res) => res);
  }

  addImplementoOrdenes(data: any): Observable<any> {

    return this._http
      .post(this.url + '/api/v1/addImplemento', data)
      .map((res) => res)

  }

  deleteImplemento(id: any): Observable<any> {
    return this._http
      .delete(this.url + `/api/v1/deleteImplementoOrden/${id}`)
      .map((res) => res)
  }

  getContadorOrdenes(): Observable<any> {

    return this._http
      .get(this.url + '/api/v1/getContadorOrdenes')
      .map((res) => res)

  }

  updateOrden(data: any): Observable<any> {

    return this._http
      .put(this.url + `/api/v1/updateOrden`, data)
      .map((res) => res);
  }

  getDetallesOrdenes(id: any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getDetallesOrden/${id}`)
  }

}
