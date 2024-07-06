export class NuevoUsuario {

    constructor(

        public nombre_usuario : string,
        public usuario : string,
        public password: string,
        public perfil : string,
        public image : string

    ){}

}


export class EditarUsuario {

    constructor(
        public id : string,
        public nombre_usuario : string,
        public usuario : string,
        public password: string,
        public perfil : string,
        public image : string

    ){}

}


