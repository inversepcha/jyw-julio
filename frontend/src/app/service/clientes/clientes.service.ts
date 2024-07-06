import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',

})
export class ClientesService {
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.url;
  }

  getClientes(): Observable<any> {
    return this._http
      .get(this.url + '/api/v1/getClientes')
      .map((res) => res);
  }

  getClientesPaginacion(pagina: any, cantidad: any): Observable<any> {


    return this._http
      .get(this.url + `/api/v1/getClientes?pagina=${pagina}&cantidadDatos=${cantidad}`)
      .map((res) => res);
  }

  getClientesSelect(cliente: any): Observable<any> {
    return this._http
      .get(this.url + `/api/v1/getSearchCliente?cliente=${cliente}`)
      .map((res) => res);
  }

  addCliente(params: any): Observable<any> {

    return this._http
      .post(this.url + '/api/v1/addCliente', params)
      .map((res) => res);
  }

  getCliente(Id_Cliente: any): Observable<any> {

    return this._http
      .get(this.url + `/api/v1/getCliente/${Id_Cliente}`)
      .map((res) => res);
  }

  editCliente(params: any): Observable<any> {
    return this._http
      .put(this.url + '/api/v1/editCliente', params)
      .map((res) => res);
  }

  deleteCliente(Id_Cliente: any): Observable<any> {

    return this._http
      .delete(this.url + `/api/v1/deleteCliente/${Id_Cliente}`)
      .map((res) => res);
  }
}
