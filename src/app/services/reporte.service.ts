import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Empresa } from '../models/empresa.interface';
import { Reporte, ReporteGlobal } from '../models/reporte.interface';

const REPORTE_PATH = `${environment.base_url}/Reporte`;

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getReporte(id: string, desde: string, hasta: string): Observable<Reporte> {
    return this.http.get<Reporte>(
      `${REPORTE_PATH}/empresa/${id}?desde=${desde}&hasta=${hasta}`
    );
  }

  getReporteGlobal(desde: string, hasta: string): Observable<ReporteGlobal> {
    return this.http.get<ReporteGlobal>(
      `${REPORTE_PATH}?desde=${desde}&hasta=${hasta}`
    );
  }
}
