export class NuevoProyecto {

    constructor(
        public nombre_proyecto : string,
        public descripcion: string, 
        public cliente_id: string,
        public ubicacion: string,       
    ){}

}


export class EditProyecto {

    constructor(
        public id:string,
        public nombre_proyecto : string,
        public descripcion: string, 
        public cliente_id: string,
        public ubicacion: string,       
    ){}

}
