import { Component, OnInit, OnDestroy } from '@angular/core';
import { Options } from "select2";
import { Select2OptionData } from 'ng-select2';

//SERVICE
import { SocketService } from '../../service/sockets/socket.service';
import { ClientesService } from "../../service/clientes/clientes.service";
import { DepartamentosService } from "../../service/departamentos/departamentos.service";

import Swal from 'sweetalert2';


import { NuevoCliente, EditCliente } from "../../models/clientes.models";

import { Subject } from 'rxjs';

declare let $: any;

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClientesService, SocketService, DepartamentosService]

})

export class ClientesComponent implements OnInit {

  public optionsAdd!: Options
  public optionsEdit!: Options

  public ciudades!: Array<Select2OptionData>

  public paginacion: any;
  public clientes: any = [];
  public nuevoCliente: any
  public message: any;
  public messageEdit: any;
  public editCliente: any;
  public municipios: any = [];
  public dataSelect2Deparatamentos: any;



  constructor(
    private _serviceClientes: ClientesService,
    private _socketService: SocketService,
    private _departamentosService: DepartamentosService,


  ) {
    this.nuevoCliente = new NuevoCliente('', '', '', '', '');
    this.editCliente = new EditCliente('', '', '', '', '', '')
  }

  ngOnInit(): void {
    this.getDepartamentos();
    this.getClientes();
    this.WindowsOnLoad()
    this.event();
  }

  ngOnDestroy() {
    localStorage.removeItem('cantidadDatos')
  }

  event() {
    this._socketService.socketEvent('server:clientes').subscribe((res: any) => {

      if (res.status == 200 && res.event == 'server:clientes') {
        this.getClientes()
      }

    })
  }

  getDepartamentos() {

    this._departamentosService.getDepartamentos().subscribe((res: any) => {

      const newArray = []

      for (let element of res.body) {

        const elementCiudades: any = []


        for (let elementCiudadesfor of element.ciudades) {
          elementCiudades.push({
            "id": elementCiudadesfor.nombre,
            "text": elementCiudadesfor.nombre
          })
        }
        newArray.push(
          {
            "id": element.nombre,
            "text": element.nombre,
            "children":
              elementCiudades
          }
        )
      }

      this.ciudades = newArray
    })
  }

  WindowsOnLoad() {

    this.optionsAdd = {
      width: '100%',
      dropdownParent: $('#exampleModal'),
      language: "es"
    }

    this.optionsEdit = {
      width: '100%',
      dropdownParent: $('#exampleModal2'),
      language: "es"
    }

  }

  getClientes() {
    this._serviceClientes.getClientes().subscribe((res: any) => {

      if (res.status === 200) {

        const { clientes, paginacion } = res.body

        this.clientes = clientes;
        this.paginacion = paginacion

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
  }

  getClientePaginacion(pagina: any) {

    const cantidad = localStorage.getItem('cantidadDatos') || 5

    this._serviceClientes.getClientesPaginacion(pagina, cantidad).subscribe((res: any) => {

      if (res.status === 200) {

        const { clientes, paginacion } = res.body

        this.clientes = clientes;
        this.paginacion = paginacion

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
  }

  getClienteCantidad(cantidad: any) {


    localStorage.setItem('cantidadDatos', cantidad)

    this._serviceClientes.getClientesPaginacion(0, cantidad).subscribe((res: any) => {

      if (res.status === 200) {

        const { clientes, paginacion } = res.body

        this.clientes = clientes;
        this.paginacion = paginacion

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
  }

  getSearchCliente(cliente:any){



    localStorage.setItem('clienteSearch', cliente)

    this._serviceClientes.getClientesSelect(cliente).subscribe((res: any) => {

      if (cliente != '') {
        if (res.status === 200) {

          const { clientes, paginacion } = res.body

          this.clientes = clientes;
          this.paginacion = paginacion

        }
      }else{
        localStorage.removeItem('clienteSearch')
        this.getClientes()
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
            this.clientes = []
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
  }

  addCliente() {

    this._serviceClientes.addCliente(this.nuevoCliente).subscribe((res: any) => {

      if (res.status === 200) {
        Swal.fire({
          title: '¡El cliente se ha guardado correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });

        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-add'
        )[0] as HTMLElement;
        element.click();

        this.getClientes();
        this.nuevoCliente = new NuevoCliente('', '', '', '', '')

        this.message = false
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

        if (error.status === 404) {
          this.message = body.body.message;
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

        }
        if (error.status == 0) {
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

  getCliente(id: string) {

    this._serviceClientes.getCliente(id).subscribe((res: any) => {

      if (res.status === 200) {
        this.editCliente = res.body[0]
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

        }
        if (error.status == 0) {
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

  deleteCliente(id: string) {
    Swal.fire({

      title: "¿Está seguro de eliminar el cliente?",
      text: "¡Si no lo está puede cancelar la accíon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar cliente!'
    }).then((result) => {

      if (result.value) {
        this._serviceClientes.deleteCliente(id).subscribe((res: any) => {

          if (res.status === 200) {
            Swal.fire({
              title: '¡El cliente se ha eliminado correctamente!',
              icon: 'success',
              confirmButtonText: 'Cerrar',
            });
            this.getClientes();
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
    })
  }

  updateCliente() {

    this._serviceClientes.editCliente(this.editCliente).subscribe((res: any) => {
      if (res.status === 200) {
        Swal.fire({
          title: '¡El cliente se modifico correctamente!',
          icon: 'success',
          confirmButtonText: 'Cerrar',
        });

        let element: HTMLElement = document.getElementsByClassName(
          'btn-close-edit'
        )[0] as HTMLElement;
        element.click();

        this.getClientes();

        this.editCliente = new EditCliente('', '', '', '', '', '')

        this.messageEdit = false;

      }

    }, error => {
      var errorMessage = <any>error;

      if (errorMessage != null) {
        var body = error.error

        if (error.status == 404) {
          this.messageEdit = body.body.message
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

        }
        if (error.status == 0) {
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
