import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VtPinturaService {
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

  postNormasCriterioVtPintura(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/normas-criterio`, data).map((res) => res)

  }

  getNormasCriterioVtPintura(orden_id: any, informe_id: any): Observable<any> {


    return this._http.get(`${this.url}/api/v1/get-normas-criterio/${orden_id}/${informe_id}`).map((res) => res)

  }

  putNormasCriterioVtPintura(data: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-normas-criterio`, data).map((res) => res)

  }

  //PREVIO PINTURA

  postPrevioPintura(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-previo-pintura`, data).map((res) => res)
  }

  getPrevioPintura(orden_id: any, informe_id: any): Observable<any> {


    return this._http.get(`${this.url}/api/v1/get-previo-pintura/${orden_id}/${informe_id}`).map((res) => res)

  }

  putPrevioPintura(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-previo-pintura/${id}`, data).map((res) => res)

  }

  //DURANTE PINTURA

  postdurantePintura(data: any): Observable<any> {


    return this._http.post(`${this.url}/api/v1/post-durante-pintura`, data).map((res) => res)
  }

  getdurantePintura(orden_id: any, informe_id: any): Observable<any> {


    return this._http.get(`${this.url}/api/v1/get-durante-pintura/${orden_id}/${informe_id}`).map((res) => res)

  }

  putdurantePintura(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-durante-pintura/${id}`, data).map((res) => res)

  }


  //DESPUES PINTURA

  postDespuesPintura(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-despues-pintura`, data).map((res) => res)
  }

  getDespuesPintura(orden_id: any, informe_id: any): Observable<any> {


    return this._http.get(`${this.url}/api/v1/get-despues-pintura/${orden_id}/${informe_id}`).map((res) => res)

  }

  putDespuesPintura(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-despues-pintura/${id}`, data).map((res) => res)

  }

  //ESQUEMA INSPECCION

  postEsquemaElementos(data: any, file: File): Observable<any> {

    const dataInfo = new FormData();


    dataInfo.append('orden_id', data.orden_id);
    dataInfo.append('informe_id', data.informe_id);
    dataInfo.append('UploadImage', file, file.name);
    dataInfo.append('title', data.title)



    return this._http.post(`${this.url}/api/v1/post-esquema-elementos`, dataInfo).map((res) => res)

  }

  getEsquemaElementos(orden_id: any, informe_id: any): Observable<any> {


    return this._http.get(`${this.url}/api/v1/get-esquema-elementos/${orden_id}/${informe_id}`).map((res) => res)

  }

  deleteEsquemaElementos(id: any): Observable<any> {

    return this._http.delete(`${this.url}/api/v1/delete-esquema-elementos/${id}`).map((res) => res)

  }

  //ELEMENTOS INSPECCIONADOS

  postElementosInspeccionados(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-elementos-inspeccionados`, data).map((res) => res)
  }

  getElementosInspeccionados(orden_id: any, informe_id: any): Observable<any> {

    return this._http.get(`${this.url}/api/v1/get-elementos-inspeccionados/${orden_id}/${informe_id}`).map((res) => res)

  }

  putElementosInspeccionados(id: any, data: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-elementos-inspeccionados/${id}`, data).map(res => res)


  }

  //DETALLES ELEMENTOS INSPECCIONADOS

  postDetallesElementosInspeccionados(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-detalles-elementos-inspeccionados`, data).map((res) => res)
  }

  getDetallesElementosInspeccionados(orden_id: any, informe_id: any): Observable<any> {

    return this._http.get(`${this.url}/api/v1/get-detalles-elementos-inspeccionados/${orden_id}/${informe_id}`).map((res) => res)

  }


  putDetallesElementosInspeccionados(id: any, data: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-detalles-elementos-inspeccionados/${id}`, data).map(res => res)


  }


  //ELEMENTOS INSPECCIONADOS

  postObservaciones(body: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-observaciones-generales`, body).map((res) => res)
  }

  getObservaciones(orden_id: any, informe_id: any): Observable<any> {

    return this._http.get(`${this.url}/api/v1/get-observaciones-generales/${orden_id}/${informe_id}`).map((res) => res)

  }

  putObservaciones(id: any, data: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-observaciones-generales/${id}`, data).map(res => res)


  }

  //REGISTRO FOTOGRAFICO

  postRegistroFotos(data: any, file: File): Observable<any> {

    const dataInfo = new FormData();


    dataInfo.append('orden_id', data.orden_id);
    dataInfo.append('informe_id', data.informe_id);
    dataInfo.append('UploadImage', file, file.name);
    dataInfo.append('title', data.title)



    return this._http.post(`${this.url}/api/v1/post-registro-fotografico`, dataInfo).map((res) => res)

  }

  getRegistroFotografico(orden_id: any, informe_id: any): Observable<any> {


    return this._http.get(`${this.url}/api/v1/get-registro-fotografico/${orden_id}/${informe_id}`).map((res) => res)

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
