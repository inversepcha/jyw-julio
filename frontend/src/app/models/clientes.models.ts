export class NuevoCliente {

    constructor(

        
        public nombre : string,
        public nit: string,
        public direccion: string,
        public telefono : string,
        public ciudad: string,
        

    ){}

}


export class EditCliente {

    constructor(
        public id : string,
        public nombre : string,
        public nit: string,
        public direccion: string,
        public telefono : string,
        public ciudad: string,

    ){}

}
