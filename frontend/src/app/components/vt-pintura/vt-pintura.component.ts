import { Component, ElementRef, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators'
//SERVICE
import { SocketService } from '../../service/sockets/socket.service';
import { OrdenesService } from "../../service/ordenes/ordenes.service";
import { VtPinturaService } from "../../service/data-informes/vt-pintura.service";
import { InformesRutasService } from "../../service/rutas-informes/informes-rutas.service";

import { environment } from "../../../environments/environment";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-vt-pintura',
  templateUrl: './vt-pintura.component.html',
  styleUrls: ['./vt-pintura.component.css']
})
export class VtPinturaComponent implements OnInit {

  url: string

  @ViewChild('firmaElaboro')
  firmaElaboroCanvas!: ElementRef;

  @ViewChild('formFileSm')
  myInputVariable!: ElementRef;

  @ViewChild('formFileSmRegistroFotos')
  myInputVariableRegistroFotos!: ElementRef;

  quillModules: any = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  };

  actividades: any = []
  actividadesDurante: any = []
  actividadesDespues: any = []

  detallesOrden: any
  detallesInforme: any

  isLinear = false;
  normasCriterio !: FormGroup;
  PrevioPintura !: FormGroup;
  DurantePintura !: FormGroup;
  DespuesPintura !: FormGroup;

  normasCriterioId: any
  normasCriterioBtnSave: boolean = true
  implementosUtilizados: any = []

  //DESPUES PINTURA
  previoPinturaStatus: boolean = false
  previoPinturaId: any
  actividadesCalificacion: any = []

  //DURANTE PINTURA
  durantePinturaStatus: boolean = false
  durantePinturaId: any
  actividadesCalificacionDurante: any = []

  //DESPUES PINTURA
  despuesPinturaStatus: boolean = false
  despuesPinturaId: any
  actividadesCalificacionDespues: any = []


  //Esquema de inspeccion

  imgSelected: any;
  file!: File;
  EsquemaElementos: any = []
  showFlag: boolean = false;
  selectedImageIndex: number = -1;
  currentIndex: any
  imageObject: Array<object> = []
  titleEsquemaElementos!: FormGroup


  //ELEMENTOS INSPECCIONADOS

  elementosInspeccionadosForm!: FormGroup;
  btnStatusElementos: boolean = false;
  idElemento: any


  //DETALLES ELEMENTOS INSPECCIONADOS

  detallesElementosInspeccionadosForm!: FormGroup
  detallesElementosInspeccionados: any = []
  btnDetallesElementos: boolean = false
  detalleId: any

  //OBSERVACIONES GENERALES

  observacionesForm!: FormGroup;
  btnStatusObservaciones: boolean = false;
  idObservaciones: any

  //REGISTRO FOTOGRAFICOS

  imgSelectedRegistroFotos: any;
  fileRegistroFotos!: File;
  RegistroFotos: any = []
  showFlagRegistroFotos: boolean = false;
  selectedImageIndexRegistroFotos: number = -1;
  currentIndexRegistroFotos: any
  imageObjectRegistroFotos: Array<object> = []
  RegistroFotosForm!: FormGroup

  //FIRMAS
  canvas: any
  firmaRevisaImg: String = ''
  firmaRevisoStatus: boolean = false
  firmaElaboroImg: String = '';
  firmaElaboroStatus: boolean = false


  @ViewChild('firmaElaboro')
  canvasElaboroRef!: ElementRef;

  autoSaveIndex: any
  statusAutoSave: any

  constructor(
    private _socketService: SocketService,
    private _formBuilder: FormBuilder, private _route: Router,
    private _activatedRoute: ActivatedRoute, private _ordenesService: OrdenesService,
    private _vtPinturaService: VtPinturaService, private _informesRutasService: InformesRutasService,
  ) {
    this.url = environment.url;
  }

  ngOnInit(): void {
    this.forms();
    this.onGet();
    this.event()
  }

  event() {
    this._socketService.socketEvent('server:DetallesElementosInspeccionados').subscribe((res: any) => {
      if (res.status == 200 && res.event == 'server:DetallesElementosInspeccionados') {
        this.onGetDetallesElementosInspeccionados();
      }

    })
  }

  forms() {
    this.normasCriterio = this._formBuilder.group({
      equipos: ['', [Validators.required]],
      material_base: ['', Validators.required],
      aplicacion: ['', Validators.required],
      acond_Superficie: ['', Validators.required],
      anticorrosivo: ['', Validators.required],
      intermedia: ['', Validators.required],
      acabado: ['', Validators.required],
    });
    this.PrevioPintura = this._formBuilder.group({
      actividad: ['', [Validators.required]],
      calificacion1: [''],
      calificacion2: [''],
      Observaciones: ['', [Validators.required]]
    });
    this.DurantePintura = this._formBuilder.group({
      actividad: ['', [Validators.required]],
      calificacion1: ['' ],
      calificacion2: [''],
      Observaciones: ['', [Validators.required]]
    });
    this.DespuesPintura = this._formBuilder.group({
      actividad: ['', [Validators.required]],
      calificacion1: [''],
      calificacion2: [''],
      Observaciones: ['']
    });
    this.titleEsquemaElementos = this._formBuilder.group({
      title: ['', [Validators.required]],
    });
    this.elementosInspeccionadosForm = this._formBuilder.group({
      elementos: ['', [Validators.required]],
    });
    this.detallesElementosInspeccionadosForm = this._formBuilder.group({
      elemento: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      defecto: ['', [Validators.required]],
      calificacion: ['', [Validators.required]],
      observacion: ['', [Validators.required]]
    })
    this.observacionesForm = this._formBuilder.group({
      observaciones: ['', [Validators.required]]
    })

    this.RegistroFotosForm = this._formBuilder.group({
      title: ['', [Validators.required]],
    });

  }

  onGet() {
    this.onGetDetallesOrden()
    this.onGetPrevioPintura()
    this.onGetDurantePintura()
    this.onGetDespuesPintura()
    this.onGetAutoSave()
    this.onGetImplementos();
    this.onGetResumenEditNormasCriterio();
    this.onGetEsquemaElementos()
    this.onGetElementosInspeccionados()
    this.onGetDetallesElementosInspeccionados();
    this.onGetObservaciones();
    this.onGetRegistroFotos();
    this.getFirmaElaboro()
    this.getFirmaReviso()
  }

  onGetDetallesOrden() {
    this._activatedRoute.params.subscribe(params => {
      const orden_id = params['orden_id'];
      const informe_id = params['informe_id'];

      this._ordenesService.getDetallesOrdenes(orden_id).subscribe((res) => {

        this.detallesOrden = res.body[0]

      })

      this._vtPinturaService.getDetallesInforme(informe_id).subscribe((res) => {

        this.detallesInforme = res.body[0]

        console.log(res.body)

        this.onGetActividades()
      })
    })
  }

  onGetActividades() {

    console.log( ' ho', this.detallesInforme.informe_id)

    this._vtPinturaService.getActividades(this.detallesInforme.informe_id).subscribe((res => {
      this.actividades = res.body.ActividadesPrevioPintura
      this.actividadesDurante = res.body.ActividadesDurante
      this.actividadesDespues = res.body.ActividadesDespues

      console.log('actividad ', this.actividades)
    }))
  }

  onGetImplementos() {
    this._activatedRoute.params.subscribe(params => {
      const orden_id = params['orden_id'];

      this._ordenesService.getImplementosOrdenes(orden_id).subscribe((res) => {

        this.implementosUtilizados = res.body
      })

    })
  }

  onGetResumenEditNormasCriterio() {

    this._activatedRoute.params.subscribe(params => {

      const orden_id = params['orden_id'];

      const informe_id = params['informe_id'];

      this._vtPinturaService.getNormasCriterioVtPintura(orden_id, informe_id).subscribe((res) => {

        this.normasCriterioId = res.body._id

        this.normasCriterio.patchValue(res.body)

        this.normasCriterioBtnSave = false
      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 500) {

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

  onSubmitOrEditNormasCriterio() {

    if (this.normasCriterioId) {
      let data = { ...this.normasCriterio.value, _id: this.normasCriterioId }

      this._vtPinturaService.putNormasCriterioVtPintura(data).subscribe((res) => {

        this.onGetResumenEditNormasCriterio()

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
    } else {
      this._activatedRoute.params.subscribe(params => {

        const orden_id = params['orden_id'];

        const informe_id = params['informe_id'];

        let data = { ...this.normasCriterio.value, orden_id, informe_id }

        this._vtPinturaService.postNormasCriterioVtPintura(data).subscribe((res) => {

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
      })
    }
  }

  //PREVIO PINTURA

  onClickEditPrevioPintura(data: any) {

    this.previoPinturaId = data._id

    this.previoPinturaStatus = true
    this.actividades.push(data.actividad)
    this.actividadesCalificacion.splice(data.actividad, 1);
    this.PrevioPintura.patchValue(data)
  }

  cancelarEditPrevioPintura() {
    this.onGetPrevioPintura()
    this.PrevioPintura.reset()
    this.previoPinturaStatus = false;

  }



  onGetPrevioPintura() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._vtPinturaService.getPrevioPintura(orden_id, informe_id).subscribe((data) => {

        this._vtPinturaService.getActividades(this.detallesInforme.informe_id).subscribe((res => {
          this.actividades = res.body.ActividadesPrevioPintura
          data.body.map((item: any) => {
            let i = this.actividades.indexOf(item.actividad)

            this.actividades.splice(i, 1);
          })
        }))


        this.actividadesCalificacion = data.body

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.previoPinturaStatus = false
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

  onSubmitPrevioPintura() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

    if(this.PrevioPintura.value.calificacion1 ==  ""){
      this.PrevioPintura.value.calificacion1 = "N.A."
    }

      let data = {
        ...this.PrevioPintura.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._vtPinturaService.postPrevioPintura(data).subscribe((res) => {

        this.onGetPrevioPintura()
        this.PrevioPintura.reset()
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
    })
  }

  onEditarPrevioPintura() {
    if (this.PrevioPintura.value.actividad == '') {

    } else {
      this._vtPinturaService.putPrevioPintura(this.PrevioPintura.value, this.previoPinturaId).subscribe((res) => {
        this.PrevioPintura.reset()
        this.onGetPrevioPintura()
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
    }


  }

  onGetAutoSave() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._informesRutasService.getAutoSaveStepper(orden_id, informe_id).subscribe((res) => {

        this.statusAutoSave = true

        this.autoSaveIndex = res.body

        this.windowOnloadCanvasElaboro()
        this.windowOnloadCanvasReviso()

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.statusAutoSave = false
            this.autoSaveIndex = body.body
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

  setIndex(event: any) {


    if (this.statusAutoSave == true) {
      let data = {
        indexStepper: event.selectedIndex
      }

      this._informesRutasService.putAutoSaveStepper(data, this.autoSaveIndex._id).subscribe((res) => {
        this.onGetAutoSave()
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
    } else if (this.statusAutoSave == false) {
      this._activatedRoute.params.subscribe(params => {
        const { orden_id, informe_id } = params;


        let data = {
          indexStepper: event.selectedIndex,
          orden_id,
          informe_id
        }

        this._informesRutasService.postAutoSaveStepper(data).subscribe((res) => {
          this.onGetAutoSave()
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

      })
    }
  }

  //DURANTE LA PINTURA

  onCancelarDurante() {

    this.durantePinturaStatus = false
    this.onGetDurantePintura()
    this.DurantePintura.reset()

  }

  onClickEditDurantePintura(data: any) {

    this.durantePinturaId = data._id
    this.actividadesDurante.push(data.actividad)
    this.DurantePintura.patchValue(data)
    this.durantePinturaStatus = true
  }

  onGetDurantePintura() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._vtPinturaService.getdurantePintura(orden_id, informe_id).subscribe((data) => {

        this._vtPinturaService.getActividades(this.detallesInforme.informe_id).subscribe((res => {
          this.actividadesDurante = res.body.ActividadesDurante
          data.body.map((item: any) => {
            let i = this.actividadesDurante.indexOf(item.actividad)

            this.actividadesDurante.splice(i, 1);
          })

        }))


        this.actividadesCalificacionDurante = data.body

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.durantePinturaStatus = false
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

  onSubmitDurantePintura() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      if(this.DurantePintura.value.calificacion1 ==  ""){
        this.DurantePintura.value.calificacion1 = "N.A."
      }

      let data = {
        ...this.DurantePintura.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._vtPinturaService.postdurantePintura(data).subscribe((res) => {

        this.onGetDurantePintura();

        /*         let i = this.actividadesDurante.indexOf(this.DurantePintura.value.actividad)

                this.actividadesDurante.splice(i, 1); */

        this.DurantePintura.reset()

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
    })
  }

  onEditarDurantePintura() {
    if (this.DurantePintura.value.actividad == '') {

    } else {
      this._vtPinturaService.putdurantePintura(this.DurantePintura.value, this.durantePinturaId).subscribe((res) => {
        this.DurantePintura.reset()
        this.onGetDurantePintura()
        this.durantePinturaStatus = false
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
    }


  }

  //DESPUES PINTURA

  onClickEditDespuesPintura(data: any) {



    this.despuesPinturaId = data._id

    this.despuesPinturaStatus = true

    this.actividadesDespues.push(data.actividad)
    this.actividadesCalificacionDespues.splice(data.actividad, 1);
    this.DespuesPintura.patchValue(data)
  }

  onClickCancel() {

    this.DespuesPintura.reset()

    this.onGetDespuesPintura()

    this.despuesPinturaStatus = false
  }

  onGetDespuesPintura() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._vtPinturaService.getDespuesPintura(orden_id, informe_id).subscribe((data: any) => {

        this._vtPinturaService.getActividades(this.detallesInforme.informe_id).subscribe((res => {
          this.actividadesDespues = res.body.ActividadesDespues
          data.body.map((item: any) => {

            let i = this.actividadesDespues.indexOf(item.actividad)

            this.actividadesDespues.splice(i, 1);

          })
        }))

        this.actividadesCalificacionDespues = data.body

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.durantePinturaStatus = false
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

  onSubmitDespuesPintura() {

    if (this.DespuesPintura.value.actividad === '') {

    } else {
      this._activatedRoute.params.subscribe(params => {
        const { orden_id, informe_id } = params;

        if(this.DespuesPintura.value.calificacion1 ==  ""){
          this.DespuesPintura.value.calificacion1 = "N.A."
        }
        let data = {
          ...this.DespuesPintura.value,
          orden_id: orden_id,
          informe_id: informe_id
        }

        this._vtPinturaService.postDespuesPintura(data).subscribe((res) => {

          let i = this.actividadesDespues.indexOf(this.DespuesPintura.value.actividad)

          this.actividadesDespues.splice(i, 1);

          this.DespuesPintura.reset()

          this.onGetDespuesPintura()

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
      })
    }



  }

  onEditarDespuesPintura() {
    if (this.DespuesPintura.value.actividad == '') {

    } else {
      this._vtPinturaService.putDespuesPintura(this.DespuesPintura.value, this.despuesPinturaId).subscribe((res) => {
        this.despuesPinturaStatus = false
        this.DespuesPintura.reset()
        this.onGetDespuesPintura()
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
    }
  }

  //Esquema de inspeccion

  onPhotoSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
    }
  }

  onSubmitEsquemaElementos() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      const title = this.titleEsquemaElementos.get('title')!.value

      const data = {

        orden_id,
        informe_id,
        title

      }

      this._vtPinturaService.postEsquemaElementos(data, this.file).subscribe((res) => {
        this.onGetEsquemaElementos();
        this.titleEsquemaElementos.reset();
        this.myInputVariable.nativeElement.value = "";
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
    })
  }

  onGetEsquemaElementos() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._vtPinturaService.getEsquemaElementos(orden_id, informe_id).subscribe((res: any) => {

        this.EsquemaElementos = res.body

        res.body.map((item: any) => {


          const data = { image: `${this.url}/img-uploads/${item.image}`, title: item.title }

          this.imageObject.push(data)
        })

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.durantePinturaStatus = false
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

  showLightbox(index: any) {

    this.selectedImageIndex = index;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }

  deleteEsquemaElemetos(id: any) {
    this._vtPinturaService.deleteEsquemaElementos(id).subscribe((res: any) => {
      this.onGetEsquemaElementos()
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
  }

  //ELEMENTOS INSPECCIONADOS

  onSubmitElementosInspeccionados() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;
      let data = {
        ...this.elementosInspeccionadosForm.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._vtPinturaService.postElementosInspeccionados(data).subscribe((res) => {
        this.onGetElementosInspeccionados()
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
    })
  }

  onGetElementosInspeccionados() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._vtPinturaService.getElementosInspeccionados(orden_id, informe_id).subscribe((res: any) => {

        this.btnStatusElementos = true

        this.elementosInspeccionadosForm.patchValue(res.body[0])

        this.idElemento = res.body[0]._id

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.durantePinturaStatus = false
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

  onSubmitEditarElementosInspeccionados() {

    this._vtPinturaService.putElementosInspeccionados(this.idElemento, this.elementosInspeccionadosForm.value).subscribe((res) => {

      this.onGetElementosInspeccionados()


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

  }

  //ELEMENTOS INSPECCIONADOS
  onSubmitDetallesElementosInspeccionados() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;


      const multiplicador = $('#multiplicar').val()

      let data = {
        'dataInfo':[{
          orden_id,
          informe_id,
          ...this.detallesElementosInspeccionadosForm.value
        }
       ],
       'multiplicar': [multiplicador]
      }

      this._vtPinturaService.postDetallesElementosInspeccionados(data).subscribe((res) => {

        this.onGetDetallesElementosInspeccionados()
        this.detallesElementosInspeccionadosForm.reset()
        $('#multiplicar').val(0)

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

    })
  }

  onClickEditarDetallesElementosInspeccionados(item: any) {
    this.btnDetallesElementos = true

    this.detalleId = item._id

    this.detallesElementosInspeccionados.splice(item.elemento, 1);
    this.detallesElementosInspeccionadosForm.patchValue(item)
  }

  onClickCancelEditaDetalles() {

    this.detallesElementosInspeccionadosForm.reset()

    this.onGetDetallesElementosInspeccionados()

    this.btnDetallesElementos = false
  }

  onGetDetallesElementosInspeccionados() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._vtPinturaService.getDetallesElementosInspeccionados(orden_id, informe_id).subscribe((res: any) => {

        this.detallesElementosInspeccionados = res.body

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.durantePinturaStatus = false
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

  onSubmitEditarDetallesElementosInspeccionados() {

    this._vtPinturaService.putDetallesElementosInspeccionados(this.detalleId, this.detallesElementosInspeccionadosForm.value).subscribe((res) => {

      this.detallesElementosInspeccionadosForm.reset()

      this.onGetDetallesElementosInspeccionados()

      this.btnDetallesElementos = false

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

  }

  //OBSERVACIONES GENERALES

  onSubmitObservaciones() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;
      let data = {
        ...this.observacionesForm.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._vtPinturaService.postObservaciones(data).subscribe((res) => {
        this.onGetObservaciones()
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
    })
  }

  onGetObservaciones() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._vtPinturaService.getObservaciones(orden_id, informe_id).subscribe((res: any) => {

        this.btnStatusObservaciones = true

        this.observacionesForm.patchValue(res.body[0])



        this.idObservaciones = res.body[0]._id

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.durantePinturaStatus = false
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

  onSubmitEditarObservaciones() {

    this._vtPinturaService.putObservaciones(this.idObservaciones, this.observacionesForm.value).subscribe((res) => {

      this.onGetObservaciones()


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

  }

  //REGISTRO FOTOGRÁFICO

  onPhotoSelectedRegistroFotos(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.fileRegistroFotos = <File>event.target.files[0];

    }
  }

  onSubmitRegistroFotos() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      const title = this.RegistroFotosForm.get('title')!.value

      const data = {

        orden_id,
        informe_id,
        title

      }

      this._vtPinturaService.postRegistroFotos(data, this.fileRegistroFotos).subscribe((res) => {
        this.onGetRegistroFotos();
        this.RegistroFotosForm.reset();
        this.myInputVariableRegistroFotos.nativeElement.value = "";
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
    })
  }

  onGetRegistroFotos() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._vtPinturaService.getRegistroFotografico(orden_id, informe_id).subscribe((res: any) => {

        this.RegistroFotos = res.body

        res.body.map((item: any) => {

          const data = { image: `${this.url}/img-uploads/${item.image}`, title: item.title }

          this.imageObjectRegistroFotos.push(data)
        })

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.durantePinturaStatus = false
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

  showLightboxRegistroFotos(index: any) {


    this.selectedImageIndexRegistroFotos = index;
    this.showFlagRegistroFotos = true;
  }

  closeEventHandlerRegistroFotos() {
    this.showFlagRegistroFotos = false;
    this.selectedImageIndexRegistroFotos = -1;
  }

  //FIRMAS

  getFirmaElaboro() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._vtPinturaService.getFirmaElboro(orden_id, informe_id).subscribe((res: any) => {
        this.firmaElaboroImg = res.body[0].firma
        this.firmaElaboroStatus = true

        console.log(res.body)

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
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

  getFirmaReviso() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._vtPinturaService.getFirmaReviso(orden_id, informe_id).subscribe((res: any) => {
        this.firmaRevisaImg = res.body[0].firma
        this.firmaRevisoStatus = true
      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
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

  windowOnloadCanvasElaboro(): void {
    if (this.autoSaveIndex) {

      setTimeout(() => {
        var canvasElaboro = <HTMLCanvasElement>document.getElementById('firmaElaboro')
        var ctxElaboro = canvasElaboro.getContext('2d')

        $('#btn-finalizar-firma-elaboro').on('click', () => {
          var dataUrl = canvasElaboro.toDataURL();


          this._activatedRoute.params.subscribe(params => {
            const { orden_id, informe_id } = params;

            let data = {
              firma: dataUrl,
              orden_id,
              informe_id
            }

            this._vtPinturaService.postFirmaElaboro(data).subscribe((res: any) => {
              this.getFirmaElaboro()
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
          })
        })


        $('#draw-clearBtn-firma-elaboro').on('click', () => {

          ctxElaboro?.clearRect(0, 0, canvasElaboro.width, canvasElaboro.height)

        })

        /*     $('.guardarControlIngreso').on('click', () => {
              this.statusImgSign = false
              ctx.clearRect(0, 0, canvas.width, canvas.height)
            }) */

        // Activamos MouseEvent para nuestra pagina
        var drawing = false;
        var mousePos = { x: 0, y: 0 };
        var lastPos = mousePos;
        canvasElaboro.addEventListener("mousedown", function (e) {
          /*
            Mas alla de solo llamar a una funcion, usamos function (e){...}
            para mas versatilidad cuando ocurre un evento
          */

          drawing = true;
          lastPos = getMousePos(canvasElaboro, e);
        }, false);
        canvasElaboro.addEventListener("mouseup", function (e) {
          drawing = false;
        }, false);
        canvasElaboro.addEventListener("mousemove", function (e) {
          mousePos = getMousePos(canvasElaboro, e);
        }, false);

        // Activamos touchEvent para nuestra pagina
        canvasElaboro.addEventListener("touchstart", function (e) {
          mousePos = getTouchPos(canvasElaboro, e);
          e.preventDefault(); // Prevent scrolling when touching the canvasElaboro
          var touch = e.touches[0];
          var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
          });
          canvasElaboro.dispatchEvent(mouseEvent);
        }, false);
        canvasElaboro.addEventListener("touchend", function (e) {
          e.preventDefault(); // Prevent scrolling when touching the canvasElaboro
          var mouseEvent = new MouseEvent("mouseup", {});
          canvasElaboro.dispatchEvent(mouseEvent);
        }, false);
        canvasElaboro.addEventListener("touchleave", function (e) {
          // Realiza el mismo proceso que touchend en caso de que el dedo se deslice fuera del canvasElaboro
          e.preventDefault(); // Prevent scrolling when touching the canvasElaboro
          var mouseEvent = new MouseEvent("mouseup", {});
          canvasElaboro.dispatchEvent(mouseEvent);
        }, false);
        canvasElaboro.addEventListener("touchmove", function (e) {
          e.preventDefault(); // Prevent scrolling when touching the canvasElaboro
          var touch = e.touches[0];
          var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
          });
          canvasElaboro.dispatchEvent(mouseEvent);
        }, false);

        // Get the position of the mouse relative to the canvasElaboro
        function getMousePos(canvasDom: any, mouseEvent: any) {
          var rect = canvasDom.getBoundingClientRect();
          /*
            Devuelve el tamaño de un elemento y su posición relativa respecto
            a la ventana de visualización (viewport).
          */
          return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
          };
        }

        // Get the position of a touch relative to the canvas
        function getTouchPos(canvasDom: any, touchEvent: any) {
          var rect = canvasDom.getBoundingClientRect();
          /*
            Devuelve el tamaño de un elemento y su posición relativa respecto
            a la ventana de visualización (viewport).
          */
          return {
            x: touchEvent.touches[0].clientX - rect.left, // Popiedad de todo evento Touch
            y: touchEvent.touches[0].clientY - rect.top
          };
        }

        // Draw to the canvas
        function renderCanvas() {
          if (drawing) {
            var tint = '#000000';
            var punta = 3;
            ctxElaboro!.strokeStyle = tint;
            ctxElaboro!.beginPath();
            ctxElaboro!.moveTo(lastPos.x, lastPos.y);
            ctxElaboro!.lineTo(mousePos.x, mousePos.y);
            ctxElaboro!.lineWidth = punta;
            ctxElaboro!.stroke();
            ctxElaboro!.closePath();
            lastPos = mousePos;
          }
        }

        // Allow for animation
        (function drawLoop() {
          requestAnimationFrame(drawLoop);
          renderCanvas();
        })();
      }, 2);

    }
  }

  windowOnloadCanvasReviso(): void {
    if (this.autoSaveIndex) {

      setTimeout(() => {
        var firmaReviso = <HTMLCanvasElement>document.getElementById('firmaReviso')
        var ctxReviso = firmaReviso.getContext('2d')

        $('#btn-finalizar-firma-reviso').on('click', () => {
          var dataUrl = firmaReviso.toDataURL();


          this._activatedRoute.params.subscribe(params => {
            const { orden_id, informe_id } = params;

            let data = {
              firma: dataUrl,
              orden_id,
              informe_id
            }

            this._vtPinturaService.postFirmaReviso(data).subscribe((res: any) => {
              this.getFirmaReviso()
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
          })
        })


        $('#draw-clearBtn-firma-reviso').on('click', () => {

          ctxReviso?.clearRect(0, 0, firmaReviso.width, firmaReviso.height)

        })

        /*     $('.guardarControlIngreso').on('click', () => {
              this.statusImgSign = false
              ctx.clearRect(0, 0, canvas.width, canvas.height)
            }) */

        // Activamos MouseEvent para nuestra pagina
        var drawing = false;
        var mousePos = { x: 0, y: 0 };
        var lastPos = mousePos;
        firmaReviso.addEventListener("mousedown", function (e) {
          /*
            Mas alla de solo llamar a una funcion, usamos function (e){...}
            para mas versatilidad cuando ocurre un evento
          */

          drawing = true;
          lastPos = getMousePos(firmaReviso, e);
        }, false);
        firmaReviso.addEventListener("mouseup", function (e) {
          drawing = false;
        }, false);
        firmaReviso.addEventListener("mousemove", function (e) {
          mousePos = getMousePos(firmaReviso, e);
        }, false);

        // Activamos touchEvent para nuestra pagina
        firmaReviso.addEventListener("touchstart", function (e) {
          mousePos = getTouchPos(firmaReviso, e);
          e.preventDefault(); // Prevent scrolling when touching the firmaReviso
          var touch = e.touches[0];
          var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
          });
          firmaReviso.dispatchEvent(mouseEvent);
        }, false);
        firmaReviso.addEventListener("touchend", function (e) {
          e.preventDefault(); // Prevent scrolling when touching the firmaReviso
          var mouseEvent = new MouseEvent("mouseup", {});
          firmaReviso.dispatchEvent(mouseEvent);
        }, false);
        firmaReviso.addEventListener("touchleave", function (e) {
          // Realiza el mismo proceso que touchend en caso de que el dedo se deslice fuera del firmaReviso
          e.preventDefault(); // Prevent scrolling when touching the firmaReviso
          var mouseEvent = new MouseEvent("mouseup", {});
          firmaReviso.dispatchEvent(mouseEvent);
        }, false);
        firmaReviso.addEventListener("touchmove", function (e) {
          e.preventDefault(); // Prevent scrolling when touching the firmaReviso
          var touch = e.touches[0];
          var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
          });
          firmaReviso.dispatchEvent(mouseEvent);
        }, false);

        // Get the position of the mouse relative to the firmaReviso
        function getMousePos(canvasDom: any, mouseEvent: any) {
          var rect = canvasDom.getBoundingClientRect();
          /*
            Devuelve el tamaño de un elemento y su posición relativa respecto
            a la ventana de visualización (viewport).
          */
          return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
          };
        }

        // Get the position of a touch relative to the canvas
        function getTouchPos(canvasDom: any, touchEvent: any) {
          var rect = canvasDom.getBoundingClientRect();
          /*
            Devuelve el tamaño de un elemento y su posición relativa respecto
            a la ventana de visualización (viewport).
          */
          return {
            x: touchEvent.touches[0].clientX - rect.left, // Popiedad de todo evento Touch
            y: touchEvent.touches[0].clientY - rect.top
          };
        }

        // Draw to the canvas
        function renderCanvas() {
          if (drawing) {
            var tint = '#000000';
            var punta = 3;
            ctxReviso!.strokeStyle = tint;
            ctxReviso!.beginPath();
            ctxReviso!.moveTo(lastPos.x, lastPos.y);
            ctxReviso!.lineTo(mousePos.x, mousePos.y);
            ctxReviso!.lineWidth = punta;
            ctxReviso!.stroke();
            ctxReviso!.closePath();
            lastPos = mousePos;
          }
        }

        // Allow for animation
        (function drawLoop() {
          requestAnimationFrame(drawLoop);
          renderCanvas();
        })();
      }, 2);

    }
  }


  validarSeleccion(event: any){

    if (event == "") {
      this.DespuesPintura.value.calificacion1 = "A"
    }
    else{
      this.DespuesPintura.value.calificacion1 = "N.A."
    }
  }
}
