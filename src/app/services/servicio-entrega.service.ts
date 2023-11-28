import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServicioDeEntrega } from '../models/orden.interface';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ServicioEntregaService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getServiciosDeEntrega(): Observable<ServicioDeEntrega[]> {
    const id = this.authService.getUserId();
    return this.http.get<ServicioDeEntrega[]>(
      `${environment.base_url}/Empresa/${id}/servicios-entrega`
    );
  }

  create(body: ServicioDeEntrega): Observable<any> {
    const id = this.authService.getUserId();
    return this.http.post(
      `${environment.base_url}/Empresa/${id}/servicios-entrega`,
      body
    );
  }

  update(id: number, body: ServicioDeEntrega): Observable<any> {
    return this.http.put(
      `${environment.base_url}/ServicioDeEntrega/${id}`,
      body
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.base_url}/ServicioDeEntrega/${id}`);
  }
}
