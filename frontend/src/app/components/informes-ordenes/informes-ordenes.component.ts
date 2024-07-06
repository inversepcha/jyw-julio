import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
/* import { saveAs } from 'file-saver'; */
import { Subject } from 'rxjs';
import { Observable } from 'rxjs'
import { Download } from "../../service/dowload.service";

import { OrdenesService } from "../../service/ordenes/ordenes.service";
import { InformesRutasService } from "../../service/rutas-informes/informes-rutas.service";
import { SocketService } from '../../service/sockets/socket.service';

import Swal from 'sweetalert2';

declare var $: any;
declare var bootstrap: any;
@Component({
  selector: 'app-informes-ordenes',
  templateUrl: './informes-ordenes.component.html',
  styleUrls: ['./informes-ordenes.component.css'],
  providers: [InformesRutasService, OrdenesService]
})

export class InformesOrdenesComponent implements OnInit {

  public informesSelect: any = [];
  public messageError: any
  public informesOrden: any = []
  consecutivo: any
  year: any
  tipo_documento: any
  consecutivo_modific: any
  statusConsecutivo: boolean = false
  public informe = {
    informe: '',
    orden_id: '',
    informe_ruta: '',
    rep_numero: '',
    consecutivo: 0
  }

  public detallesOrden: any

  download: any
  filename: any;

  constructor(
    private _informesRutasService: InformesRutasService,
    private _ordenesService: OrdenesService,
    private _socketService: SocketService,
    private _route: Router,
    private _activatedRoute: ActivatedRoute,

  ) {
  }

  ngOnInit(): void {
    this.onGetDetallesOrden()
    this.onGetInformesOrdenes()

  }

  onGetDocument() {
    this.year = new Date().getFullYear().toString().substr(-1)
    this.tipo_documento = `T${this.detallesOrden.orden_consecutivo}I`
  }

  onGetInformes() {

    this._informesRutasService.getRutasInformes().subscribe((res) => {

      this.informesSelect = res.body
    },
      (error) => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error;

          if (error.status === 404) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'center',
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
              width: '300px',
            });

            Toast.fire({
              icon: 'info',
              title: body.body.message,
            });
          } else if (error.status === 500) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'center',
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
              width: '300px',
            });

            Toast.fire({
              icon: 'error',
              title: body.body.message,
            });
          } else if (error.status === 0) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'center',
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
              width: '300px',
            });

            Toast.fire({
              icon: 'error',
              title: 'Por favor compruebe su conexión de internet',
            });
          }
        }
      })
  }

  onGetDetallesOrden() {
    this._activatedRoute.params.subscribe(params => {
      const orden_id = params['orden_id'];

      this._ordenesService.getDetallesOrdenes(orden_id).subscribe((res) => {

        this.detallesOrden = res.body[0]
      })
    })
  }

  onSubmit() {
    this._activatedRoute.params.subscribe(params => {
      this.informe.orden_id = params['orden_id'];

      const nameInforme = $('#Informe :selected').text()

      const findArray = this.informesSelect.find((item: any) => item.router == this.informe.informe_ruta)

      console.log(findArray)

      const data = {
        ...this.informe,
        informe: nameInforme,
        informe_id: findArray._id
      }

      this._informesRutasService.postInformeOrden(data).subscribe((res) => {

        if (res.status === 200) {

          Swal.fire({
            title: '¡El Informe se ha agregado correctamente!',
            icon: 'success',
            confirmButtonText: 'Cerrar',
          });

          this.onGetInformesOrdenes()

          this.informe.informe = ''
          this.informe.orden_id = ''
          this.informe.consecutivo = 0
          this.informe.rep_numero = ''
          this.informe.informe_ruta = ''

          $('#offcanvasWithBackdrop .btn-close').click()
        }
      }, error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.messageError = body.body.message;
          }

          if (error.status === 404) {
            Swal.fire({
              title: body.body.message,
              icon: 'warning',
              confirmButtonText: 'Cerrar',
            });
          }

          if (error.status == 500) {

            const Toast = Swal.mixin({
              toast: true,
              position: 'center',
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
              width: '300px'
            })

            Toast.fire({
              icon: 'error',
              title: body.body.message

            })

          } else if (error.status == 0) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'center',
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
              width: '300px'
            })

            Toast.fire({
              icon: 'error',
              title: 'Por favor compruebe su conexión de internet'

            })
          }
        }
      })
    })
  }

  onGetInformesOrdenes() {
    this._activatedRoute.params.subscribe(params => {
      const orden_id = params['orden_id'];

      this._informesRutasService.getInformesOrden(orden_id).subscribe((res) => {

        this.informesOrden = res.body



      },
        (error) => {
          var errorMessage = <any>error;

          if (errorMessage != null) {
            var body = error.error;

            if (error.status === 404) {
              const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                width: '300px',
              });

              Toast.fire({
                icon: 'info',
                title: body.body.message,
              });
            } else if (error.status === 500) {
              const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                width: '300px',
              });

              Toast.fire({
                icon: 'error',
                title: body.body.message,
              });
            } else if (error.status === 0) {
              const Toast = Swal.mixin({
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                width: '300px',
              });

              Toast.fire({
                icon: 'error',
                title: 'Por favor compruebe su conexión de internet',
              });
            }
          }
        })
    })
  }

  onGetReferencia() {

    const informe = $('#Informe :selected').val()

    this._activatedRoute.params.subscribe(params => {
      const orden_id = params['orden_id'];

      let data = {
        orden_id,
        informe
      }

      this._informesRutasService.getConsecutivo(data).subscribe((res: any) => {

        this.informe.consecutivo = res.body[0].consecutivo + 1

        if (9 >= this.informe.consecutivo) {
          console.log(this.informe.consecutivo)
          this.consecutivo_modific = `00${this.informe.consecutivo}`
        }

        if (9 <= this.informe.consecutivo) {

          this.consecutivo_modific = `00${this.informe.consecutivo}`

        }

        if (10 <= this.informe.consecutivo) {

          this.consecutivo_modific = `0${this.informe.consecutivo}`

        }


        if (100 <= this.informe.consecutivo) {

          console.log(99)
          this.consecutivo_modific = `${this.informe.consecutivo}`

        }

        const new_referencia = this.tipo_documento + this.consecutivo_modific + this.year

        this.informe.rep_numero = new_referencia

      })
    })
  }

  onChangeConsecutivo() {
    if (9 >= this.informe.consecutivo) {
      this.consecutivo_modific = `00${this.informe.consecutivo}`
    }

    if (9 <= this.informe.consecutivo) {

      this.consecutivo_modific = `00${this.informe.consecutivo}`

    }

    if (10 <= this.informe.consecutivo) {

      this.consecutivo_modific = `0${this.informe.consecutivo}`

    }


    if (100 <= this.informe.consecutivo) {

      console.log(99)
      this.consecutivo_modific = `${this.informe.consecutivo}`

    }

    const new_referencia = this.tipo_documento + this.consecutivo_modific + this.year

    this.informe.rep_numero = new_referencia
  }

  exportDocumentPdf(id_informe: any, nameInforme: any) {

    this.filename = `${nameInforme}.pdf`

    this._activatedRoute.params.subscribe(params => {
      const orden_id = params['orden_id'];

      this._informesRutasService.GETdocumentExportPdf(orden_id, id_informe, nameInforme).subscribe((res: any) => {
        this.download = res

        if (res.state == 'HECHO') {

          let element: HTMLElement = document.getElementsByClassName(
            'btn-close-download'
          )[0] as HTMLElement;
          element.click();
        }
      })

    })
  }

}

