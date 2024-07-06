import { Component, ElementRef, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';


import { InformesRutasService } from "../../service/rutas-informes/informes-rutas.service";
import { OrdenesService } from "../../service/ordenes/ordenes.service";
import { LiquidosPenetrantesService } from 'src/app/service/liquidos_penetrantes/liquidos-penetrantes.service';
import { environment } from "../../../environments/environment";


import Swal from 'sweetalert2';

@Component({
  selector: 'app-liquidos-penetrantes',
  templateUrl: './liquidos-penetrantes.component.html',
  styleUrls: ['./liquidos-penetrantes.component.css']
})
export class LiquidosPenetrantesComponent implements OnInit {

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
  Materiales_Utilizados!: FormGroup;
  Normas_ProcessModel!: FormGroup;
  Parametros_operacion!: FormGroup;
  ElementosInspeccionados!: FormGroup;
  Interpretacion_evaluacion!: FormGroup;
  Observaciones!: FormGroup;

  NormasId: any
  NormasBtnSave: boolean = true
  NormasStatus: boolean = false;

  MaterialesUtilizadosStatus: boolean = false;
  MaterialesUtilizadosId: any
  MaterialesUtilizados: any = []


  NormasProceId: any
  NormasProceBtnSave: boolean = true
  NormasProceStatus: boolean = false;


  ParametrosOpStatus: boolean = false;
  ParametrosOpId: any
  ParametrosOp: any = []


  ElementosInspeccionadosId: any
  ElementosInspeccionadosBtnSave: boolean = true
  ElementosInspeccionadosStatus: boolean = false;


  InterpretacionEvaluacionStatus: boolean = false;
  InterpretacionEvaluacionId: any
  InterpretacionEvaluacion: any = []


  ObservacionesId: any
  ObservacionesBtnSave: boolean = true
  ObservacionesStatus: boolean = false;

  autoSaveIndex: any
  statusAutoSave: any

    //REGISTRO FOTOGRAFICOS

    imgSelectedRegistroFotos: any;
    fileRegistroFotos!: File;
    RegistroFotos: any = []
    showFlagRegistroFotos: boolean = false;
    selectedImageIndexRegistroFotos: number = -1;
    currentIndexRegistroFotos: any
    imageObjectRegistroFotos: Array<object> = []
    RegistroFotosForm!: FormGroup


    ResultadosStatus: boolean = false;


  constructor(
    private _formBuilder: FormBuilder, private _route: Router,
    private _activatedRoute: ActivatedRoute, private _ordenesService: OrdenesService,
    private _liquidos_penetrantes: LiquidosPenetrantesService,
    private _informesRutasService: InformesRutasService
  ) {

    this.url = environment.url;
  }

  ngOnInit(): void {
    this.forms()
    this.onGetDetallesOrden()
    this.onGet()
  }

  forms() {
    this.Normas = this._formBuilder.group({
      norma: ['', [Validators.required]],
      procedimiento: ['', [Validators.required]],
      esp_material_base: ['', [Validators.required]],
      process_soldadura: ['', [Validators.required]],
      equipos_utilizados: ['', [Validators.required]]
    });
    this.Materiales_Utilizados = this._formBuilder.group({
      detalles: ['', [Validators.required]],
      fabricante: ['', [Validators.required]],
      ref_comercial: ['', [Validators.required]],
      lotes_n: ['', [Validators.required]],
    });
    this.Normas_ProcessModel = this._formBuilder.group({
      normas_process: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      metodo: ['', [Validators.required]],
      procedimiento: ['', [Validators.required]]
    });
    this.Parametros_operacion = this._formBuilder.group({
      actividad: ['', [Validators.required]],
      tiempo: ['', [Validators.required]],
      temperatura: ['', [Validators.required]],
      aplicacion: ['', [Validators.required]],
      iluminacion: ['', [Validators.required]]
    });
    this.ElementosInspeccionados = this._formBuilder.group({
      elementos_inspeccionados: ['', [Validators.required, Validators.maxLength(50)]],
    });
    this.Interpretacion_evaluacion = this._formBuilder.group({
      elemento: ['', [Validators.required]],
      indicacion: ['', [Validators.required]],
      calificacion: ['', [Validators.required]],
      observaciones: ['', [Validators.required]]
    });
    this.Observaciones = this._formBuilder.group({
      observaciones: ['', [Validators.required]]
    })

    this.RegistroFotosForm = this._formBuilder.group({
      title: ['', [Validators.required]],
    });

  }

  onGet() {
    this.onGetAutoSave()
    this.onGetDetallesOrden()
    this.onGetNormas()
    this.onGetMaterialesUtilizados()
    this.onGetNormasProcess()
    this.onGetParametrosOp()
    this.onGetInterpretacion()
    this.onGetObservaciones()
    this.onGetRegistroFotos()
    this.onGetElementosInspeccionados()
  }

  onGetAutoSave() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._informesRutasService.getAutoSaveStepper(orden_id, informe_id).subscribe((res) => {

        this.statusAutoSave = true

        this.autoSaveIndex = res.body

        console.log(res.body)

        // this.windowOnloadCanvasElaboro()
        // this.windowOnloadCanvasReviso()

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

      this._liquidos_penetrantes.getDetallesInforme(informe_id).subscribe((res) => {

        this.detallesInforme = res.body[0]

        // console.log(res.body)

        // this.NormasId = res.body._id

      })
    })
  }

  onGetNormas() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._liquidos_penetrantes.getNormasLiquidos(orden_id, informe_id).subscribe((res: any) => {

        this.NormasId = res.body._id

        console.log('normas',res.body)

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

  onSubmitNormas() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Normas.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._liquidos_penetrantes.postNormasLiquidos(data).subscribe((res) => {

        this.onGetNormas()
        this.Normas.reset()
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

  onEditNormas() {

    if (this.NormasId) {
      let data = { ...this.Normas.value }

      // console.log(data)

      this._liquidos_penetrantes.putNormasLiquidos(data, this.NormasId).subscribe((res) => {

        this.onGetNormas()

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

        this._liquidos_penetrantes.postNormasLiquidos(data).subscribe((res) => {

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

  onGetMaterialesUtilizados() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._liquidos_penetrantes.getMaterialesUtilizados(orden_id, informe_id).subscribe((data) => {


        this.MaterialesUtilizados = data.body

        console.log('MaterialesUtilizados', this.MaterialesUtilizados);
      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.MaterialesUtilizadosStatus = false
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

  onClickEditMaterialesUtilizados(data: any) {

    this.MaterialesUtilizadosId = data._id

    this.MaterialesUtilizadosStatus = true
    this.MaterialesUtilizados.splice(data.actividad, 1);
    this.Materiales_Utilizados.patchValue(data)
  }


  cancelarEditMaterialesUtilizados() {
    this.onGetMaterialesUtilizados()
    this.Materiales_Utilizados.reset()
    this.MaterialesUtilizadosStatus = false;

  }

  onSubmitMaterialesUtilizados() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Materiales_Utilizados.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._liquidos_penetrantes.postMaterialesUtilizados(data).subscribe((res) => {

        this.onGetMaterialesUtilizados()
        this.Materiales_Utilizados.reset()
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

  onEditarMaterialesUtilizados() {
    if (this.Materiales_Utilizados.value.actividad == '') {

    } else {
      this._liquidos_penetrantes.putMaterialesUtilizados(this.Materiales_Utilizados.value, this.MaterialesUtilizadosId).subscribe((res: any) => {
        this.Materiales_Utilizados.reset()
        this.onGetMaterialesUtilizados()
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


  onGetNormasProcess() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._liquidos_penetrantes.getNormasProce(orden_id, informe_id).subscribe((res: any) => {

        this.NormasProceId = res.body._id


        console.log('NORMAS PROSSSSS',res.body)
        this.Normas_ProcessModel.patchValue(res.body)

        this.NormasProceBtnSave = false


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

  onSubmitNormasProce() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Normas_ProcessModel.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._liquidos_penetrantes.postNormasProce(data).subscribe((res) => {

        this.onGetNormasProcess()
        this.Normas_ProcessModel.reset()
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

  onEditNormasProce() {

    if (this.NormasProceId) {
      let data = { ...this.Normas_ProcessModel.value }

      // console.log(data)

      this._liquidos_penetrantes.putNormasProces(data, this.NormasProceId).subscribe((res) => {

        this.onGetNormasProcess()

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

        let data = { ...this.Normas_ProcessModel.value, orden_id, informe_id }

        this._liquidos_penetrantes.postNormasProce(data).subscribe((res) => {

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


  onGetParametrosOp() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._liquidos_penetrantes.getParametros(orden_id, informe_id).subscribe((data) => {


        this.ParametrosOp = data.body

        console.log('ok',data.body)
      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.ParametrosOpStatus = false
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

  onClickEditParametrosOp(data: any) {

    this.ParametrosOpId = data._id

    this.ParametrosOpStatus = true
    this.ParametrosOp.splice(data.actividad, 1);
    this.Parametros_operacion.patchValue(data)
  }


  cancelarEditParametrosOp() {
    this.onGetParametrosOp()
    this.Parametros_operacion.reset()
    this.ParametrosOpStatus = false;

  }


  onSubmitParametrosOp() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Parametros_operacion.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._liquidos_penetrantes.postParametros(data).subscribe((res) => {

        this.onGetParametrosOp()
        this.Parametros_operacion.reset()
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

  onEditarParametrosOp() {
    if (this.Parametros_operacion.value.actividad == '') {

    } else {
      this._liquidos_penetrantes.putParametros(this.Parametros_operacion.value, this.ParametrosOpId).subscribe((res: any) => {
        this.Parametros_operacion.reset()
        this.onGetParametrosOp()
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

      this._liquidos_penetrantes.getElementosInspeccionados(orden_id, informe_id).subscribe((res: any) => {

        this.ElementosInspeccionadosId = res.body._id

        this.ElementosInspeccionados.patchValue(res.body)

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
        ...this.ElementosInspeccionados.value,
        orden_id: orden_id,
        informe_id: informe_id
      }


      this._liquidos_penetrantes.postElementosInspeccionados(data).subscribe((res) => {

        this.onGetElementosInspeccionados()
        this.ElementosInspeccionados.reset();

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
    if (this.ElementosInspeccionados.value.actividad == '') {

    } else {
      this._liquidos_penetrantes.putElementosInspeccionados(this.ElementosInspeccionados.value, this.ElementosInspeccionadosId).subscribe((res) => {
        this.ElementosInspeccionados.reset()
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


  onGetInterpretacion() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._liquidos_penetrantes.getInterpretacion(orden_id, informe_id).subscribe((data) => {


        this.InterpretacionEvaluacion = data.body

      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.InterpretacionEvaluacionStatus = false
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

  onClickEditInterpretacionEvaluacion(data: any) {

    this.InterpretacionEvaluacionId = data._id

    this.InterpretacionEvaluacionStatus = true
    this.InterpretacionEvaluacion.splice(data.actividad, 1);
    this.Interpretacion_evaluacion.patchValue(data)
  }


  cancelarEditInterpretacion() {
    this.onGetInterpretacion()
    this.Interpretacion_evaluacion.reset()
    this.InterpretacionEvaluacionStatus = false;

  }

  onSubmitInterpretacion() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Interpretacion_evaluacion.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._liquidos_penetrantes.postInterpretacion(data).subscribe((res) => {

        this.onGetInterpretacion()
        this.Interpretacion_evaluacion.reset()
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

  onEditarInterpretacion() {
    if (this.Interpretacion_evaluacion.value.actividad == '') {

    } else {
      this._liquidos_penetrantes.putInterpretacion(this.Interpretacion_evaluacion.value, this.InterpretacionEvaluacionId).subscribe((res: any) => {
        this.Interpretacion_evaluacion.reset()
        this.onGetInterpretacion()
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


  onGetObservaciones() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._liquidos_penetrantes.getObservaciones(orden_id, informe_id).subscribe((res: any) => {

        this.ObservacionesId = res.body._id

        this.Observaciones.patchValue(res.body)

        console.log('ob',res)

        this.ObservacionesStatus = false


      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.ObservacionesStatus = false
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


      this._liquidos_penetrantes.postObservaciones(data).subscribe((res) => {

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
      this._liquidos_penetrantes.putObservaciones(this.Observaciones.value, this.ObservacionesId).subscribe((res) => {
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

        const title = this.RegistroFotosForm.get('title')!.value

        const data = {

          orden_id,
          informe_id,
          title

        }

        this._liquidos_penetrantes.postRegistroFotos(data, this.fileRegistroFotos).subscribe((res) => {
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

        this._liquidos_penetrantes.getRegistroFotografico(orden_id, informe_id).subscribe((res: any) => {

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
              this.ResultadosStatus = false
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

}
