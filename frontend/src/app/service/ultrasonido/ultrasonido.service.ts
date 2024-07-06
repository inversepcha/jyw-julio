import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UltrasonidoService {

  public url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.url;
  }

  getDetallesInforme(id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-informe-orden/${id}`).map((res) => res)
  }



  getUltrasonido(orden_id: any, informe_id: any) {
    return this._http.get(`${this.url}/api/v1/get-ultrasonica/${orden_id}/${informe_id}`).map((res) => res)
  }

  postUltrasonidoInit(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-ultrasonica`, data).map((res) => res)
  }

  postNormaUltrasonido(data: any, _id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/post-norma-ultrasonica/${_id}`, data).map((res) => res)
  }

  putNormasUltrasonido(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-norma-ultrasonica/${id}`, data).map((res) => res)
  }

  postJunta(data: any, _id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/post-juntas-ultrasonica/${_id}`, data).map((res) => res)
  }

  postElementosInspeccionados(data: any, _id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/post-elementosInsp-ultrasonica/${_id}`, data).map((res) => res)
  }


  // Equipo utilizado


  postEquipoUtilizado(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/post-equiposUtilizados-ultrasonica/${id}`, data).map((res) => res)
  }


  // Palpador

  postPalpador(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/post-palpador-ultrasonica/${id}`, data).map((res) => res)
  }

  // Soldadura


  postSoldadura(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/post-soldadura-ultrasonica/${id}`, data).map((res) => res)
  }


  // Materiales


  postMateriales(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/post-materiales-ultrasonica/${id}`, data).map((res) => res)
  }


  postDescripcion(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/post-descripcion-ultrasonica/${id}`, data).map((res) => res)
  }


  postObservaciones(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/post-observaciones-ultrasonica/${id}`, data).map((res) => res)
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

  //REGISTRO FOTOGRAFICO

  postRegistroFotos(data: any, file: File, id: any): Observable<any> {

    const dataInfo = new FormData();

    dataInfo.append('UploadImage', file, file.name);
    dataInfo.append('title', data.title)



    return this._http.put(`${this.url}/api/v1/post-Registro_foto-ultrasonica/${id}`, dataInfo).map((res) => res)

  }


  deleteRegistroFoto(id: any): Observable<any> {
    return this._http.delete(`${this.url}/api/v1/delete-registrofoto-ultrasonica/${id}`).map((res) => res)
  }



}
