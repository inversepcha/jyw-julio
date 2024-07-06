import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PullOffService {
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
  getNormaPullOff(orden_id: any, informe_id: any) {
    return this._http.get(`${this.url}/api/v1/get-normas-pullOff/${orden_id}/${informe_id}`).map((res) => res)
  }

  postNormaPullOff(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-normas-pullOff`, data).map((res) => res)
  }

  putNormasPullOff(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-normas-pullOff/${id}`, data).map((res) => res)
  }

//Procedimiento
  getProcedimiento(orden_id: any, informe_id: any) {
    return this._http.get(`${this.url}/api/v1/get-procedimiento-pullOff/${orden_id}/${informe_id}`).map((res) => res)
  }

  postProcedimiento(data: any): Observable<any>{
    return this._http.post(`${this.url}/api/v1/post-procedimiento-pullOff`, data).map((res) => res)
  }

  putProcedimiento(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-procedimiento-pullOff/${id}`, data).map((res) => res)

  }


// Sistema de pintura
  getSistemaPintura(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-sistemasPinturas-pullOff/${orden_id}/${informe_id}`).map((res) => res)
  }

  postSistemaPintura(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-sistemaPintura-pullOff`, data).map((res) => res)
  }

  putSistemaPintura(data: any, id: any): Observable<any> {


    return this._http.put(`${this.url}/api/v1/put-sistemaPintura-pullOff/${id}`, data).map((res) => res)

  }


//Método de limpieza
  getMetodoLimpieza(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-metodoLimpieza-pullOff/${orden_id}/${informe_id}`).map((res) => res)
  }

  postMetodoLimpieza(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-metodoLimpieza-pullOff`, data).map((res) => res)
  }

  putMetodoLimpieza(data: any, id: any): Observable<any> {


    return this._http.put(`${this.url}/api/v1/put-metodoLimpieza-pullOff/${id}`, data).map((res) => res)

  }

//Elementos inspeccionados
  getElementosInspeccionados(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-elementoInspeccionado-pullOff/${orden_id}/${informe_id}`).map((res) => res)
  }

  postElementosInspeccionados(data: any): Observable<any> {


    return this._http.post(`${this.url}/api/v1/post-elementoInspeccionado-pullOff`, data).map((res) => res)
  }

  putElementosInspeccionados(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-elementoInspeccionado-pullOff/${id}`, data).map((res) => res)
  }

//Resultados Obtenidos
  getResultadosObtenidos(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-resultadoObtenidos-pullOff/${orden_id}/${informe_id}`).map((res) => res)
  }

  postResultadosObtenidos(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-resultadoObtenidos-pullOff`, data).map((res) => res)
  }

  putResultadosObtenidos(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-resultadoObtenidos-pullOff/${id}`, data).map((res) => res)

  }

//Observaciones
  getObservaciones(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-observaciones-pullOff/${orden_id}/${informe_id}`).map((res) => res)
  }

  postObservaciones(data: any): Observable<any> {


    return this._http.post(`${this.url}/api/v1/post-observaciones-pullOff`, data).map((res) => res)
  }

  putObservaciones(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-observaciones-pullOff/${id}`, data).map((res) => res)
  }


    //REGISTRO FOTOGRAFICO

    postRegistroFotos(data: any, file: File): Observable<any> {

      const dataInfo = new FormData();


      dataInfo.append('orden_id', data.orden_id);
      dataInfo.append('informe_id', data.informe_id);
       dataInfo.append('UploadImage', file, file.name);
      dataInfo.append('title', data.title)

      return this._http.post(`${this.url}/api/v1/post-registrofotografico-pullOff`, dataInfo).map((res) => res)

    }

    getRegistroFotografico(orden_id: any, informe_id: any): Observable<any> {


      return this._http.get(`${this.url}/api/v1/get-registrofotografico-pullOff/${orden_id}/${informe_id}`).map((res) => res)

    }

    deleteRegistroFoto(id: any): Observable<any>{
      return  this._http.delete(`${this.url}/api/v1/delete-registrofotografico-pullOff/${id}`).map((res) => res)
    }

    //FIRMA ELABORO

  postFirmaElaboro(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-firma-elaboro`, data).map((res) => res)

  }

  getFirmaElboro(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-firma-elaboro/${orden_id}/${informe_id}`).map((res) => res)

  }

  //FIRMA REVISO

  postFirmaReviso(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-firma-reviso`, data).map((res) => res)

  }

  getFirmaReviso(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-firma-reviso/${orden_id}/${informe_id}`).map((res) => res)

  }
}
