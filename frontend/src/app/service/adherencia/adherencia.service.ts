import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdherenciaService {
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
  getNormaAdherencia(orden_id: any, informe_id: any) {
    return this._http.get(`${this.url}/api/v1/get-normas-adherencia/${orden_id}/${informe_id}`).map((res) => res)
  }

  postNormaAdherencia(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-normas-adherencia`, data).map((res) => res)
  }

  putNormaAdherencia(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-normas-adherencia/${id}`, data).map((res) => res)

  }

  //Procedimiento
  getProcedimiento(orden_id: any, informe_id: any) {
    return this._http.get(`${this.url}/api/v1/get-procedimiento-adherencia/${orden_id}/${informe_id}`).map((res) => res)
  }

  postProcedimiento(data: any): Observable<any>{
    return this._http.post(`${this.url}/api/v1/post-procedimiento-adherencia`, data).map((res) => res)
  }

  putProcedimiento(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-procedimiento-adherencia/${id}`, data).map((res) => res)

  }

  // Sistema de pintura
  getSistemaPintura(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-sistemasPinturas-adherencia/${orden_id}/${informe_id}`).map((res) => res)
  }

  postSistemaPintura(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-sistemaPintura-adherencia`, data).map((res) => res)
  }

  putSistemaPintura(data: any, id: any): Observable<any> {


    return this._http.put(`${this.url}/api/v1/put-sistemaPintura-adherencia/${id}`, data).map((res) => res)

  }

  //Método de limpieza
  getCondiciones(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-condicionesClima-adherencia/${orden_id}/${informe_id}`).map((res) => res)
  }

  postCondiciones(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-condicionesClima-adherencia`, data).map((res) => res)
  }

  putCondiciones(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-condicionesClima-adherencia/${id}`, data).map((res) => res)

  }

  //Elementos inspeccionados
  getElementosInspeccionados(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-elementoInspeccionado-adherencia/${orden_id}/${informe_id}`).map((res) => res)
  }

  postElementosInspeccionados(data: any): Observable<any> {


    return this._http.post(`${this.url}/api/v1/post-elementoInspeccionado-adherencia`, data).map((res) => res)
  }

  putElementosInspeccionados(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-elementoInspeccionado-adherencia/${id}`, data).map((res) => res)
  }


  //REGISTRO FOTOGRAFICO

  postCintas(data: any, file: File): Observable<any> {

    const dataInfo = new FormData();


    dataInfo.append('orden_id', data.orden_id);
    dataInfo.append('informe_id', data.informe_id);
    dataInfo.append('UploadImage', file, file.name);
    dataInfo.append('n_cinta', data.n_cinta);
    dataInfo.append('elemento', data.elemento);
    dataInfo.append('ubicacion', data.ubicacion);
    dataInfo.append('recubrimiento', data.recubrimiento);
    dataInfo.append('espesor', data.espesor);
    dataInfo.append('resultado', data.resultado);
    dataInfo.append('tipo_falla', data.tipo_falla);

    console.log(dataInfo)

    return this._http.post(`${this.url}/api/v1/post-registrofoto-adherencia`, dataInfo).map((res) => res)

  }

  getCintas(orden_id: any, informe_id: any): Observable<any> {


    return this._http.get(`${this.url}/api/v1/get-registrofoto-adherencia/${orden_id}/${informe_id}`).map((res) => res)

  }

  deleteCintas(id: any): Observable<any>{
    return  this._http.delete(`${this.url}/api/v1/delete-cintas-adherencia/${id}`).map((res) => res)
  }

}
