import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from "angular-datatables";
import { Options } from "select2";

//service
import { ProyectosService } from "../../service/proyectos/proyectos.service";
import { ClientesService } from "../../service/clientes/clientes.service";
import { SocketService } from '../../service/sockets/socket.service';

//models
import { NuevoProyecto, EditProyecto } from "../../models/proyectos.models";

import { environment } from "../../../environments/environment";

import { Subject } from 'rxjs';

import Swal from 'sweetalert2';

declare let $: any;

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
  providers: [ProyectosService, ClientesService, SocketService]
})
export class ProyectosComponent implements OnInit {

  public optionsAdd!: Options
  public optionsEdit!: Options

  public dtElement! : DataTableDirective
  public isDtInitialized:boolean = false

  public url: any
  private token: any

  public remoteSearchOptions: any

  public proyectos: any = [];
  public nuevoProyecto: any;
  public clientes: any = [];
  public editProyecto: any;
  public errorMessage: any;
  public errorMessageEdit: any;

  public dtOptions: DataTables.Settings = {};

  public dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private _serviceProyecto: ProyectosService,
    private _serviceCliente: ClientesService,
    private _socketService: SocketService,
    private _router: Router
  ) {
    this.nuevoProyecto = new NuevoProyecto('', '', '', '')
    this.editProyecto = new EditProyecto('', '', '', '', '')
    this.url = environment.url;
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.onDtOptions()
    this.WindowsOnLoad()
    this.getProyectos();
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  event() {

    this._socketService.socketEvent('server:proyectos').subscribe((res: any) => {

      if (res.status == 200 && res.event == 'server:proyectos') {
        this.getProyectos();
      }

    })

    this._socketService.socketEvent('server:clientes').subscribe((res: any) => {

      if (res.status == 200 && res.event == 'server:clientes') {

      }

    })
  }

  getProyectos() {

    this._serviceProyecto.getProyectos().subscribe((res: any) => {
      if (res.status === 200) {
        this.proyectos = res.body
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

  WindowsOnLoad() {
    this.optionsAdd = {
      minimumInputLength: 1,
      ajax: {
        url: `${this.url}/api/v1/getClientesSelect`,
        headers: { 'Authorization': this.token },
        type: 'GET',
        dataType: 'json',
        data: (params) => {
          return {
            cliente: params.term, //search term
            pagina: params.page || 0
          }
        },
        processResults: (data, params) => {

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
      escapeMarkup: function (markup) { return markup; },
      dropdownParent: $('#exampleModal'),
      width: '100%'
    }

    this.optionsEdit = {
      minimumInputLength: 1,
      ajax: {
        url: `${this.url}/api/v1/getClientesSelect`,
        headers: { 'Authorization': this.token },
        type: 'GET',
        dataType: 'json',
        data: (params) => {
          return {
            cliente: params.term, //search term
            pagina: params.page || 0
          }
        },
        processResults: (data, params) => {

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
      escapeMarkup: function (markup) { return markup; },
      dropdownParent: $('#editProyecto'),
      width: '100%'
    }

  }

  getSearchClientes(params: any, data: any) {


    console.log(params, data)

    /*     this._serviceCliente.getClientesSelect().subscribe((res: any) => {
          if (res.status === 200) {
            this.clientes = res.body
            this.WindowsOnLoad(res.body)
          }

        }) */


  }

  addProyecto() {

    this._serviceProyecto.addProyecto(this.nuevoProyecto).subscribe((res: any) => {

      if (res.status === 200) {
        Swal.fire({
          title: '¡El proyecto se ha guardado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
        this.errorMessage = null

        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-add'
        )[0] as HTMLElement;
        element.click();
        this.getProyectos();
        this.nuevoProyecto = new NuevoProyecto('', '', '', '')

        this.errorMessage = false
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

  getProyecto(id: any) {

    this._serviceProyecto.getProyecto(id).subscribe((res: any) => {

      if (res.status === 200) {
        this.editProyecto = res.body[0]
      }


    })



  }

  UpdateProyecto() {

    this._serviceProyecto.updateProyecto(this.editProyecto).subscribe((res: any) => {


      if (res.status === 200) {
        this.getProyectos();
        Swal.fire({
          title: '¡El proyecto se ha modificado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });
        this.errorMessageEdit = null

        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-edit'
        )[0] as HTMLElement;
        element.click();

        this.getProyectos();
        this.editProyecto = new EditProyecto('', '', '', '', '')
      }
    },
      (error) => {
        var errorMessageEdit = <any>error;

        if (errorMessageEdit != null) {
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

  deleteProyecto(id: any) {
    Swal.fire({

      title: "¿Está seguro de eliminar el proyecto?",
      text: "¡Si no lo está puede cancelar la accíon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar proyecto!'

    }).then((result) => {

      if (result.value) {

        this._serviceProyecto.deleteProyecto(id).subscribe((res: any) => {

          if (res.status === 200) {
            Swal.fire({
              title: '¡El Proyecto se ha eliminado correctamente!',
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
}
