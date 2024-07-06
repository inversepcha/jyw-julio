export class NuevoSubProyecto {
    
    constructor(
        public nombre : string,
        public descripcion : string,
        public proyecto_id : string
    ){}

}

export class EditSubProyecto {

    constructor(
        public id : string,
        public nombre : string,
        public descripcion : string,
        public proyecto_id : string
    ){}

}