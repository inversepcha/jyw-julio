import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  public url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.url;
  }


  getDepartamentos(): Observable<any> {
    return this._http
      .get(this.url + '/api/v1/getDepartamentos')
      .map((res) => res);
  }
}
