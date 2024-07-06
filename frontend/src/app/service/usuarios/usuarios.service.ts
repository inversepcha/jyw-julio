import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class UsuariosService {
  public url: string;
  public identity: any;
  public token: any;

  constructor(private _http: HttpClient) {
    this.url = environment.url;
  }

  login(user: any): Observable<any> {

    return this._http
      .post(this.url + '/api/v1/login', user)
      .map((res) => res);
  }

  getIdentity() {
    let identity = JSON.parse(localStorage.getItem('identity')as string);

    if (identity != "undefined") {
        this.identity = identity;
    } else {
        this.identity = null;
    }
    return this.identity;

}

  getUsuarios(): Observable<any> {
    return this._http
      .get(this.url + '/api/v1/getUsuarios')
      .map((res) => res);
  }

  addUsuario(user: any): Observable<any> {

    return this._http
      .post(this.url + '/api/v1/addUsuario', user)
      .map((res) => res);
  }

  editUsuario(user: any): Observable<any> {

    return this._http
      .put(this.url + '/api/v1/editUsuario', user)
      .map((res) => res);
  }

  getUsuario(Id_User: any): Observable<any> {

    return this._http
      .get(this.url + `/api/v1/getUsuario/${Id_User}`)
      .map((res) => res);
  }

  deleteUsuario(Id_User: any): Observable<any> {

    return this._http
      .delete(this.url + `/api/v1/deleteUsuario/${Id_User}`)
      .map((res) => res);
  }

  updateStatus(User_status: any): Observable<any> {

    return this._http
      .put(this.url + `/api/v1/updateStatus/`, User_status)
      .map((res) => res);
  }

  getUsuariosSelect(): Observable<any> {

    return this._http
      .get(this.url + `/api/v1/getUsuariosOrdenesSelect`)
      .map((res) => res);
  }

}
