import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'

@Injectable()
export class InjectSessionInterceptor implements HttpInterceptor {

  constructor(
    private _router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    try {

      let newRequest = request

      const token = localStorage.getItem('token');

      if (token != "undefined") {

          newRequest = request.clone(
            {
              setHeaders: {
                Authorization: `${token}`
              }
            }
          )




        return next.handle(newRequest).map(event => {

          if (event instanceof HttpErrorResponse) {
            if (event['status'] === 403) {
              localStorage.removeItem('token');
              localStorage.clear();
              this._router.navigate(['/']);
            }
          }

          return event;
        })

      } else {
        localStorage.removeItem('token');
        localStorage.clear();
        this._router.navigate(['/']);
        return next.handle(request);
      }



      // let newRequest = request
      // newRequest = request.clone(
      //   {
      //     setHeaders: {
      //       Authorization: `${token}`,
      //       'Content-Type': 'application/json',
      //     }
      //   }
      // )



    } catch (e) {
      console.log('error', e)
      return next.handle(request);
    }
  }
}
