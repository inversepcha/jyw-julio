import { Component, ElementRef, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';


import { InformesRutasService } from "../../service/rutas-informes/informes-rutas.service";
import { OrdenesService } from "../../service/ordenes/ordenes.service";
import { ParticulasMagneticasService } from 'src/app/service/particulas_magneticas/particulas-magneticas.service';
import { environment } from "../../../environments/environment";


import Swal from 'sweetalert2';

@Component({
  selector: 'app-particulas-magneticas',
  templateUrl: './particulas-magneticas.component.html',
  styleUrls: ['./particulas-magneticas.component.css']
})
export class ParticulasMagneticasComponent implements OnInit {

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
  Normas_Proce!: FormGroup;
  Parametros_operacion!: FormGroup;
  Proceso!: FormGroup;
  ElementosInspeccionados!: FormGroup;
  Resultados!: FormGroup;
  Observaciones!: FormGroup;

  NormasId: any
  NormasBtnSave: boolean = true
  NormasStatus: boolean = false;
  implementosUtilizados: any = []

  MaterialesUtilizadosStatus: boolean = false;
  MaterialesUtilizadosId: any
  MaterialesUtilizados: any = []

  NormasProceId: any
  NormasProceBtnSave: boolean = true
  NormasProceStatus: boolean = false;


  ParametrosOpStatus: boolean = false;
  ParametrosOpId: any
  ParametrosOp: any = []

  ProcesoId: any
  ProcesoBtnSave: boolean = true
  ProcesoStatus: boolean = false;

  ElementosInspeccionadosId: any
  ElementosInspeccionadosBtnSave: boolean = true
  ElementosInspeccionadosStatus: boolean = false;

  ResultadosStatus: boolean = false;
  ResultadosId: any
  Resultado: any = []

  ObservacionesId: any
  ObservacionesBtnSave: boolean = true
  ObservacionesStatus: boolean = false;


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


  autoSaveIndex: any
  statusAutoSave: any

  constructor(
    private _formBuilder: FormBuilder, private _route: Router,
    private _activatedRoute: ActivatedRoute, private _ordenesService: OrdenesService,
    private _particulasMagneticas: ParticulasMagneticasService,
    private _informesRutasService: InformesRutasService
  ) {

    this.url = environment.url;
  }

  ngOnInit(): void {
    this.onGetDetallesOrden()
    this.forms()
    this.onGet()
  }


  onGet(){
    this.onGetNormas()
    this.onGetImplementos()
    this.onGetMaterialesUtilizados()
    this.onGetNormasProcess()
  }

  forms() {
    this.Normas = this._formBuilder.group({
      norma: ['', [Validators.required]],
      equipos_utilizados: ['', [Validators.required]]
    });
    this.Materiales_Utilizados = this._formBuilder.group({
      detalles: ['', [Validators.required]],
      fabricante: ['', [Validators.required]],
      ref_comercial: ['', [Validators.required]],
      lotes_n: ['', [Validators.required]],
    });
    this.Normas_Proce = this._formBuilder.group({
      normas_process: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      metodo: ['', [Validators.required]],
      procedimiento: ['', [Validators.required]]
    });
    this.Parametros_operacion = this._formBuilder.group({
      actividad: ['', [Validators.required]],
      distancia: ['', [Validators.required]],
      aplicacion: ['', [Validators.required]],
      iluminacion: ['', [Validators.required]]
    });
    this.Proceso = this._formBuilder.group({
      proceso_magnetizacion: ['', [Validators.required]],
      corriente_magnetizacion: ['', [Validators.required]],
    });
    this.ElementosInspeccionados = this._formBuilder.group({
      elemento_inspeccionado: ['', [Validators.required]]
    });
    this.Resultados = this._formBuilder.group({
      elemento: ['', [Validators.required]],
      indicacion: ['', [Validators.required]],
      calificacion: ['', [Validators.required]],
      observaciones: ['', [Validators.required]]
    });
    this.Observaciones = this._formBuilder.group({
      observaciones: ['', [Validators.required]],
    });
    this.RegistroFotosForm = this._formBuilder.group({
      title: ['', [Validators.required]],
    });
  }

  onGetAutoSave() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._informesRutasService.getAutoSaveStepper(orden_id, informe_id).subscribe((res) => {

        this.statusAutoSave = true

        this.autoSaveIndex = res.body

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

      this._particulasMagneticas.getDetallesInforme(informe_id).subscribe((res) => {

        this.detallesInforme = res.body[0]

        // console.log(res.body)

        // this.NormasId = res.body._id

      })
    })
  }


  onGetImplementos() {
    this._activatedRoute.params.subscribe(params => {
      const orden_id = params['orden_id'];

      this._ordenesService.getImplementosOrdenes(orden_id).subscribe((res) => {

        this.implementosUtilizados = res.body
      })

    })
  }



  onGetNormas() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._particulasMagneticas.getNormasParticulas(orden_id, informe_id).subscribe((res: any) => {

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

  onSubmitNormas() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Normas.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._particulasMagneticas.postNormasParticulas(data).subscribe((res) => {

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

      this._particulasMagneticas.putNormasParticulas(data, this.NormasId).subscribe((res) => {

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

        this._particulasMagneticas.postNormasParticulas(data).subscribe((res) => {

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

      this._particulasMagneticas.getMaterialesUtilizados(orden_id, informe_id).subscribe((data) => {


        this.MaterialesUtilizados = data.body

        console.log(this.MaterialesUtilizados);
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

      this._particulasMagneticas.postMaterialesUtilizados(data).subscribe((res) => {

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
      this._particulasMagneticas.putMaterialesUtilizados(this.Materiales_Utilizados.value, this.MaterialesUtilizadosId).subscribe((res: any) => {
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

      this._particulasMagneticas.getNormasProce(orden_id, informe_id).subscribe((res: any) => {

        this.NormasProceId = res.body._id

        this.Normas_Proce.patchValue(res.body)

        this.NormasProceBtnSave = false


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

  onSubmitNormasProce() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Normas_Proce.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._particulasMagneticas.postNormasProce(data).subscribe((res) => {

        this.onGetNormasProcess()
        this.Normas_Proce.reset()
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
      let data = { ...this.Normas_Proce.value }

      // console.log(data)

      this._particulasMagneticas.putNormasProces(data, this.NormasProceId).subscribe((res) => {

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

        let data = { ...this.Normas_Proce.value, orden_id, informe_id }

        this._particulasMagneticas.postNormasProce(data).subscribe((res) => {

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

      this._particulasMagneticas.getParametros(orden_id, informe_id).subscribe((data) => {


        this.ParametrosOp = data.body

        console.log(this.ParametrosOp);
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

      this._particulasMagneticas.postParametros(data).subscribe((res) => {

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
      this._particulasMagneticas.putParametros(this.Parametros_operacion.value, this.ParametrosOpId).subscribe((res: any) => {
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


  onGetProceso() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._particulasMagneticas.getProcedimiento(orden_id, informe_id).subscribe((res: any) => {

        this.ProcesoId = res.body._id

        this.Proceso.patchValue(res.body)

        this.ProcesoBtnSave = false


      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {
            this.ProcesoStatus = false
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

  onSubmitProceso() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Proceso.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._particulasMagneticas.postProcedimiento(data).subscribe((res) => {

        this.onGetProceso()
        this.Proceso.reset()
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

  onEditProceso() {

    if (this.ProcesoId) {
      let data = { ...this.Proceso.value }

      // console.log(data)

      this._particulasMagneticas.putProcedimiento(data, this.ProcesoId).subscribe((res) => {

        this.onGetProceso()

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

        let data = { ...this.Normas_Proce.value, orden_id, informe_id }

        this._particulasMagneticas.postProcedimiento(data).subscribe((res) => {

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


  onGetElementosInspeccionados() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._particulasMagneticas.getElementosInspeccionados(orden_id, informe_id).subscribe((res: any) => {

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


      this._particulasMagneticas.postElementosInspeccionados(data).subscribe((res) => {

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
      this._particulasMagneticas.putElementosInspeccionados(this.ElementosInspeccionados.value, this.ElementosInspeccionadosId).subscribe((res) => {
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


  onGetResultados() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._particulasMagneticas.getResultados(orden_id, informe_id).subscribe((data) => {


        this.Resultado = data.body

        console.log(this.Resultado);
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

  onClickEditResultados(data: any) {

    this.ResultadosId = data._id

    this.ResultadosStatus = true
    this.Resultado.splice(data.actividad, 1);
    this.Resultados.patchValue(data)
  }


  cancelarEditResultados() {
    this.onGetResultados()
    this.Resultados.reset()
    this.ResultadosStatus= false;

  }

  onSubmitResultados() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Resultados.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._particulasMagneticas.postResultados(data).subscribe((res) => {

        this.onGetResultados()
        this.Resultados.reset()
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

  onEditarResultados() {
    if (this.Resultados.value.actividad == '') {

    } else {
      this._particulasMagneticas.putResultados(this.Resultados.value, this.ResultadosId).subscribe((res: any) => {
        this.Resultados.reset()
        this.onGetResultados()
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

      this._particulasMagneticas.getObservaciones(orden_id, informe_id).subscribe((res: any) => {

        this.ObservacionesId = res.body._id

        this.Observaciones.patchValue(res.body)

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


      this._particulasMagneticas.postObservaciones(data).subscribe((res) => {

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
      this._particulasMagneticas.putObservaciones(this.Observaciones.value, this.ObservacionesId).subscribe((res) => {
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

      this._particulasMagneticas.postRegistroFotos(data, this.fileRegistroFotos).subscribe((res) => {
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

      this._particulasMagneticas.getRegistroFotografico(orden_id, informe_id).subscribe((res: any) => {

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

  //FIRMAS

  getFirmaElaboro() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._particulasMagneticas.getFirmaElboro(orden_id, informe_id).subscribe((res: any) => {
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

      this._particulasMagneticas.getFirmaReviso(orden_id, informe_id).subscribe((res: any) => {
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

            this._particulasMagneticas.postFirmaElaboro(data).subscribe((res: any) => {
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

            this._particulasMagneticas.postFirmaReviso(data).subscribe((res: any) => {
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
