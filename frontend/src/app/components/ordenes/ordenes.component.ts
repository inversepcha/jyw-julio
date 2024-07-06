import { Component, OnInit, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Select2OptionData } from "ng-select2";
import { Options } from "select2";

import { SocketService } from '../../service/sockets/socket.service';


import { OrdenesService } from '../../service/ordenes/ordenes.service';
import { ProyectosService } from '../../service/proyectos/proyectos.service';
import { SubproyectosService } from "../../service/subproyectos/subproyectos.service";
import { UsuariosService } from 'src/app/service/usuarios/usuarios.service';
import { ImplementosService } from 'src/app/service/implementos/implementos.service';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';

import {
  NuevaOrden,
  EditarOrden,
  AddUsuario,
  AddImplemento
} from '../../models/ordenes';

import Swal from 'sweetalert2';

import * as moment from 'moment'
import { formatDate } from '@angular/common';

declare let $: any;

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css']
})
export class OrdenesComponent implements OnInit {

  public optionsAdd!: Options
  public optionsAddImplemento !: Options

  public optionsAddProyecto!: Options
  public optionsEditProyecto !: Options

  /* ORDENES */

  public ordenes: any = [];
  public proyectos: any = []
  public subProyectos: any = []
  public NuevaOrden: any;
  public EditarOrden: any;
  public contadorOrdenes: any
  public detallesOrdenes: any
  public usuariosOrdenesDetalles: any = []

  /* USUARIOS */

  public usuariosOrdenes: any = []
  public usuariosOrdenesHistorial: any = []
  public usuarios: any = []
  public addUsuario: any
  public messageAddUsuario: any
  public usuariosTable: any = []
  public usuariosModal: any = []
  public newUsuario = {
    fecha_inicial: '',
    fecha_final: '',
    Usuario_id: ''
  }
  public errorUsuarioAdd: any
  public errorFechaAdd: any
  public subProyectosEditar: any;
  startDate :any
  endDate : any
  public statusEditAndSubmit : boolean = false
  public eventSelectedUser : any


  /* IMPLEMENTOS */

  public implementosOrdenesHistorial: any = []
  public implementosOrdenes: any = []
  public message: any;
  public errorSerialMessage: any;
  public newImplemento = {
    implemento_id: ''
  }
  public implementosTable: any = []
  public addImplemento: any
  public implementosOrdenesModal: any = []
  public errorImplementoAdd: any
  public messageAddImplemento: any
  public errorImplemento: any

  public identity: any
  public token: any
  public url: string;

  constructor(
    private _http: HttpClient,
    private _socketService: SocketService,
    private _serviceOrdenes: OrdenesService,
    private _serviceUsuarios: UsuariosService,
    private _proyectosService: ProyectosService,
    private _subproyectosService: SubproyectosService,
    private _serviceImplemento: ImplementosService
  ) {
    this.url = environment.url;
    this.NuevaOrden = new NuevaOrden('', '', new Date(), '', '');
    this.EditarOrden = new EditarOrden('', '', '', new Date(), '', 0);
    this.addUsuario = new AddUsuario('', '', '', '');
    this.addImplemento = new AddImplemento('', '')
    this.identity = _serviceUsuarios.getIdentity();
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.WindowsOnLoad();
    this.getOrdenes()
    this.getContadorOrdenes()
    this.event()

  }

  WindowsOnLoad() {

    let options = {
      minimumInputLength: 2,
      ajax: {
        url: `${this.url}/api/v1/getImplementosSelect`,
        headers: { 'Authorization': this.token },
        type: 'GET',
        dataType: 'json',
        data: (params: any) => {

          return {
            implemento: params.term, //search term
            pagina: params.page || 0
          }
        },
        processResults: (data: any, params: any) => {

          params.page = params.page || 0;

          return {
            results: data.body.data,
            pagination: {
              more: 30 <= data.body.total_count
            }
          };
        },
        cache: true
      },
      templateResult: this.templateResult,
      escapeMarkup: function (markup: any) {
        return markup;
      },

    }

    this.optionsAdd = {
      ...options,
      dropdownParent: $('#exampleModal1'),
      width: '100%'
    }

    this.optionsAddProyecto = {
      minimumInputLength: 2,
      dropdownParent: $('#exampleModal1'),
      width: '100%',
      ajax: {
        url: `${this.url}/api/v1/getProyectosSelect`,
        headers: { 'Authorization': this.token },
        type: 'GET',
        dataType: 'json',
        data: (params: any) => {

          return {
            proyecto: params.term,
            pagina: params.page || 0
          }
        },
        processResults: (data: any, params: any) => {

          params.page = params.page || 0;

          return {
            results: data.body.data,
            pagination: {
              more: 30 <= data.body.numeroPaginas
            }
          };
        },
        cache: true
      },
      templateResult: this.templateResultProyecto,
      escapeMarkup: function (markup: any) {
        return markup;
      },

    }

    this.optionsAddImplemento = {
      ...options,
      dropdownParent: $('#implementosModal'),
      width: '100%'
    }
  }

  public templateResult = (state: any): JQuery | string => {

    if (!state.id) {
      return state.text;
    }

    return jQuery("<div class='select2-result-repository clearfix'>" +
      `
        <div class='select2-result-repository__meta'>
        <div class='select2-result-repository__title' style='color: black; font-weight: 700; word-wrap: break-word; line-height: 1.1; margin-bottom: 4px;'>${state.text}</div>
        <div class='select2-result-repository__description'></div>
        <div class='select2-result-repository__statistics'>
        <div class='select2-result-repository__forks' style='display: inline-block; color: #777; font-size: 15px;'>Codigo N: ${state.codigo_n} </div>
        <div class='select2-result-repository__stargazers' style='display: inline-block; color: #777;  font-size: 15px;'>Serial: ${state.serial}</div>
        </div>
        </div>
        </div>`)
  }

  public templateResultProyecto = (state: any): JQuery | string => {

    if (!state.id) {
      return state.text;
    }

    return jQuery("<div class='select2-result-repository clearfix'>" +
      `
        <div class='select2-result-repository__meta'>
        <div class='select2-result-repository__title' style='color: black; font-weight: 700; word-wrap: break-word; line-height: 1.1; margin-bottom: 4px;'>${state.text}</div>
        <div class='select2-result-repository__description'></div>
        <div class='select2-result-repository__statistics'>
        <div class='select2-result-repository__forks' style='display: inline-block; color: #777; font-size: 15px;'>Cliente: ${state.cliente} </div>
        </div>
        </div>
        </div>`)
  }

  event() {

    this._socketService.socketEvent('server:ordenes').subscribe((res: any) => {

      if (res.status == 200 && res.event == 'server:ordenes') {
        this.getOrdenes();
        this.getContadorOrdenes();
      }
    })
  }

  getContadorOrdenes() {
    this._serviceOrdenes.getContadorOrdenes().subscribe((res: any) => {

      this.contadorOrdenes = res.body[0]
    })



  }

  getOrdenes() {

    if (this.identity.perfil == "Operador") {
      var id = this.identity.id
    }
    else {
      var id = null;
    }

    this._serviceOrdenes.getOrdenes(id).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.ordenes = res.body;
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

            this.ordenes = []

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

  getProyectos() {

    this._proyectosService.getProyectos().subscribe((res: any) => {

      this.proyectos = res.body

    })



  }

  getSubProyectos(idProyecto: string) {
    this._subproyectosService.getSubproyectos(idProyecto).subscribe((res: any) => {

      this.subProyectos = res.body

    },
      (error) => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error;

          if (error.status === 404) {
            this.subProyectos = []

            Swal.fire({
              title: `¡No hay subproyectos vinculados a este proyecto! <a href="/sub-proyectos/${idProyecto}">Agregar uno</a>`,
              icon: 'warning',
              confirmButtonText: 'Cerrar',
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

  //

  getUsuariosSelect() {
    this._serviceUsuarios.getUsuariosSelect().subscribe((res: any) => {
      this.usuarios = res.body
    })
  }

  getUsuarioOrdenes(id: any) {

    this.addUsuario.orden_id = id

    this._serviceOrdenes.getUsuariosOrdenes(id).subscribe((res: any) => {

      this.usuariosOrdenes = res.body
    }, error => {
      var errorMessage = <any>error;

      if (errorMessage != null) {
        var body = error.error

        if (error.status === 404) {
          this.usuariosOrdenes = []
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

  getImplementosOrdenes(id: any) {

    this.addImplemento.orden_id = id

    this._serviceOrdenes.getImplementosOrdenes(id).subscribe((res: any) => {

      this.implementosOrdenes = res.body

    }, error => {
      var errorMessage = <any>error;

      if (errorMessage != null) {
        var body = error.error

        if (error.status === 404) {
          this.implementosOrdenes = []
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

  getImplementoSelect() {

    this._serviceImplemento.getImplementoSelect().subscribe((res: any) => {

      this.implementosOrdenes = res.body

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

  getOrden(id: any) {

    this._serviceOrdenes.getOrden(id).subscribe((res: any) => {

      if (res.status === 200) {

        this.getSubProyectosEditar(res.body[0].proyecto_id)

        this.EditarOrden = res.body[0]


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

  async agregar_implemento() {

    const name_implemento = $('#implementoSelect option:selected').text()

    if (this.newImplemento.implemento_id == '') {
      this.errorImplementoAdd = 'Ingrese un Implemento válido'
    } else {

      if (this.implementosTable.filter((element: any) => element.id === this.newImplemento.implemento_id) != 0) {
        this.errorImplementoAdd = 'Ya hay un implemento registrado'
      } else {

        let data = { implemento_name: name_implemento, id: this.newImplemento.implemento_id }

        await this.implementosTable.push(data);
        this.errorImplementoAdd = null;
        this.newImplemento = { implemento_id: '' }
      }
    }
  }

  remover_implemento(idImplemento: any) {
    this.implementosTable.splice(idImplemento, 1);
  }


  SelectedValue(event: any ){

    this.eventSelectedUser = event.source.triggerValue

  }

  async agregar_usuario() {
    if (this.newUsuario.Usuario_id == '' || this.newUsuario.fecha_inicial == '' && this.newUsuario.fecha_final == '') {
      this.errorUsuarioAdd = 'Ingrese un usuario válido y una fecha valida'
    } else {
      if (this.usuariosTable.filter((element: any) => element.id === this.newUsuario.Usuario_id) != 0) {
        this.errorUsuarioAdd = 'Ya hay un usuario registrado'
      } else {
        let data = { usuario_name: this.eventSelectedUser, fecha_inicial: this.newUsuario.fecha_inicial, fecha_final: this.newUsuario.fecha_final, id: this.newUsuario.Usuario_id }

        await this.usuariosTable.push(data)
        this.errorUsuarioAdd = null;
        this.errorFechaAdd = null;
        this.newUsuario.fecha_inicial = ''
        this.newUsuario.fecha_final = ''
        this.newUsuario.Usuario_id = ''
      }

    }


  }

  remover_usuario(idUsuario: any) {
    this.usuariosTable.splice(idUsuario, 1);
  }

  addOrden() {

    let data = { ...this.NuevaOrden, usuarios_id: this.usuariosTable, implementos_id: this.implementosTable }


    console.log(data)

    this._serviceOrdenes.addOrdenes(data).subscribe((res: any) => {

      if (res.status === 200) {
        Swal.fire({
          title: '¡La Orden se ha guardado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
        this.message = null

        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-add'
        )[0] as HTMLElement;
        element.click();

        this.getOrdenes();
        this.NuevaOrden = new NuevaOrden('', '', new Date(), '', '')

        this.message = false

        this.implementosTable = [];

        this.usuariosTable = [];
      }
    }, error => {
      var message = <any>error;

      if (message != null) {
        var body = error.error
        if (error.status === 404) {
          this.message = body.body.message
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

  calculateDiff(fecha: any) {

    let date = moment(new Date(fecha).toISOString().slice(0, 10));
    let currentDate = moment(new Date().toISOString().slice(0, 10));

    let dias = date.diff(currentDate, 'days');

    if (dias <= 1) {

      var dia = `Falta ${dias} Dia`

      if (dias < 1) {
        var dia = `Faltan 0 Dias`
      }


    } else {
      var dia = `Faltan ${dias} Dias`
    }
    return dia;
  }

  deleteOrden(id: any) {
    Swal.fire({

      title: "¿Está seguro de eliminar la Orden?",
      text: "¡Si no lo está puede cancelar la accíon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar orden!'

    }).then((result) => {

      if (result.value) {

        this._serviceOrdenes.deleteOrden(id).subscribe((res: any) => {

          if (res.status === 200) {
            Swal.fire({
              title: '¡La orden se ha eliminado correctamente!',
              icon: 'success',
              confirmButtonText: 'Cerrar',
            });
            this.getProyectos();
          }
        },
          error => {
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

  getUsuariosSelectModal() {
    this._serviceUsuarios.getUsuariosSelect().subscribe((res: any) => {
      this.usuariosModal = res.body
    })
  }

  addUsuarioOrden() {

    this._serviceOrdenes.addUsuarioOrdenes(this.addUsuario).subscribe((res: any) => {

      if (res.status === 200) {
        Swal.fire({
          title: 'El Usuario se ha guardado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
        this.message = null

        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-add'
        )[0] as HTMLElement;
        element.click();

        this.getUsuarioOrdenes(this.addUsuario.orden_id);
        this.addUsuario.usuario_id, this.addUsuario.fecha_visita = ''

        this.message = false

      }
    }, error => {
      var message = <any>error;

      if (message != null) {
        var body = error.error
        if (error.status === 404) {
          this.messageAddUsuario = body.body.message
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

  deleteUsuarioOrden(id: any) {
    Swal.fire({

      title: "¿Está seguro de eliminar el Usuario?",
      text: "¡Si no lo está puede cancelar la accíon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar Usuario!'

    }).then((result) => {

      if (result.value) {

        this._serviceOrdenes.deleteUsuarioOrden(id).subscribe((res: any) => {

          if (res.status === 200) {
            Swal.fire({
              title: '¡El usuario se ha eliminado correctamente!',
              icon: 'success',
              confirmButtonText: 'Cerrar',
            });
            this.getUsuarioOrdenes(id);
          }
        },
          error => {
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

  getUsuariosOrdenHistorial(id: any) {
    this._serviceOrdenes.getUsuariosOrdenesHistorial(id).subscribe((res: any) => {

      this.usuariosOrdenesHistorial = res.body
    },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status == 404) {
            this.usuariosOrdenesHistorial = []
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

  getImplementosOrdenHistorial(id: any) {
    this._serviceOrdenes.getImplemntosOrdenesHistorial(id).subscribe((res: any) => {
      this.implementosOrdenesHistorial = res.body
    },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status == 404) {
            this.implementosOrdenesHistorial = []
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

  saveImplemento() {

    if (this.addImplemento.implemento_id == '') {
      this.errorImplemento = 'Seleccione una opción válida.'
    }else{
      this.errorImplemento = null
      this._serviceOrdenes.addImplementoOrdenes(this.addImplemento).subscribe((res: any) => {

        if (res.status === 200) {
          Swal.fire({
            title: 'El Implemento se ha guardado correctamente!',
            icon: 'success',
            confirmButtonText: 'Cerrar',
          });

          this.getImplementosOrdenes(this.addImplemento.orden_id);

          this.messageAddImplemento = false

        }
      }, error => {
        var message = <any>error;

        if (message != null) {
          var body = error.error
          if (error.status === 404) {
            this.messageAddImplemento = body.body.message
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

  deleteImplementoOrden(id: any) {
    Swal.fire({
      title: "¿Está seguro de eliminar el implmento?",
      text: "¡Si no lo está puede cancelar la accíon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar Implemento!'

    }).then((result) => {

      if (result.value) {

        this._serviceOrdenes.deleteImplemento(id).subscribe((res: any) => {

          if (res.status === 200) {
            Swal.fire({
              title: '¡El implemento se ha eliminado correctamente!',
              icon: 'success',
              confirmButtonText: 'Cerrar',
            });

            this.getImplementosOrdenes(this.addImplemento.orden_id);

          }
        },
          error => {
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

  getSubProyectosEditar(idProyecto: string) {
    this._subproyectosService.getSubproyectos(idProyecto).subscribe((res: any) => {

      this.subProyectosEditar = res.body

    },
      (error) => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error;

          if (error.status === 404) {
            this.subProyectos = []

            Swal.fire({
              title: `¡No hay subproyectos vinculados a este proyecto! <a href="/sub-proyectos/${idProyecto}">Agregar uno</a>`,
              icon: 'warning',
              confirmButtonText: 'Cerrar',
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

  updateOrden() {

    this._serviceOrdenes.updateOrden(this.EditarOrden).subscribe((res: any) => {

      if (res.status === 200) {

        Swal.fire({
          title: '¡La Orden se ha modificado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });

        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-edit'
        )[0] as HTMLElement
        element.click();

        this.getOrdenes()
        this.EditarOrden = new EditarOrden('', '', '', new Date(), '', 0)

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
      })
  }

  getDetallesOrden(id: any) {
    this._serviceOrdenes.getDetallesOrdenes(id).subscribe((res: any) => {
      this.detallesOrdenes = res.body[0]
      this.usuariosOrdenesDetalles = res.body[0].Usuarios_Json
    })
  }

  onEventClickUsuario(data: any){

     this.addUsuario = data

     this.statusEditAndSubmit = true

  }

  onEventClickUsuarioCancelar(){
    this.statusEditAndSubmit = false
    this.addUsuario = new AddUsuario('', '', '', '');
  }

  onSubmitEditUsuario(){

    const {usuario_id, fecha_inicial, fecha_final, id } = this.addUsuario

    let data = {
        usuario_id,
        fecha_final,
        fecha_inicial,
        id
    }

    console.log(data)

     this._serviceOrdenes.updateUsuarioOrdenes(data).subscribe((res: any) => {

      if (res.status === 200) {
        Swal.fire({
          title: 'El Usuario se ha modificado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
        this.statusEditAndSubmit = false
        this.getUsuarioOrdenes(this.addUsuario.orden_id);
        this.addUsuario = {}
        this.addUsuario = new AddUsuario('', '', '', '');
      }
    }, error => {
      var message = <any>error;

      if (message != null) {
        var body = error.error
        if (error.status === 404) {
          this.messageAddUsuario = body.body.message
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
