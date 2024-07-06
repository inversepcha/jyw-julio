import { Component, ElementRef, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { InformesRutasService } from "../../service/rutas-informes/informes-rutas.service";
import { OrdenesService } from "../../service/ordenes/ordenes.service";
import { UltrasonidoService } from 'src/app/service/ultrasonido/ultrasonido.service';
import { environment } from "../../../environments/environment";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-ultrasonido',
  templateUrl: './ultrasonido.component.html',
  styleUrls: ['./ultrasonido.component.css']
})
export class UltrasonidoComponent implements OnInit {
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

  ultrasonidoId: any

  isLinear = false;
  Normas!: FormGroup;
  Juntas!: FormGroup;
  ElementosInspeccionados!: FormGroup;
  Equipo_Utilizado!: FormGroup;
  Palpador!: FormGroup;
  Soldadura!: FormGroup;
  Materiales!: FormGroup;
  descripcion!: FormGroup
  descripcionItem!: FormGroup
  observaciones!: FormGroup

  descripcionItemArray: any = []

  descripcionArray: any = []

  //firmas
  canvas: any
  firmaRevisaImg: String = ''
  firmaRevisoStatus: boolean = false


  firmaElaboroImg: String = '';
  firmaElaboroStatus: boolean = false


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



  constructor(
    private _formBuilder: FormBuilder, private _route: Router,
    private _activatedRoute: ActivatedRoute, private _ordenesService: OrdenesService,
    private _ultrasonidoService: UltrasonidoService,
    private _informesRutasService: InformesRutasService
  ) {

    this.url = environment.url;
  }

  ngOnInit(): void {
    this.onGetAutoSave()
    this.onGetDetallesOrden();
    this.onGetUltrasonido();
    this.forms()
  }

  forms() {
    this.Normas = this._formBuilder.group({
      criterio_aceptacion: ['', [Validators.required]],
      procedimiento: ['', [Validators.required]]
    });
    this.Juntas = this._formBuilder.group({
      juntas: ['']
    });
    this.ElementosInspeccionados = this._formBuilder.group({
      elementos_inspeccionados: ['']
    });
    this.Equipo_Utilizado = this._formBuilder.group({
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      escala: ['', [Validators.required]],
      grado_calibracion: ['', [Validators.required]],
      cable: ['', [Validators.required]],
      metodo_ensayo: ['', [Validators.required]],
      inspeccion: ['', [Validators.required]]
    });
    this.Palpador = this._formBuilder.group({
      tipo: ['', [Validators.required]],
      angulo: ['', [Validators.required]],
      frecuencia: ['', [Validators.required]],
      dimension: ['', [Validators.required]]
    });
    this.Soldadura = this._formBuilder.group({
      proceso: ['', [Validators.required]],
      paso: ['', [Validators.required]],
      paso_medio: ['', [Validators.required]],
      rango: ['', [Validators.required]]
    });
    this.Materiales = this._formBuilder.group({
      material_base: ['', [Validators.required]],
      espesor_mat_base: ['', [Validators.required]],
      material_aporte: ['', [Validators.required]],
      acoplante: ['', [Validators.required]]
    });
    this.RegistroFotosForm = this._formBuilder.group({
      title: ['', [Validators.required]],
    });
    this.descripcion = this._formBuilder.group({
      elemento: ['', [Validators.required]]
    });
    this.descripcionItem = this._formBuilder.group({
      junta: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      estampe: ['', [Validators.required]],
      decibeles_a: ['', [Validators.required]],
      decibeles_b: ['', [Validators.required]],
      decibeles_c: ['', [Validators.required]],
      decibeles_d: ['', [Validators.required]],
      dist: ['', [Validators.required]],
      prof_mm: ['', [Validators.required]],
      dist_y_mm: ['', [Validators.required]],
      dist_x_mm: ['', [Validators.required]],
      eval: ['', [Validators.required]]
    });

    this.observaciones = this._formBuilder.group({
      observaciones: ['', [Validators.required]]
    })
  }

  onGetAutoSave() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._informesRutasService.getAutoSaveStepper(orden_id, informe_id).subscribe((res) => {

        this.statusAutoSave = true

        this.autoSaveIndex = res.body


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

      this._ultrasonidoService.getDetallesInforme(informe_id).subscribe((res) => {

        this.detallesInforme = res.body[0]

        // console.log(res.body)

        // this.NormasId = res.body._id

      })
    })
  }

  onGetUltrasonido() {
    this._activatedRoute.params.subscribe(params => {
      const { orden_id, informe_id } = params;

      this._ultrasonidoService.getUltrasonido(orden_id, informe_id).subscribe((res: any) => {

        this.ultrasonidoId = res.body._id
        this.Normas.patchValue(res.body.norma)
        this.Juntas.setValue({ juntas: res.body.juntas })
        this.ElementosInspeccionados.setValue({ elementos_inspeccionados: res.body.elementos_inspeccionados })
        this.Equipo_Utilizado.patchValue(res.body.equipos_utilizados)
        this.Palpador.patchValue(res.body.palpador)
        this.Soldadura.patchValue(res.body.soldadura)
        this.Materiales.patchValue(res.body.materiales)
        this.descripcionArray = res.body.descripcion
        this.observaciones.setValue({ observaciones: res.body.observaciones })
        this.RegistroFotos = res.body.registro_foto

        res.body.registro_foto.map((item: any) => {

          const data = { image: `${this.url}/img-uploads/${item.image}`, title: item.title }

          this.imageObjectRegistroFotos.push(data)
        })
      }, error => {

        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = error.error

          if (error.status === 404) {


            this.onPostUltrasonidoInit()


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

  onPostUltrasonidoInit() {

    this._activatedRoute.params.subscribe(params => {
      const data = {
        ...params
      }
      this._ultrasonidoService.postUltrasonidoInit(data).subscribe((data: any) => {
        this.onGetUltrasonido()
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

  onSubmitNormas() {


    let data = {
      ...this.Normas.value,
    }


    this._ultrasonidoService.postNormaUltrasonido(data, this.ultrasonidoId).subscribe((res) => {

      this.onGetUltrasonido()
      this.Normas.reset();

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

  onSubmitJuntas() {

    let data = {
      ...this.Juntas.value,
    }

    this._ultrasonidoService.postJunta(data, this.ultrasonidoId).subscribe((res) => {

      this.onGetUltrasonido()

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

  onSubmitElementosInspeccionados() {

    let data = {
      ...this.ElementosInspeccionados.value,
    }


    this._ultrasonidoService.postElementosInspeccionados(data, this.ultrasonidoId).subscribe((res) => {

      this.onGetUltrasonido()

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

  onSubmitEquipoUtilizado() {

    let data = {
      ...this.Equipo_Utilizado.value,
    }

    this._ultrasonidoService.postEquipoUtilizado(data, this.ultrasonidoId).subscribe((res) => {
      this.onGetUltrasonido()
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

  onSubmitPalpador() {

    let data = {
      ...this.Palpador.value,
    }

    this._ultrasonidoService.postPalpador(data, this.ultrasonidoId).subscribe((res) => {

      this.onGetUltrasonido()
      this.Palpador.reset()
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


  onSubmitSoldadura() {

    let data = {
      ...this.Soldadura.value
    }

    this._ultrasonidoService.postSoldadura(data, this.ultrasonidoId).subscribe((res) => {
      this.onGetUltrasonido()
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


  onSubmitMateriales() {

    let data = {
      ...this.Materiales.value,
    }

    this._ultrasonidoService.postMateriales(data, this.ultrasonidoId).subscribe((res) => {

      this.onGetUltrasonido()
      this.Materiales.reset()
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


  addItem() {
    this.descripcionItemArray.push(this.descripcionItem.value)
    this.descripcionItem.reset()
    console.log(this.descripcionItemArray)
  }

  onSubmitDescripcion() {

    let data = {
      ...this.descripcion.value,
      items: this.descripcionItemArray
    }

    this._ultrasonidoService.postDescripcion(data, this.ultrasonidoId).subscribe((res) => {
      this.onGetUltrasonido()
      this.descripcion.reset()
      this.descripcionItem.reset()
      this.descripcionItemArray = []
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


  onSubmitObservaciones() {

    let data = {
      ...this.observaciones.value,
    }


    this._ultrasonidoService.postObservaciones(data, this.ultrasonidoId).subscribe((res) => {

      this.onGetUltrasonido()

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


    const data = {
      title: this.RegistroFotosForm.get('title')?.value
    }

    this._ultrasonidoService.postRegistroFotos(data, this.fileRegistroFotos, this.ultrasonidoId).subscribe((res) => {
      this.onGetUltrasonido();
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

        this._ultrasonidoService.deleteRegistroFoto(id).subscribe((res: any) => {

          Swal.fire({
            title: '¡El registro fotográfico se ha eliminado correctamente!',
            icon: 'success',
            confirmButtonText: 'Cerrar',
          });
          this.onGetUltrasonido();

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
      }
    })


  }

  showLightboxRegistroFotos(index: any) {
    console.log(index)
    this.selectedImageIndexRegistroFotos = index;
    this.showFlagRegistroFotos = true;
  }

  closeEventHandlerRegistroFotos() {
    this.showFlagRegistroFotos = false;
    this.selectedImageIndexRegistroFotos = -1;
  }



  /*  getFirmaElaboro() {
     this._activatedRoute.params.subscribe(params => {
       const { orden_id, informe_id } = params;

       this._ultrasonidoService.getFirmaElboro(orden_id, informe_id).subscribe((res: any) => {
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

       this._ultrasonidoService.getFirmaReviso(orden_id, informe_id).subscribe((res: any) => {
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
   } */



}
