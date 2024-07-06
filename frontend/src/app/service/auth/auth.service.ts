import { Injectable } from '@angular/core';
import { Router } from '@angular/router'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public identity: any;
  public token: any;

  constructor(private _router: Router) { }

  loggedIn() {
    return !!localStorage.getItem('token');
  }


  getIdentity() {
    let identity = JSON.parse(localStorage.getItem('identity') as string);

    if (identity != "undefined") {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;

  }

  getToken() {
    let token = localStorage.getItem('token');
    if (token != "undefined") {
      this.token = token;
    } else {
      this.token = null
    }
    return this.token;
  }


}
