import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsuariosComponent } from "./components/usuarios/usuarios.component";
import { ClientesComponent } from './components/clientes/clientes.component'
import { ImplementosComponent } from "./components/implementos/implementos.component";
import { TipoImplentosComponent } from "./components/tipo-implentos/tipo-implentos.component";
import { ProyectosComponent } from "./components/proyectos/proyectos.component";
import { SubProyectosComponent } from "./components/sub-proyectos/sub-proyectos.component";
import { OrdenesComponent } from "./components/ordenes/ordenes.component";
import { InformesComponent } from "./components/informes/informes.component";
import { InformesOrdenesComponent } from "./components/informes-ordenes/informes-ordenes.component";
import { VtPinturaComponent } from "./components/vt-pintura/vt-pintura.component";
import { PullOffComponent } from "./components/pull-off/pull-off.component";
import { AdherenciaComponent } from "./components/adherencia/adherencia.component";
import { LiquidosPenetrantesComponent } from './components/liquidos-penetrantes/liquidos-penetrantes.component';
import { ParticulasMagneticasComponent } from './components/particulas-magneticas/particulas-magneticas.component';
import { UltrasonidoComponent} from './components/ultrasonido/ultrasonido.component';
import { OpcionesInformesComponent } from './components/opciones-informes/opciones-informes.component';
//SERVICE

import { AuthGuard } from "./auth.guard";

const routes: Routes = [

  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'sub-proyectos/:idProyecto',
    component: SubProyectosComponent,
    canActivate: [AuthGuard]
  },

  {
    path: '',
    component: OrdenesComponent,
  },

  {
    path: 'clientes',
    component: ClientesComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'implementos',
    component: ImplementosComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'tipo-implementos',
    component: TipoImplentosComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'proyectos',
    component: ProyectosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ordenes',
    component: OrdenesComponent,
    canActivate: [AuthGuard]
  },

  {
    path : 'informes-rutas',
    component: InformesComponent,
    canActivate: [AuthGuard]
  },
  {
    path : 'informes-ordenes/:orden_id',
    component: InformesOrdenesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vt-pintura/:orden_id/:informe_id',
    component : VtPinturaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pull-off/:orden_id/:informe_id',
    component : PullOffComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'adherencia/:orden_id/:informe_id',
    component : AdherenciaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'liquidos_penetrantes/:orden_id/:informe_id',
    component : LiquidosPenetrantesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'particulas_magneticas/:orden_id/:informe_id',
    component : ParticulasMagneticasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ultrasonido/:orden_id/:informe_id',
    component : UltrasonidoComponent,
    canActivate: [AuthGuard]
  },


  {
    path: 'opciones_informes/:ruta_id',
    component : OpcionesInformesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
