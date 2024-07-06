export class NuevaOrden {

    constructor(
        public proyecto_id : string,
        public subproyecto_id: string,
        public fecha_visita: Date,
        public lugar_visita: string,
        public orden_consecutivo : string

    ){}

}


export class EditarOrden {

    constructor(
        public id: string,
        public proyecto_id : string,
        public subProyecto_id: string,
        public fecha_visita: Date,
        public lugar_visita: string,
        public orden_consecutivo : number

    ){}

}

export class AddUsuario {
    constructor(
        public orden_id: string,
        public usuario_id : string,
        public fecha_inicial: string,
        public fecha_final: string
    ){}
}

export class AddImplemento {
    constructor(
        public orden_id: string,
        public implemento_id : string
    ){}
}
