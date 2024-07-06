import { Component, OnInit, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { environment } from "../environments/environment";

//SERVICE
import { AuthService } from './service/auth/auth.service';
import { UsuariosService } from './service/usuarios/usuarios.service';
import { SocketService } from "./service/sockets/socket.service";

declare let $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SocketService]
})

export class AppComponent implements OnInit {
  title = 'jyw';

  public token: any
  public identity: any
  public errorMessage: any
  public socket: any;
  public url: any


  user = {
    usuario: '',
    password: '',
  };

  constructor(
    private _usuariosService: UsuariosService,
    private _route: ActivatedRoute,
    private _router: Router,
    public authService: AuthService,
    private _socketService: SocketService
  ) {
    this.token = localStorage.getItem('token');
    this.url = environment.url
  }

  onClickMenu() {
    let menutoggle = document.querySelector(".toggle");
    let navigation = document.querySelector(".navigation");

    menutoggle!.classList.toggle("actived");
    navigation!.classList.toggle("actived");

  }

  ngOnInit() {
    this.identity = this.authService.getIdentity();

  }

  onSubmit() {

    this._usuariosService.login(this.user).subscribe((res) => {
      const { token, usuario } = res.body;

      this.token = token
      this.identity = usuario

      if (usuario.estado === 1) {
        this.errorMessage = 'El usuario aún no esta activado.'
      } else {

        localStorage.setItem('token', token);

        // Crear elemento en el localstorage para tener al usuario sesión

        localStorage.setItem('identity', JSON.stringify(usuario));

        this.errorMessage = null;

        this._router.navigate(['/ordenes'])
        window.location.reload()
      }

    },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var res = error.error;
          this.errorMessage = res.body.message;
        }
      }

    );
  }

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
    $(document.body).removeClass('dark');
  }
}


