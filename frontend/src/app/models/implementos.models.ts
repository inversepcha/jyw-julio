export class NuevoImplemento {

    constructor(

        public nombre: string,
        public marca: string,
        public tipo_implemento_id: string,
        
    ){}

}

export class EditarImplemento {

    constructor(
        public id : string,
        public nombre: string,
        public marca: string, 
        public tipo_implemento_id: string

    ){}

}