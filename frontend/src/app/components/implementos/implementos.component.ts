import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../service/sockets/socket.service';
import { DataTableDirective } from "angular-datatables";

import { ImplementosService } from '../../service/implementos/implementos.service';
import { TipoImplementoService } from "../../service/tipo_implemento/tipo-implemento.service";

import {
  NuevoImplemento,
  EditarImplemento,
} from '../../models/implementos.models';

import Swal from 'sweetalert2';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-implementos',
  templateUrl: './implementos.component.html',
  styleUrls: ['./implementos.component.css'],
  providers: [SocketService, ImplementosService, TipoImplementoService],
})
export class ImplementosComponent implements OnInit {

  public dtElement!: DataTableDirective
  public isDtInitialized: boolean = false

  public implementos: any = [];
  public nuevoImplemento: any;
  public editarImplemento: any;
  public message: any;
  public dataserial: any = [];
  public serialdata: string = '';
  public modelodata: string = '';
  public codigodata: string = '';
  public seriales: any = [];
  public errorSerialMessage: any;
  public errorSerialImplemento: any;
  public tipoImplementos: any = [];
  public newSerial = {
    serial: '',
    modelo: '',
    codigo_n: '',
    implemento_id: ''
  }
  public errorMessage: any;
  public errorMessageEdit: any;


  public dtOptions: DataTables.Settings = {};

  public dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private _socketService: SocketService,
    private _serviceImplementos: ImplementosService,
    private _serviceTipoImplementos: TipoImplementoService
  ) {
    this.editarImplemento = new EditarImplemento('', '', '', '');
    this.nuevoImplemento = new NuevoImplemento('', '', '');
  }

  ngOnInit(): void {
    this.onDtOptions()
    this.getImplementos();
    this.event();

  }

  onDtOptions() {
    this.dtOptions = {
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

  async Agregar_Serial() {

    if (this.serialdata === '' || this.modelodata === '' || this.codigodata === '') {
      this.errorSerialImplemento = 'Ingrese un serial y un modelo valido'
    } else {

      if (this.dataserial.filter((element: any) => element.serial === this.serialdata) != 0) {
        this.errorSerialImplemento = 'Ya hay un serial registrado'
      } else {

        let data = { serial: this.serialdata, modelo: this.modelodata, codigo_n: this.codigodata }

        await this.dataserial.push(data);
        this.errorSerialImplemento = null;
        this.serialdata = ''
        this.modelodata = ''
        this.codigodata = ''
      }
    }
  }

  remover(dataserial: any) {
    this.dataserial.splice(dataserial, 1);
  }

  getImplementos() {
    this._serviceImplementos.getImplementos().subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.implementos = res.body;

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
      },
      (error) => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error;

          if (error.status === 404) {
            this.errorMessage = body.body.message
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
      }
    );
  }

  tiposImplementos() {
    this._serviceTipoImplementos.getTiposImplementos().subscribe((res: any) => {

      if (res.status == 200) {
        this.tipoImplementos = res.body
      }
    })
  }

  event() {
    this._socketService.socketEvent('server:implementos').subscribe((res: any) => {

      if (res.status == 200 && res.event == 'server:implementos') {
        this.getImplementos();
      }

    })

    this._socketService.socketEvent('server:tipo_implemento').subscribe((res: any) => {

      if (res.status == 200 && res.event == 'server:tipo_implemento') {
        this.tiposImplementos();
      }

    })
  }

  SaveImplemento() {
    const data = {
      ...this.nuevoImplemento,
      serial: this.dataserial,
    };
    this._serviceImplementos.addImplementos(data).subscribe((res: any) => {
      if (res.status === 200) {
        Swal.fire({
          title: '¡El implemento se ha guardado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-add'
        )[0] as HTMLElement;
        element.click();
        this.nuevoImplemento = new NuevoImplemento('', '', '');

        this.errorMessage = null;
        this.getImplementos();
        this.dataserial = [];
      }
    },
      (error) => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error;

          if (error.status === 404) {
            this.errorMessage = body.body.message
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

  getSeriales(id: any) {

    this.newSerial.implemento_id = id

    this._serviceImplementos.getSeriales(id).subscribe((res: any) => {
      if (res.status === 200) {
        this.seriales = res.body;
        this.errorSerialMessage = null
      }

    }, error => {
      var errorMessage = <any>error;

      if (errorMessage != null) {
        var body = error.error

        if (error.status == 404) {
          this.errorSerialMessage = body.body.message
          this.seriales = [];
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

  deleteImplemento(id: any) {
    Swal.fire({

      title: "¿Está seguro de eliminar el implemento?",
      text: "¡Si no lo está puede cancelar la accíon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar implemento!'

    }).then((result) => {

      if (result.value) {

        this._serviceImplementos.deleteImplemento(id).subscribe((res: any) => {

          if (res.status === 200) {
            Swal.fire({
              title: '¡El Implemento se ha eliminado correctamente!',
              icon: 'success',
              confirmButtonText: 'Cerrar',
            });
            this.getImplementos();
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

  deleteSerial(id: any, implemento_id: any) {

    Swal.fire({

      title: "¿Está seguro de eliminar el serial?",
      text: "¡Si no lo está puede cancelar la accíon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar serial!'
    }).then((result) => {

      if (result.value) {
        this._serviceImplementos.deleteSerial(id).subscribe((res: any) => {

          if (res.status === 200) {
            this.getSeriales(implemento_id)
            Swal.fire({
              title: '¡El Serial se ha eliminado correctamente!',
              icon: 'success',
              confirmButtonText: 'Cerrar',
            });
          }

        }, error => {
          var errorMessage = <any>error;

          if (errorMessage != null) {
            var body = error.error

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
    })
  }

  addSerial() {

    if (this.newSerial.serial === '') {
      this.errorSerialMessage = 'Ingrese un serial valido';
    } else {
      this.errorSerialMessage = null
      this._serviceImplementos.addSerial(this.newSerial).subscribe((res: any) => {

        if (res.status === 200) {
          this.getSeriales(this.newSerial.implemento_id)
          Swal.fire({
            title: '¡El serial se ha guardado correctamente!',
            icon: 'success',
            confirmButtonText: 'Cerrar',
          });
          this.newSerial.serial = ''
          this.newSerial.codigo_n = ''
          this.newSerial.modelo = ''
          this.errorSerialMessage = null;
        }

      }, error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.message = body.body.message;
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
  }

  getImplemento(id: any) {

    this._serviceImplementos.getImplemento(id).subscribe((res: any) => {

      if (res.status === 200) {

        this.editarImplemento = res.body[0]

      }
    }, error => {
      var errorMessage = <any>error;

      if (errorMessage != null) {
        var body = error.error

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

  updateImplemento() {

    this._serviceImplementos.updateImplemento(this.editarImplemento).subscribe((res: any) => {

      if (res.status === 200) {
        this.getImplementos()
        Swal.fire({
          title: '¡El implemento se ha modificado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });

        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-edit'
        )[0] as HTMLElement
        element.click();

        this.getImplementos()
        this.editarImplemento = new EditarImplemento('', '', '', '')

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
      })
  }


}
