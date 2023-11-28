import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  DireccionDeEntrega,
  Orden,
  PaginatedOrder,
  ServicioDeEntrega,
} from '../models/orden.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';

const ORDEN_PATH = `${environment.base_url}/Orden`;
const EMPRESA_PATH = `${environment.base_url}/Empresa`;

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getOrders(
    id: string,
    estado: string,
    page: number,
    pageSize: number
  ): Observable<PaginatedOrder> {
    let params = new HttpParams()
      .append('currentPage', page)
      .append('pageSize', pageSize)
      .append('estado', estado);

    const options = { params };

    return this.http.get<PaginatedOrder>(
      `${EMPRESA_PATH}/${id}/ordenes`,
      options
    );
  }

  getOrden(ordenId: number): Observable<Orden> {
    return this.http.get<Orden>(`${ORDEN_PATH}/${ordenId}`);
  }

  updateOrder(id: number, estado: string): Observable<any> {
    const body = {};

    return this.http.put<any>(
      `${environment.base_url}/Orden/${id}?estado=${estado}`,
      body
    );
  }

  obtenerFecha(fecha: string): string {
    if (fecha == null) {
      return '-';
    } else {
      return this.formatearFecha(fecha);
    }
  }

  formatearFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);

    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();

    const fechaFormateada = `${dia}/${mes}/${año}`;

    return fechaFormateada;
  }

  obtenerServicioEntrega(servicio: ServicioDeEntrega): string {
    if (servicio) {
      return servicio.nombre + ' (' + servicio.velocidad + ')';
    }
    return '-';
  }

  obtenerDireccion(direccion: DireccionDeEntrega): string {
    if (direccion) {
      return direccion.direccionFormateada;
    }
    return '-';
  }

  obtenerMetodoPago(metodo: number) {
    if (metodo == 1) {
      return 'Tarjeta';
    } else if (metodo == 0) {
      return 'Efectivo';
    } else {
      return '-';
    }
  }

  obtenerEstadoPedido(estado: number) {
    switch (estado) {
      case 0:
        return 'Carrito';
      case 1:
        return 'Creada';
      case 2:
        return 'Empacado';
      case 3:
        return 'En Centro de Envíos';
      case 4:
        return 'En Tránsito';
      case 5:
        return 'Recibido';
      default:
        return 'Error';
    }
  }
}
