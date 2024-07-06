import { Component, OnInit } from '@angular/core';

//SERVICIOS
import { TipoImplementoService } from "../../service/tipo_implemento/tipo-implemento.service";
import { SocketService } from '../../service/sockets/socket.service';

//MODELOS
import { NuevoTipoImplemento, EditTipoImplemento } from "../../models/tipo_implemento";

import Swal from 'sweetalert2';
@Component({
  selector: 'app-tipo-implentos',
  templateUrl: './tipo-implentos.component.html',
  styleUrls: ['./tipo-implentos.component.css'],
  providers: [TipoImplementoService, SocketService]
})
export class TipoImplentosComponent implements OnInit {

  public nuvoTipoImplemento: any
  public errorMessage: any;
  public errorMessageEdit: any
  public tiposImplementos: any = []
  public editTipoImplemento: any

  constructor(
    private _tipoImplementoService: TipoImplementoService,
    private _socketService: SocketService
  ) {
    this.nuvoTipoImplemento = new NuevoTipoImplemento('')
    this.editTipoImplemento = new EditTipoImplemento('')
  }

  ngOnInit(): void {
    this.getTipo_Implementos()
    this.event()
  }

  event() {

    this._socketService.socketEvent('server:tipo_implemento').subscribe((res:any) =>{

      if (res.status == 200 && res.event == 'server:tipo_implemento') {
        this.getTipo_Implementos();
      }

    })
  }

  addTipo_Implemento() {

    this._tipoImplementoService.addTipoImplemento(this.nuvoTipoImplemento).subscribe((res: any) => {

      if (res.status === 200) {
        Swal.fire({
          title: '¡El tipo de implemento se ha guardado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
        this.errorMessage = null

        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-add'
        )[0] as HTMLElement;
        element.click();
        this.getTipo_Implementos();
        this.nuvoTipoImplemento = new NuevoTipoImplemento('')
      }
    }, error => {
      var errorMessage = <any>error;

      if (errorMessage != null) {
        var body = error.error
        if (error.status === 404) {
          this.errorMessage = body.body.message
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
  }

  getTipo_Implementos() {
    this._tipoImplementoService.getTiposImplementos().subscribe((res: any) => {
      if (res.status === 200) {
        this.tiposImplementos = res.body;
      }
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
          }

          if (error.status === 500) {
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
          }

          if (error.status === 0) {
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

  getTipo_Implemento(id: any) {
    this._tipoImplementoService.getTipoImplemento(id).subscribe((res: any) => {
      if (res.status == 200) {
        this.editTipoImplemento = res.body[0]
      }
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
        }

        if (error.status === 500) {
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
        }

        if (error.status === 0) {
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

  updateTipoImplemento() {
    this._tipoImplementoService.updateTipoImplemento(this.editTipoImplemento).subscribe((res: any) => {

      if (res.status == 200) {
        Swal.fire({
          title: '¡El tipo de implemento se ha modificado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-edit'
        )[0] as HTMLElement;
        element.click();
        this.editTipoImplemento = new EditTipoImplemento('');
      }


    }, error => {
      var errorMessage = <any>error;

      if (errorMessage != null) {
        var body = error.error
        if (error.status === 404) {
          this.errorMessageEdit = body.body.message
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
  }

  deleteTipoImplemento(id: any) {


    Swal.fire({

      title: "¿Está seguro de eliminar el tipo de implemento?",
      text: "¡Si no lo está puede cancelar la accíon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar tipo de implemento!'
    }).then((result) =>{

      if (result.value) {
        this._tipoImplementoService.deleteTipoImplemento(id).subscribe((res: any) => {

          if (res.status == 200) {
            Swal.fire({
              title: '¡El tipo de implemento se ha eliminado correctamente!',
              icon: 'success',
              confirmButtonText: 'Cerrar',
            });
          }
        })
      }

    })


  }
}
