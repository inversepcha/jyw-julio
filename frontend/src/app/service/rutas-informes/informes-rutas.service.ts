import { Injectable, Inject } from '@angular/core';

import { HttpClient, HttpEvent } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

import { download, Download } from "../dowload.service";
import { SAVER, Saver } from '../saver.provider'
@Injectable({
  providedIn: 'root'
})
export class InformesRutasService {
  public url: string;

  constructor(private _http: HttpClient, @Inject(SAVER) private save: Saver) {
    this.url = environment.url;

  }

  getConsecutivo(data: any): Observable<any> {


    return this._http.post(`${this.url}/api/v1/get-consecutivo-informe`, data).map((res) => res)

  }

  getRutasInformes(): Observable<any> {

    return this._http.get(`${this.url}/api/v1/get-informes-router`).map((res) => res)

  }

  postInformeOrden(data: any): Observable<any> {

    return this._http.post(`${this.url}/api/v1/post-informes-orden`, data).map((res) => res)
  }

  getInformesOrden(orden_id: any): Observable<any> {

    return this._http.get(`${this.url}/api/v1/get-informes-ordenes/${orden_id}`)

  }

  postAutoSaveStepper(data: any): Observable<any> {


    return this._http.post(`${this.url}/api/v1/post-auto-save-stepper/`, data).map((res) => res)

  }

  getAutoSaveStepper(orden_id: any, informe_id: any): Observable<any> {
    return this._http.get(`${this.url}/api/v1/get-auto-save-stepper/${orden_id}/${informe_id}`)
  }

  putAutoSaveStepper(data: any, id: any): Observable<any> {

    return this._http.put(`${this.url}/api/v1/put-auto-save-stepper/${id}`, data).map((res) => res)

  }

  GETdocumentExportPdf(id_orden: any, informe_id: any, filename: any): Observable<Download> {

    return this._http.get(`${this.url}/api/v1/get-pdf-vt-pintura/${id_orden}/${informe_id}`, { reportProgress: true, observe: 'events', responseType: 'blob' }).pipe(download(blob => this.save(blob, filename)))

  }

}
