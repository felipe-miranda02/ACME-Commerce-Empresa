import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DireccionDeEntrega } from '../models/orden.interface';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class PickUpService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getPickUps(): Observable<DireccionDeEntrega[]> {
    const id = this.authService.getUserId();
    return this.http.get<DireccionDeEntrega[]>(
      `${environment.base_url}/Empresa/${id}/pick-ups`
    );
  }

  create(body: DireccionDeEntrega): Observable<any> {
    const id = this.authService.getUserId();
    return this.http.post(
      `${environment.base_url}/Empresa/${id}/pick-ups`,
      body
    );
  }

  update(id: number, body: DireccionDeEntrega): Observable<any> {
    return this.http.put(`${environment.base_url}/Direccion/${id}`, body);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.base_url}/Direccion/${id}`);
  }
}
