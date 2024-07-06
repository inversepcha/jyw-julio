import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParticulasMagneticasService {

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
  getNormasParticulas(orden_id: any, informe_id: any) {
    return this._http.get(`${this.url}/api/v1/get-normas-criterio-particulas/${orden_id}/${informe_id}`).map((res) => res)
  }

  postNormasParticulas(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-normas-criterio-particulas`, data).map((res) => res)
  }

  putNormasParticulas(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-normas-criterio-particulas/${id}`, data).map((res) => res)

  }


  // Materiales utilizados
  getMaterialesUtilizados(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-materiales-particulas/${orden_id}/${informe_id}`).map((res) => res)
  }

  postMaterialesUtilizados(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-materiales-particulas`, data).map((res) => res)
  }

  putMaterialesUtilizados(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-materiales-particulas/${id}`, data).map((res) => res)
  }

  //Normas procedimientos
  getNormasProce(orden_id: any, informe_id: any) {
    return this._http.get(`${this.url}/api/v1/get-normasProcess-particulas/${orden_id}/${informe_id}`).map((res) => res)
  }

  postNormasProce(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-normasProcess-particulas`, data).map((res) => res)
  }

  putNormasProces(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-normasProcess-particulas/${id}`, data).map((res) => res)

  }

  getParametros(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-parametros-particulas/${orden_id}/${informe_id}`).map((res) => res)
  }

  postParametros(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-parametros-particulas`, data).map((res) => res)
  }

  putParametros(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-parametros-particulas/${id}`, data).map((res) => res)
  }


  //Elementos inspeccionados
  getElementosInspeccionados(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-elementos-inspeccionados-particulas/${orden_id}/${informe_id}`).map((res) => res)
  }

  postElementosInspeccionados(data: any): Observable<any> {


    return this._http.post(`${this.url}/api/v1/post-elementos-inspeccionados-particulas`, data).map((res) => res)
  }

  putElementosInspeccionados(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-elementos-inspeccionados-particulas/${id}`, data).map((res) => res)
  }

  //Elementos inspeccionados
  getProcedimiento(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-proceso-particulas/${orden_id}/${informe_id}`).map((res) => res)
  }

  postProcedimiento(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-proceso-particulas`, data).map((res) => res)
  }

  putProcedimiento(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-proceso-particulas/${id}`, data).map((res) => res)
  }


  // Resultados
  getResultados(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-resultado-particulas/${orden_id}/${informe_id}`).map((res) => res)
  }

  postResultados(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-resultado-particulas`, data).map((res) => res)
  }

  putResultados(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-resultado-particulas/${id}`, data).map((res) => res)
  }


  //Observaciones
  getObservaciones(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-observaciones-particulas/${orden_id}/${informe_id}`).map((res) => res)
  }

  postObservaciones(data: any): Observable<any> {
    return this._http.post(`${this.url}/api/v1/post-observaciones-particulas`, data).map((res) => res)
  }

  putObservaciones(data: any, id: any): Observable<any> {
    return this._http.put(`${this.url}/api/v1/put-observaciones-particulas/${id}`, data).map((res) => res)
  }

  //REGISTRO FOTOGRAFICO

  postRegistroFotos(data: any, file: File): Observable<any> {
    const dataInfo = new FormData();


    dataInfo.append('orden_id', data.orden_id);
    dataInfo.append('informe_id', data.informe_id);
    dataInfo.append('UploadImage', file, file.name);
    dataInfo.append('title', data.title)

    return this._http.post(`${this.url}/api/v1/post-registrofoto-particulas`, dataInfo).map((res) => res)

  }

  getRegistroFotografico(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-registrofoto-particulas/${orden_id}/${informe_id}`).map((res) => res)
  }

  deleteRegistroFoto(id: any): Observable<any>{
    return  this._http.delete(`${this.url}/api/v1/delete-registrofoto-particulas/${id}`).map((res) => res)
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
