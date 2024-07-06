import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps'
import { DataTablesModule } from 'angular-datatables'
import { NgSelect2Module } from 'ng-select2';
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
import { MaterialModule } from "./MaterialModule";
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view'
import { SplashScreenModule } from "./service/splash-screen/splash-screen.module";
import { QuillModule } from "ngx-quill";
import { RouterModule } from '@angular/router';
import { SAVER, getSaver } from '../app/service/saver.provider'
registerLocaleData(localeEs, "es");


//SERVICE
import { UsuariosService } from './service/usuarios/usuarios.service';
import { AuthService } from './service/auth/auth.service'

//INTERCEPTOR
import { InjectSessionInterceptor } from './core/interceptors/inject-session.interceptor';

//COMPONENTS
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ImplementosComponent } from './components/implementos/implementos.component';
import { TipoImplentosComponent } from './components/tipo-implentos/tipo-implentos.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { SubProyectosComponent } from './components/sub-proyectos/sub-proyectos.component';
import { OrdenesComponent } from './components/ordenes/ordenes.component';


import { InformesComponent } from './components/informes/informes.component';
import { InformesOrdenesComponent } from './components/informes-ordenes/informes-ordenes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VtPinturaComponent } from './components/vt-pintura/vt-pintura.component';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from './my-date-formats';
import { PullOffComponent } from './components/pull-off/pull-off.component';
import { AdherenciaComponent } from './components/adherencia/adherencia.component';
import { LiquidosPenetrantesComponent } from './components/liquidos-penetrantes/liquidos-penetrantes.component';
import { ParticulasMagneticasComponent } from './components/particulas-magneticas/particulas-magneticas.component';
import { OpcionesInformesComponent } from './components/opciones-informes/opciones-informes.component';
import { UltrasonidoComponent } from './components/ultrasonido/ultrasonido.component';

@NgModule({
  declarations: [AppComponent, UsuariosComponent, ClientesComponent, ImplementosComponent, TipoImplentosComponent, ProyectosComponent, SubProyectosComponent, OrdenesComponent, InformesComponent, InformesOrdenesComponent, VtPinturaComponent, PullOffComponent, AdherenciaComponent, LiquidosPenetrantesComponent, ParticulasMagneticasComponent, OpcionesInformesComponent, UltrasonidoComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, GoogleMapsModule, DataTablesModule.forRoot(), NgSelect2Module, BrowserAnimationsModule, MaterialModule, ReactiveFormsModule, NgImageFullscreenViewModule, SplashScreenModule,   QuillModule.forRoot()],
  providers: [
    UsuariosService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InjectSessionInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'es'
    },
    {provide: SAVER, useFactory: getSaver}

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
