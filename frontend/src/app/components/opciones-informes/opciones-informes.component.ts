import { Component, ElementRef, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';




import { DataTableDirective } from "angular-datatables";

import { OpcionesInformesService } from "../../service/opciones-informes/opciones-informes.service";

import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';

/* IMPORT MODELS*/

import { NuevoUsuario, EditarUsuario } from '../../models/usuarios.models';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-opciones-informes',
  templateUrl: './opciones-informes.component.html',
  styleUrls: ['./opciones-informes.component.css']
})
export class OpcionesInformesComponent implements OnInit {

  public dtOptions: DataTables.Settings = {};

  public dtTrigger: Subject<any> = new Subject<any>();

  public dtElement!: DataTableDirective
  public isDtInitialized: boolean = false

  url: string;

  @ViewChild('formFileSmRegistroFotos')
  myInputVariableRegistroFotos!: ElementRef;

  quillModules: any = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  };


  isLinear = false;
  Parametros!: FormGroup;
  dataOpcionesForm!: FormGroup;


  ParametrosId: any
  ParametrosBtnSave: boolean = true
  ParametrosStatus: boolean = false;

  ParametrosA: any
  OpcionesInfomes: any = []
  dataOpciones: any = []

  constructor(
    private _formBuilder: FormBuilder, private _route: Router,
    private _activatedRoute: ActivatedRoute,
    private _opcionesInformes: OpcionesInformesService,
  ) {

    this.url = environment.url;
  }

  ngOnInit(): void {
    this.onDtOptions()
    this.forms()
    this.onGetOpcionesInformes()
  }


  forms() {
    this.Parametros = this._formBuilder.group({
      name: ['', [Validators.required]],
      data: ['', [Validators.required]],
    });
  }

  // onGet() {

  // }


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


  onGetOpciones() {
    this._activatedRoute.params.subscribe(params => {
      const { informe_id } = params;

      this._opcionesInformes.getOpciones(informe_id).subscribe((res) => {

        this.OpcionesInfomes = res.body[0]

        console.log(this.OpcionesInfomes)

      })
    })
  }

  onSubmitOpciones() {

    this._activatedRoute.params.subscribe(params => {

      const { informe_id } = params;

      let data = {
        name: this.Parametros.value.name,
        data: this.dataOpciones,
        informe_id: informe_id

      }

      this._opcionesInformes.addOpciones(data).subscribe((res) => {

        this.onGetOpciones()
        this.Parametros.reset()
      },
        error => {

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
                title: body.message
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
    })
  }


  onGetOpcionesInformes() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._opcionesInformes.getOpciones(informe_id).subscribe((res) => {

        this.OpcionesInfomes = res.body

        console.log(this.OpcionesInfomes)

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.ParametrosStatus = false
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

    })
  }

  onClickEditParametros(data: any) {

    this.ParametrosId = data._id

    this.ParametrosStatus = true
    this.OpcionesInfomes.splice(data.actividad, 1);
    this.Parametros.patchValue(data)
  }


  cancelarEditParametros() {
    this.onGetOpcionesInformes()
    this.Parametros.reset()
    this.ParametrosStatus = false;

  }

  onSubmitOpcionesInformes() {


    this.dataOpciones.push(this.Parametros.value.data)

    console.log(this.dataOpciones)

    /*  this._activatedRoute.params.subscribe(params => {
       const { informe_id } = params;

       let data = {
         ...this.Parametros.value,
         informe_id: informe_id
       }

       this._opcionesInformes.addOpciones(data).subscribe((res) => {

         console.log(data);
         this.onGetOpcionesInformes()
         this.Parametros.reset()
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
               title: body.message
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
     }) */
  }

  // onEditarOpcionesInformes() {
  //   if (this.Parametros.value.actividad == '') {

  //   } else {
  //     this._opcionesInformes.putO(this.Parametros.value, this.ParametrosId).subscribe((res: any) => {
  //       this.Parametros.reset()
  //       this.onGetOpcionesInformes()
  //     }, error => {

  //       var errorMessage = <any>error;

  //       if (errorMessage != null) {
  //         var body = error.error

  //         if (error.status === 404) {
  //           const Toast = Swal.mixin({
  //             toast: true,
  //             position: 'center',
  //             showConfirmButton: false,
  //             timer: 4000,
  //             timerProgressBar: true,
  //             width: '300px'
  //           })

  //           Toast.fire({
  //             icon: 'info',
  //             title: body.message
  //           })
  //         } else if (error.status === 500) {

  //           const Toast = Swal.mixin({
  //             toast: true,
  //             position: 'center',
  //             showConfirmButton: false,
  //             timer: 4000,
  //             timerProgressBar: true,
  //             width: '300px'
  //           })

  //           Toast.fire({
  //             icon: 'error',
  //             title: body.message

  //           })

  //         } else if (error.status === 0) {

  //           const Toast = Swal.mixin({
  //             toast: true,
  //             position: 'center',
  //             showConfirmButton: false,
  //             timer: 4000,
  //             timerProgressBar: true,
  //             width: '300px'
  //           })

  //           Toast.fire({
  //             icon: 'error',
  //             title: 'Por favor compruebe su conexión de internet'

  //           })

  //         }
  //       }
  //     })
  //   }


  // }


}
