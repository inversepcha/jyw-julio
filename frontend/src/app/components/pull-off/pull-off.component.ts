import { Component, ElementRef, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';


import { InformesRutasService } from "../../service/rutas-informes/informes-rutas.service";
import { OrdenesService } from "../../service/ordenes/ordenes.service";
import { PullOffService } from 'src/app/service/pull_off/pull-off.service';
import { environment } from "../../../environments/environment";


import Swal from 'sweetalert2';

@Component({
  selector: 'app-pull-off',
  templateUrl: './pull-off.component.html',
  styleUrls: ['./pull-off.component.css']
})
export class PullOffComponent implements OnInit {

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

  detallesOrden: any
  detallesInforme: any

  isLinear = false;
  Normas!: FormGroup;
  Procedimient!: FormGroup;
  Sistem_pint!: FormGroup;
  Metodo_limpieza!: FormGroup;
  elementosInspeccionadosForm!: FormGroup;
  ResultadosObtenidos!: FormGroup;
  Observaciones!: FormGroup;
  RegistroFotografico!: FormGroup;

  actividades: any = []

  NormasId: any
  NormasBtnSave: boolean = true
  NormasStatus: boolean = false;

  ProcedimientoId: any
  ProcedimientoBtnSave: boolean = true
  ProcedimientoStatus: boolean = false;

  SistemaPinturaStatus: boolean = false;
  SistemaPinturaId: any
  SistemaPintura: any = []

  MetodoLimpiezaId: any
  MetodoLimpiezaBtnSave: boolean = true
  MetodoLimpiezaStatus: boolean = false;

  ElementosInspeccionadosId: any
  ElementosInspeccionadosBtnSave: boolean = true
  ElementosInspeccionadosStatus: boolean = false;

  ResultadoObtenidoId: any
  ResultadoObtenidoBtnSave: boolean = true
  ResultadoObtenidoStatus: boolean = false;
  ResultadoObtenidos: any = []

  ObservacionesId: any
  ObservacionesBtnSave: boolean = true
  ObservacionesStatus: boolean = false;

  autoSaveIndex: any
  statusAutoSave: any


  //REGISTRO FOTOGRÁFICO

  imgSelectedRegistroFotos: any;
  fileRegistroFotos!: File;
  RegistroFotos: any = []
  showFlagRegistroFotos: boolean = false;
  selectedImageIndexRegistroFotos: number = -1;
  currentIndexRegistroFotos: any
  imageObjectRegistroFotos: Array<object> = []
  RegistroFotosForm!: FormGroup


  //firmas
  canvas: any
  firmaRevisaImg: String = ''
  firmaRevisoStatus: boolean = false


  firmaElaboroImg: String = '';
  firmaElaboroStatus: boolean = false

  @ViewChild('firmaElaboro')
  canvasElaboroRef!: ElementRef;


  constructor(
    private _formBuilder: FormBuilder, private _route: Router,
    private _activatedRoute: ActivatedRoute, private _ordenesService: OrdenesService,
    private _pull_offService: PullOffService,
    private _informesRutasService: InformesRutasService
  ) {

    this.url = environment.url;
  }

  ngOnInit(): void {
    this.onGetDetallesOrden()
    this.forms()
    this.onGet()
  }


  forms() {
    this.Normas = this._formBuilder.group({
      ensayo: ['', [Validators.required]],
      criterio_evaluacion: ['', [Validators.required]]

    });
    this.Procedimient = this._formBuilder.group({
      procedimiento: ['', [Validators.required]],
      metodo_ensayo: ['', [Validators.required]],
      equipos_emp: ['', [Validators.required]],
      adhesivo: ['', [Validators.required]],

    });
    this.Sistem_pint = this._formBuilder.group({
      operacion: ['', [Validators.required]],
      calificacion: ['', [Validators.required]],
      aplicacion: ['', [Validators.required]],
      espesor: ['', [Validators.required]],
      tiempo_curado: ['', [Validators.required]]

    });
    this.Metodo_limpieza = this._formBuilder.group({
      sustrato: ['', [Validators.required]],
      metodo_limpieza: ['', [Validators.required]],
      temperatura_ambiente: ['', [Validators.required]],
      humedad_relativa: ['', [Validators.required]],
      temperatura_substrato: ['', [Validators.required]],
      punto_rocio: ['', [Validators.required]],
    });
    this.elementosInspeccionadosForm = this._formBuilder.group({
      elemento_inspeccionado: ['', [Validators.required, Validators.maxLength(50)]],
    });
    this.ResultadosObtenidos = this._formBuilder.group({
      elemento_inspeccionado: ['', [Validators.required]],
      espesor_pintura: ['', [Validators.required]],
      numero_dado: ['', [Validators.required]],
      adherencia_obtenida: ['', [Validators.required]],
      calificacion: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
    });
    this.Observaciones = this._formBuilder.group({
      observacion: ['', [Validators.required]],
    });
    this.RegistroFotosForm = this._formBuilder.group({
      title: ['', [Validators.required]],
    });

  }

  onGet() {
    this.onGetAutoSave()
    this.onGetDetallesOrden()
    this.onGetNormasPullOff()
    this.onGetProcedimiento()
    this.onGetSistemaPintura()
    this.onGetMetodoLimpiezaPullOff()
    this.onGetElementosInspeccionados()
    this.onGetResultadosObtenidos()
    this.onGetObservaciones()
    this.onGetRegistroFotos()
    this.getFirmaElaboro()
    this.getFirmaReviso()
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

  onGetDetallesOrden() {
    this._activatedRoute.params.subscribe(params => {
      const orden_id = params['orden_id'];
      const informe_id = params['informe_id'];

      this._ordenesService.getDetallesOrdenes(orden_id).subscribe((res) => {

        this.detallesOrden = res.body[0]

      })

      this._pull_offService.getDetallesInforme(informe_id).subscribe((res) => {

        this.detallesInforme = res.body[0]

        // console.log(res.body)

        this.NormasId = res.body._id

      })
    })
  }

  onGetNormasPullOff() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._pull_offService.getNormaPullOff(orden_id, informe_id).subscribe((res: any) => {

        this.NormasId = res.body._id

        this.Normas.patchValue(res.body)

        this.NormasBtnSave = false


      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.NormasStatus = false
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

  onEditNormas() {

    if (this.NormasId) {
      let data = { ...this.Normas.value }

      // console.log(data)

      this._pull_offService.putNormasPullOff(data, this.NormasId).subscribe((res) => {

        this.onGetNormasPullOff()

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

        let data = { ...this.Normas.value, orden_id, informe_id }

        this._pull_offService.postNormaPullOff(data).subscribe((res) => {

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

  onSubmitProcedimiento() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Procedimient.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._pull_offService.postProcedimiento(data).subscribe((res) => {

        this.onGetProcedimiento()
        this.Procedimient.reset()
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

  onEditProcedimiento() {

    if (this.ProcedimientoId) {
      let data = { ...this.Procedimient.value }

      console.log(data, "datos editar")

      this._pull_offService.putProcedimiento(data, this.ProcedimientoId).subscribe((res) => {

        this.onGetProcedimiento()

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

        let data = { ...this.Normas.value, orden_id, informe_id }

        this._pull_offService.postNormaPullOff(data).subscribe((res) => {

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

  onGetProcedimiento() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._pull_offService.getProcedimiento(orden_id, informe_id).subscribe((res: any) => {

        this.ProcedimientoId = res.body._id

        this.Procedimient.patchValue(res.body)

        this.ProcedimientoBtnSave = false

        console.log(this.Procedimient)


      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.NormasStatus = false
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


  onGetSistemaPintura() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._pull_offService.getSistemaPintura(orden_id, informe_id).subscribe((data) => {


        this.SistemaPintura = data.body

        console.log(this.SistemaPintura);
      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.SistemaPinturaStatus = false
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

  onClickEditSistemaPintura(data: any) {

    this.SistemaPinturaId = data._id

    this.SistemaPinturaStatus = true
    this.SistemaPintura.splice(data.actividad, 1);
    this.Sistem_pint.patchValue(data)
  }


  cancelarEditSistemaPintura() {
    this.onGetSistemaPintura()
    this.Sistem_pint.reset()
    this.SistemaPinturaStatus = false;

  }

  onSubmitSistemaPintura() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Sistem_pint.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._pull_offService.postSistemaPintura(data).subscribe((res) => {

        this.onGetSistemaPintura()
        this.Sistem_pint.reset()
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

  onEditarSistemaPintura() {
    if (this.Sistem_pint.value.actividad == '') {

    } else {
      this._pull_offService.putSistemaPintura(this.Sistem_pint.value, this.SistemaPinturaId).subscribe((res) => {
        this.Sistem_pint.reset()
        this.onGetSistemaPintura()
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

  onGetMetodoLimpiezaPullOff() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._pull_offService.getMetodoLimpieza(orden_id, informe_id).subscribe((res: any) => {

        this.MetodoLimpiezaId = res.body._id

        this.Metodo_limpieza.patchValue(res.body)

        this.MetodoLimpiezaBtnSave = false


      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.NormasStatus = false
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

  onSubmitMetodoLimpieza() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Metodo_limpieza.value,
        orden_id: orden_id,
        informe_id: informe_id
      }


      this._pull_offService.postMetodoLimpieza(data).subscribe((res) => {

        this.onGetMetodoLimpiezaPullOff()
        this.Metodo_limpieza.reset();

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

  onEditarMetodoLimpieza() {
    if (this.Metodo_limpieza.value.actividad == '') {

    } else {
      this._pull_offService.putMetodoLimpieza(this.Metodo_limpieza.value, this.MetodoLimpiezaId).subscribe((res) => {
        this.Metodo_limpieza.reset()
        this.onGetMetodoLimpiezaPullOff()

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


  onGetElementosInspeccionados() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._pull_offService.getElementosInspeccionados(orden_id, informe_id).subscribe((res: any) => {

        this.ElementosInspeccionadosId = res.body._id

        this.elementosInspeccionadosForm.patchValue(res.body)

        this.ElementosInspeccionadosBtnSave = false


      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.NormasStatus = false
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

  onSubmitElementosInspeccionados() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.elementosInspeccionadosForm.value,
        orden_id: orden_id,
        informe_id: informe_id
      }


      this._pull_offService.postElementosInspeccionados(data).subscribe((res) => {

        this.onGetElementosInspeccionados()
        this.elementosInspeccionadosForm.reset();

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

  onEditarElementosInspeccionados() {
    if (this.elementosInspeccionadosForm.value.actividad == '') {

    } else {
      this._pull_offService.putElementosInspeccionados(this.elementosInspeccionadosForm.value, this.ElementosInspeccionadosId).subscribe((res) => {
        this.elementosInspeccionadosForm.reset()
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


  }


  //Resultados Obtenidos

  onGetResultadosObtenidos() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._pull_offService.getResultadosObtenidos(orden_id, informe_id).subscribe((data) => {


        this.ResultadoObtenidos = data.body
      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.SistemaPinturaStatus = false
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

  onClickEditResultadosObtenidos(data: any) {

    this.ResultadoObtenidoId = data._id

    this.ResultadoObtenidoStatus = true
    this.ResultadosObtenidos.patchValue(data)
  }


  cancelarEditResultadosObtenidos() {
    this.onGetResultadosObtenidos()
    this.ResultadosObtenidos.reset()
    this.ResultadoObtenidoStatus = false;

  }

  onSubmitResultadosObtenidos() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.ResultadosObtenidos.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._pull_offService.postResultadosObtenidos(data).subscribe((res) => {

        this.onGetResultadosObtenidos()
        this.ResultadosObtenidos.reset()
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

  onEditarResultadosObtenidos() {
    if (this.ResultadosObtenidos.value.actividad == '') {

    } else {
      this._pull_offService.putResultadosObtenidos(this.ResultadosObtenidos.value, this.ResultadoObtenidoId).subscribe((res) => {
        this.ResultadosObtenidos.reset()
        this.onGetResultadosObtenidos()
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


  /* OBSERVACIONES */

  onGetObservaciones() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._pull_offService.getObservaciones(orden_id, informe_id).subscribe((res: any) => {

        this.ObservacionesId = res.body._id

        this.Observaciones.patchValue(res.body)

        this.ObservacionesBtnSave = false

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.NormasStatus = false
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

  onSubmitObservaciones() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Observaciones.value,
        orden_id: orden_id,
        informe_id: informe_id
      }


      this._pull_offService.postObservaciones(data).subscribe((res) => {

        this.onGetObservaciones()
        this.Observaciones.reset();

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

  onEditarObservaciones() {
    if (this.Observaciones.value.actividad == '') {

    } else {
      this._pull_offService.putObservaciones(this.Observaciones.value, this.ObservacionesId).subscribe((res) => {
        this.Observaciones.reset()
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


     const data = {

        orden_id,
        informe_id,
        title :this.RegistroFotosForm.get('title')?.value
      }

      this._pull_offService.postRegistroFotos(data, this.fileRegistroFotos).subscribe((res) => {
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

      this._pull_offService.getRegistroFotografico(orden_id, informe_id).subscribe((res: any) => {

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

  deleteRegistroFoto(id: any) {


    Swal.fire({

      title: "¿Está seguro de eliminar el registro fotográfico?",
      text: "¡Si no lo está puede cancelar la acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar registro fotográfico!'

    }).then((result) => {

      if (result.value) {

        this._pull_offService.deleteRegistroFoto(id).subscribe((res: any) => {

            Swal.fire({
              title: '¡El registro fotográfico se ha eliminado correctamente!',
              icon: 'success',
              confirmButtonText: 'Cerrar',
            });
            this.onGetRegistroFotos();

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

  showLightboxRegistroFotos(index: any) {


    this.selectedImageIndexRegistroFotos = index;
    this.showFlagRegistroFotos = true;
  }

  closeEventHandlerRegistroFotos() {
    this.showFlagRegistroFotos = false;
    this.selectedImageIndexRegistroFotos = -1;
  }

  getFirmaElaboro() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._pull_offService.getFirmaElboro(orden_id, informe_id).subscribe((res: any) => {
        this.firmaElaboroImg = res.body[0].firma
        this.firmaElaboroStatus = true

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

      this._pull_offService.getFirmaReviso(orden_id, informe_id).subscribe((res: any) => {
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

            this._pull_offService.postFirmaElaboro(data).subscribe((res: any) => {
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

            this._pull_offService.postFirmaReviso(data).subscribe((res: any) => {
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

}
