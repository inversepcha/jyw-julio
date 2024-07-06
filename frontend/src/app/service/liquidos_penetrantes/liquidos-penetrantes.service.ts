import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiquidosPenetrantesService {
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.url;
  }

  getDetallesInforme(id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-informe-orden/${id}`).map((res) => res)
  }

  getActividades(idTipoInforme: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-actividades/${idTipoInforme}`).map((res) => res)
  }

  //Norma
  getNormasLiquidos(orden_id: any, informe_id: any) {
    return this._http.get(`${this.url}/api/v1/get-normas-criterio-liquidos/${orden_id}/${informe_id}`).map((res) => res)
  }

  postNormasLiquidos(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-normas-criterio-liquidos`, data).map((res) => res)
  }

  putNormasLiquidos(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-normas-criterio-liquidos/${id}`, data).map((res) => res)

  }


  // Materiales utilizados
  getMaterialesUtilizados(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-materiales-liquidos/${orden_id}/${informe_id}`).map((res) => res)
  }

  postMaterialesUtilizados(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-materiales-liquidos`, data).map((res) => res)
  }

  putMaterialesUtilizados(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-materiales-liquidos/${id}`, data).map((res) => res)
  }

  //Normas procedimientos
  getNormasProce(orden_id: any, informe_id: any) {
    return this._http.get(`${this.url}/api/v1/get-normasProcess-liquidos/${orden_id}/${informe_id}`).map((res) => res)
  }

  postNormasProce(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-normasProcess-liquidos`, data).map((res) => res)
  }

  putNormasProces(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-normasProcess-liquidos/${id}`, data).map((res) => res)

  }

  getParametros(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-parametros-liquidos/${orden_id}/${informe_id}`).map((res) => res)
  }

  postParametros(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-parametros-liquidos`, data).map((res) => res)
  }

  putParametros(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-parametros-liquidos/${id}`, data).map((res) => res)
  }

  //Elementos inspeccionados
  getElementosInspeccionados(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-elementos-inspeccionados-liquidos/${orden_id}/${informe_id}`).map((res) => res)
  }

  postElementosInspeccionados(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-elementos-inspeccionados-liquidos`, data).map((res) => res)
  }

  putElementosInspeccionados(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-elementos-inspeccionados-liquidos/${id}`, data).map((res) => res)
  }


  // Materiales utilizados
  getInterpretacion(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-interEvaluacion-liquidos/${orden_id}/${informe_id}`).map((res) => res)
  }

  postInterpretacion(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-interEvaluacion-liquidos`, data).map((res) => res)
  }

  putInterpretacion(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-interEvaluacion-liquidos/${id}`, data).map((res) => res)
  }


  //Elementos inspeccionados
  getObservaciones(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-observaciones-liquidos/${orden_id}/${informe_id}`).map((res) => res)
  }

  postObservaciones(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-observaciones-liquidos`, data).map((res) => res)
  }

  putObservaciones(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-observaciones-liquidos/${id}`, data).map((res) => res)
  }



  //REGISTRO FOTOGRAFICO

  postRegistroFotos(data: any, file: File): Observable<any> {
    const dataInfo = new FormData();


    dataInfo.append('orden_id', data.orden_id);
    dataInfo.append('informe_id', data.informe_id);
    dataInfo.append('UploadImage', file, file.name);
    dataInfo.append('title', data.title)

    return this._http.post(`${this.url}/api/v1/post-registrofoto-liquidos`, dataInfo).map((res) => res)

  }

  getRegistroFotografico(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-registrofoto-liquidos/${orden_id}/${informe_id}`).map((res) => res)
  }

  deleteRegistroFoto(id: any): Observable<any> {
    return this._http.delete(`${this.url}/api/v1/delete-registrofoto-liquidos/${id}`).map((res) => res)
  }

}
