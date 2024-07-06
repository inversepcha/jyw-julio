import { Component, ElementRef, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';


import { InformesRutasService } from "../../service/rutas-informes/informes-rutas.service";
import { OrdenesService } from "../../service/ordenes/ordenes.service";
import { AdherenciaService } from 'src/app/service/adherencia/adherencia.service';
import { environment } from "../../../environments/environment";


import Swal from 'sweetalert2';

@Component({
  selector: 'app-adherencia',
  templateUrl: './adherencia.component.html',
  styleUrls: ['./adherencia.component.css']
})
export class AdherenciaComponent implements OnInit {

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
  Procedimiento!: FormGroup;
  Sistema_pintura!: FormGroup;
  Condiciones_climatologicas! : FormGroup;
  ElementosInspeccionados!: FormGroup;

  NormasId: any
  NormasBtnSave: boolean = true
  NormasStatus: boolean = false;

  ProcedimientoId: any
  ProcedimientoBtnSave: boolean = true
  ProcedimientoStatus: boolean = false;

  SistemaPinturaStatus: boolean = false;
  SistemaPinturaId: any
  SistemaPintura: any = []


  CondicionesCId: any
  CondicionesCBtnSave: boolean = true
  CondicionesCStatus: boolean = false;


  ElementosInspeccionadosId: any
  ElementosInspeccionadosBtnSave: boolean = true
  ElementosInspeccionadosStatus: boolean = false;


  autoSaveIndex: any
  statusAutoSave: any

  imgSelectedRegistroFotos: any;
  fileRegistroFotos!: File;
  RegistroFotos: any = []
  showFlagRegistroFotos: boolean = false;
  selectedImageIndexRegistroFotos: number = -1;
  currentIndexRegistroFotos: any
  imageObjectRegistroFotosCintas: Array<object> = []
  RegistroFotosCintas!: FormGroup


  constructor(
    private _formBuilder: FormBuilder, private _route: Router,
    private _activatedRoute: ActivatedRoute, private _ordenesService: OrdenesService,
    private _adherencia: AdherenciaService,
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
      convencion_calificacion: ['', [Validators.required]]

    })
    this.Procedimiento = this._formBuilder.group({
      procedimiento: ['', [Validators.required]],
      metodo_ensayo: ['', [Validators.required]],
      equipos_empleados: ['', [Validators.required]],
      sustrato: ['', [Validators.required]],
      metodo_limpieza: ['', [Validators.required]]

    });

    this.Sistema_pintura = this._formBuilder.group({
      operacion: ['', [Validators.required]],
      calificacion: ['', [Validators.required]],
      aplicacion: ['', [Validators.required]],
      espesor: ['', [Validators.required]],
      tiempo_curado: ['', [Validators.required]]

    });
    this.Condiciones_climatologicas = this._formBuilder.group({
      temp_ambiental: ['', [Validators.required]],
      temp_substrato: ['', [Validators.required]],
      humedad_relativa: ['', [Validators.required]],
      punto_rocio: ['', [Validators.required]]

    });
    this.ElementosInspeccionados = this._formBuilder.group({
      elementos_inspeccionados: ['', [Validators.required, Validators.maxLength(50)]],
    });
    this.RegistroFotosCintas = this._formBuilder.group({
      n_cinta: ['', [Validators.required]],
      elemento: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      recubrimiento: ['', [Validators.required]],
      espesor: ['', [Validators.required]],
      resultado: ['', [Validators.required]],
      tipo_falla: ['', [Validators.required]],
      image : ['', [Validators.required]]
    });

  }

  onGet() {
    this.onGetAutoSave()
    this.onGetDetallesOrden()
    this.onGetNormaAdherencia()
    this.onGetProcedimiento()
    this.onGetSistemaPintura()
    this.onGetCondicionesClimatologicas()
    this.onGetElementosInspeccionados()
    this.onGetRegistroFotos()
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

      this._adherencia.getDetallesInforme(informe_id).subscribe((res) => {

        this.detallesInforme = res.body[0]

        // console.log(res.body)

        // this.NormasId = res.body._id

      })
    })
  }

  onGetNormaAdherencia() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._adherencia.getNormaAdherencia(orden_id, informe_id).subscribe((res: any) => {

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

  onSubmitNorma() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Normas.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._adherencia.postNormaAdherencia(data).subscribe((res) => {

        this.onGetProcedimiento()
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

      this._adherencia.putNormaAdherencia(data, this.NormasId).subscribe((res) => {

        this.onGetNormaAdherencia()

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

        this._adherencia.postNormaAdherencia(data).subscribe((res) => {

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
        ...this.Procedimiento.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._adherencia.postProcedimiento(data).subscribe((res) => {

        this.onGetProcedimiento()
        this.Procedimiento.reset()
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
      let data = { ...this.Procedimiento.value }

      console.log(data, "datos editar")

      this._adherencia.putProcedimiento(data, this.ProcedimientoId).subscribe((res) => {

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

        this._adherencia.postProcedimiento(data).subscribe((res) => {

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

      this._adherencia.getProcedimiento(orden_id, informe_id).subscribe((res: any) => {

        this.ProcedimientoId = res.body._id

        this.Procedimiento.patchValue(res.body)

        this.ProcedimientoBtnSave = false

        console.log(this.Procedimiento)


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

      this._adherencia.getSistemaPintura(orden_id, informe_id).subscribe((data) => {


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
    this.Sistema_pintura.patchValue(data)
  }


  cancelarEditSistemaPintura() {
    this.onGetSistemaPintura()
    this.Sistema_pintura.reset()
    this.SistemaPinturaStatus = false;

  }

  onSubmitSistemaPintura() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Sistema_pintura.value,
        orden_id: orden_id,
        informe_id: informe_id
      }

      this._adherencia.postSistemaPintura(data).subscribe((res) => {

        this.onGetSistemaPintura()
        this.Sistema_pintura.reset()
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
    if (this.Sistema_pintura.value.actividad == '') {

    } else {
      this._adherencia.putSistemaPintura(this.Sistema_pintura.value, this.SistemaPinturaId).subscribe((res: any) => {
        this.Sistema_pintura.reset()
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


  onGetCondicionesClimatologicas() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._adherencia.getCondiciones(orden_id, informe_id).subscribe((res: any) => {

        this.CondicionesCId = res.body._id

        this.Condiciones_climatologicas.patchValue(res.body)

        this.CondicionesCBtnSave = false


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

  onSubmitCondicionesClimatologicas() {

    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      let data = {
        ...this.Condiciones_climatologicas.value,
        orden_id: orden_id,
        informe_id: informe_id
      }


      this._adherencia.postCondiciones(data).subscribe((res) => {

        this.onGetCondicionesClimatologicas()
        this.Condiciones_climatologicas.reset();

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

  onEditarCondicionesClimatologicas() {
    if (this.Condiciones_climatologicas.value.actividad == '') {

    } else {
      this._adherencia.putCondiciones(this.Condiciones_climatologicas.value, this.CondicionesCId).subscribe((res) => {
        this.Condiciones_climatologicas.reset()
        this.onGetCondicionesClimatologicas()

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

      this._adherencia.getElementosInspeccionados(orden_id, informe_id).subscribe((res: any) => {

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


      this._adherencia.postElementosInspeccionados(data).subscribe((res) => {

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
      this._adherencia.putElementosInspeccionados(this.ElementosInspeccionados.value, this.ElementosInspeccionadosId).subscribe((res) => {
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
        ...this.RegistroFotosCintas.value
      }

      this._adherencia.postCintas(data, this.fileRegistroFotos).subscribe((res) => {
        this.onGetRegistroFotos();
        this.RegistroFotosCintas.reset();
        this.myInputVariableRegistroFotos.nativeElement.value = "";

        console.log(data)
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

      this._adherencia.getCintas(orden_id, informe_id).subscribe((res: any) => {

        this.RegistroFotos = res.body

        res.body.map((item: any) => {

          const data = { image: `${this.url}/img-uploads/${item.image}`, title: item.title }

          this.imageObjectRegistroFotosCintas.push(data)
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

        this._adherencia.deleteCintas(id).subscribe((res: any) => {

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
}
