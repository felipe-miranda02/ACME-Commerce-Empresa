import { NgModule, importProvidersFrom, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderEditComponent } from './components/order-edit/order-edit.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ServicioEntregaComponent } from './components/servicio-entrega/servicio-entrega.component';
import { DireccionesComponent } from './components/direcciones/direcciones.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { EmpresaReportesComponent } from './components/empresa-reportes/empresa-reportes.component';
import { ProductosDetailsComponent } from './components/productos-details/productos-details.component';
import { ProductosCreateComponent } from './components/productos-create/productos-create.component';
import { ProductosEditComponent } from './components/productos-edit/productos-edit.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EmpresaService } from './services/empresa.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'ordenes',
    component: OrderListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'ordenes/editar/:id',
    component: OrderEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ordenes/detalles/:id',
    component: OrderDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reportes',
    component: EmpresaReportesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'productos/crear',
    component: ProductosCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'productos/editar/:id',
    component: ProductosEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'productos/detalles/:id',
    component: ProductosDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'servicio-entrega',
    component: ServicioEntregaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'direcciones',
    component: DireccionesComponent,
    canActivate: [AuthGuard],
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
