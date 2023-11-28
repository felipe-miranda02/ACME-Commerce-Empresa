import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DireccionesComponent } from './components/direcciones/direcciones.component';
import { EmpresaReportesComponent } from './components/empresa-reportes/empresa-reportes.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderEditComponent } from './components/order-edit/order-edit.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ProductosCreateComponent } from './components/productos-create/productos-create.component';
import { ProductosDetailsComponent } from './components/productos-details/productos-details.component';
import { ProductosEditComponent } from './components/productos-edit/productos-edit.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ServicioEntregaComponent } from './components/servicio-entrega/servicio-entrega.component';

export function getToken() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    OrderListComponent,
    OrderEditComponent,
    NavbarComponent,
    ProductosComponent,
    ServicioEntregaComponent,
    DireccionesComponent,
    HomeComponent,
    LoginComponent,
    OrderDetailsComponent,
    EmpresaReportesComponent,
    ProductosDetailsComponent,
    ProductosCreateComponent,
    ProductosEditComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        allowedDomains: [
          'localhost:5001',
          'localhost:7189',
          'https://localhost:7255',
        ],
        disallowedRoutes: [],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
