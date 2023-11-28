import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Empresa, EmpresaDto } from '../models/empresa.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${environment.base_url}/empresa`);
  }

  getEmpresa(): Observable<Empresa> {
    const id = this.authService.getUserId();
    return this.http.get<Empresa>(`${environment.base_url}/empresa/${id}`);
  }

  updateEmpresa(empresa: any) {
    return this.http.patch(`${environment.base_url}/empresa/`, empresa);
  }
}
