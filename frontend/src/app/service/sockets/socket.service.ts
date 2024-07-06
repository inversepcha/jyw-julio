import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public url: any;
  public socket: any;
  public token: any;

  constructor() {
    this.url = environment.url;
    this.token = localStorage.getItem('token');
  }


  setupSocketConnection() {
    return io(this.url, {
      transports: ['websocket'],
      timeout: 30000,
      auth: {
        token: this.token,
      },
    });
  }

  socketEvent(eventName: any) {
    let observable = new Observable(observer => {
      this.setupSocketConnection().on(eventName , (data :any) => { 
        observer.next(data);    
      }); 
    })     
    return observable;
  } 
}
