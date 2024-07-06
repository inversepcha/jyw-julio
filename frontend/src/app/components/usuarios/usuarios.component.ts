import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../service/sockets/socket.service';
import { DataTableDirective } from "angular-datatables";

import { UsuariosService } from "../../service/usuarios/usuarios.service";

import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';

/* IMPORT MODELS*/

import { NuevoUsuario, EditarUsuario } from '../../models/usuarios.models';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [SocketService, UsuariosService],
})
export class UsuariosComponent implements OnInit {


  public dtOptions: DataTables.Settings = {};

  public dtTrigger: Subject<any> = new Subject<any>();

  public dtElement! : DataTableDirective
  public isDtInitialized:boolean = false

  public usuarios: any = [];
  public nuevoUsuario: any;
  public editarUsuario: any;
  public message: any;
  public errorMessageEdit: any;
  public url:any

  constructor(private _socketService: SocketService, private _serviceUsuarios: UsuariosService) {
    this.editarUsuario = new EditarUsuario('', '', '', '', '', '');
    this.nuevoUsuario = new NuevoUsuario('', '', '', '', 'NULL');
    this.url = environment.url;
  }

  ngOnInit(): void {
    this.onDtOptions()
    this.getUsuarios();
    this.event();
  }

  onDtOptions() {
    this.dtOptions = {
      processing: true,
      order: [
        [0, "desc"]
      ],
      language: {
        emptyTable: "No hay datos disponibles",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún dato",
        infoFiltered: "(filtrado _MAX_ datos totales)",
        infoPostFix: "",
        lengthMenu: "Mostrar _MENU_ elementos",
        loadingRecords: "Cargando...",
        processing: "Procesando...",
        search: "Buscar:",
        zeroRecords: "Sin resultados encontrados",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior"
        },
        aria: {
          sortAscending: ": Activar para ordenar en orden ascendente",
          sortDescending: ": Activar para ordenar en orden descendente"
        }
      }
    }
  }

  getUsuarios() {
    this._serviceUsuarios.getUsuarios().subscribe((res: any) => {

      if (res.status === 200) {
        this.usuarios = res.body
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        } else {
          this.isDtInitialized = true
          this.dtTrigger.next();
        }
      }

    }, error => {
      var errorMessage = <any>error;

      if (errorMessage != null) {
        var body = error.error

        if (error.status === 404) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            width: '300px'
          })

          Toast.fire({
            icon: 'info',
            title: 'No hay usuarios por favor Agregue uno'
          })
        } else if (error.status === 500) {

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
            title: body.message

          })

        } else if (error.status === 0) {

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

  event() {

    this._socketService.socketEvent('server:usuario').subscribe((res: any) => {

      if (res.status == 200 && res.event == 'server:usuario') {
        this.getUsuarios()
      }

    })

  }

  addUsuario() {

    this._serviceUsuarios.addUsuario(this.nuevoUsuario).subscribe((res: any) => {

      if (res.status === 200) {
        Swal.fire({
          title: '¡El usuario se ha guardado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-add'
        )[0] as HTMLElement;
        element.click();
        this.nuevoUsuario = new NuevoUsuario('', '', '', '', '');
        this.message = null
        this.getUsuarios()
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

  updateStatus(estado: any, id: string) {

    const User_status = {
      id,
      estado
    }

    this._serviceUsuarios.updateStatus(User_status).subscribe((res: any) => {

      if (res.status === 200) {

        this.getUsuarios()

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

  getUsuario(id: string) {

    this._serviceUsuarios.getUsuario(id).subscribe((res: any) => {


      if (res.status === 200) {
        this.editarUsuario = res.body[0]
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

  editUsuario() {


    this._serviceUsuarios.editUsuario(this.editarUsuario).subscribe((res: any) => {

      if (res.status === 200) {
        this.getUsuarios();
        Swal.fire({
          title: '¡El usuario se modifico correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });

        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-edit'
        )[0] as HTMLElement;
        element.click();

        this.getUsuarios()
        this.editarUsuario = new EditarUsuario('', '', '', '', '', '');
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

  deleteUsuario(id: string) {
    Swal.fire({

      title: "¿Está seguro de eliminar el usuario?",
      text: "¡Si no lo está puede cancelar la accíon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar usuario!'

    }).then((result) => {

      if (result.value) {

        this._serviceUsuarios.deleteUsuario(id).subscribe((res: any) => {

          if (res.status === 200) {
            Swal.fire({
              title: '¡El Usuario se ha eliminado correctamente!',
              icon: 'success',
              confirmButtonText: 'Cerrar',
            });
            this.getUsuarios();
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
