import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Router, ActivatedRoute } from '@angular/router';

//SERVICIOS
import { SocketService } from '../../service/sockets/socket.service';
import { SubproyectosService } from "../../service/subproyectos/subproyectos.service";

//MODELOS
import { NuevoSubProyecto, EditSubProyecto } from "../../models/subProyectos.models";

@Component({
  selector: 'app-sub-proyectos',
  templateUrl: './sub-proyectos.component.html',
  styleUrls: ['./sub-proyectos.component.css'],
  providers: [SubproyectosService, SocketService]
})

export class SubProyectosComponent implements OnInit {

  public subproyectos: any = [];
  public nuevoSubProyecto: any;
  public editarSubProyecto: any;
  public message: any;
  public errorMessageEdit: any;

  constructor(
    private _serviceSubproyectos: SubproyectosService,
    private _socketService: SocketService,
    private _route: Router,
    private _activatedRoute: ActivatedRoute

  ){
    this.nuevoSubProyecto = new NuevoSubProyecto('', '', '');
    this.editarSubProyecto = new EditSubProyecto('', '', '', '')
  }

  ngOnInit(): void {
    this.getSubProyectos();
    this.event();


  }

  event(){
    this._socketService.socketEvent('server:subproyectos').subscribe((res:any) =>{

      if (res.status == 200 && res.event == 'server:subproyectos') {
        this.getSubProyectos()
      }

    })
  }

   getSubProyectos() {
    this._activatedRoute.params.subscribe(params => {
      const idProyecto: any = params['idProyecto'] || null;

      this._serviceSubproyectos.getSubproyectos(idProyecto).subscribe((res: any) => {



        if (res.status === 200) {
          this.subproyectos = res.body;
        }
      },
        (error) => {
          var errorMessage = <any>error;

          if (errorMessage != null) {
            var body = error.error;

            if (error.status === 404) {
              this.message = body.body.message
            }

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
        }

      );
    });

  }

  addSubProyecto() {

    this._activatedRoute.params.subscribe(params => {
      const idProyecto: any = params['idProyecto'] || null;

    this.nuevoSubProyecto.proyecto_id = idProyecto

    })

    this._serviceSubproyectos.addSubProyecto(this.nuevoSubProyecto).subscribe((res: any) => {

      if (res.status === 200) {
        Swal.fire({
          title: '¡El SubProyecto se ha guardado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-add'
        )[0] as HTMLElement;
        element.click();
        this.nuevoSubProyecto = new NuevoSubProyecto('', '', '');
        this.message = null
        this.getSubProyectos()
      }

      if (res.status === 404) {
        this.message = res.body.message;
      }

      if (res.status === 404) {
        Swal.fire({
          title: res.body.message,
          icon: 'warning',
          confirmButtonText: 'Cerrar',
        });
      }

      if (res === 500) {
        Swal.fire({
          title: res.body.message,
          icon: 'error',
          confirmButtonText: 'Cerrar',
        });
      }
    })

  }

  getSubproyecto(id: string) {

    this._serviceSubproyectos.getSubProyecto(id).subscribe((res: any) => {


      if (res.status === 200) {
        this.editarSubProyecto = res.body[0]
      }

      if (res.status === 404) {
        Swal.fire({
          title: res.body.message,
          icon: 'warning',
          confirmButtonText: 'Cerrar',
        });
      }

      if (res === 500) {
        Swal.fire({
          title: res.body.message,
          icon: 'error',
          confirmButtonText: 'Cerrar',
        });
      }
    });
  }

  updateEstadoSubProyecto(estado: any, id: string) {

    const Sub_status = {
      id,
      estado
    }

    this._serviceSubproyectos.updateEstadoSubProyecto(Sub_status).subscribe((res: any) => {

      if (res.status === 200) {

        this.getSubProyectos()

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
      });

  }

  editSubProyecto() {


    this._serviceSubproyectos.updateSubProyecto(this.editarSubProyecto).subscribe((res: any) => {

      if (res.status === 200) {
        this.getSubProyectos();
        Swal.fire({
          title: '¡El subproyecto se modifico correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });

        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-edit'
        )[0] as HTMLElement;
        element.click();

        this.getSubProyectos()
        this.editarSubProyecto = new EditSubProyecto('', '', '', '');
        // this.message = null
      }
    },
      (error) => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error;

          if (error.status === 404) {
            this.errorMessageEdit = body.body.message
          }

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
      });
  }

  deleteSubProyecto(id: string) {

    Swal.fire({

      title: "¿Está seguro de eliminar el subproyecto?",
      text: "¡Si no lo está puede cancelar la accíon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar subproyecto!'

    }).then((result) => {

      if (result.value) {

        this._serviceSubproyectos.deleteSubProyecto(id).subscribe((res: any) => {

          if (res.status === 200) {
            Swal.fire({
              title: '¡El SubProyecto se ha eliminado correctamente!',
              icon: 'success',
              confirmButtonText: 'Cerrar',
            });
            this.getSubProyectos();
          }
        }, error => {
          var errorMessage = <any>error;

          if (errorMessage != null) {
            var body = error.error

            if (error.status == 404) {
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
        });
      }
    })


  }
}
