import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Categoria,
  PaginatedProducts,
  Producto,
} from '../models/producto.interface';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private authService: AuthenticationService) {}

  private http = inject(HttpClient);

  getProductos(
    page: number = 1,
    pageSize: number = 2,
    searchText: string = '',
    categoriaId: number = -1
  ): Observable<PaginatedProducts> {
    let params = new HttpParams()
      .append('currentPage', page)
      .append('pageSize', pageSize)
      .append('categoriaId', categoriaId);

    if (searchText != '') {
      params = params.append('searchText', searchText);
    }

    const options = { params };
    const id = this.authService.getUserId();
    return this.http.get<PaginatedProducts>(
      `${environment.base_url}/producto/empresa/${id}`,
      options
    );
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${environment.base_url}/Producto/${id}`);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.base_url}/Producto/${id}`);
  }

  getCategorias(): Observable<Categoria[]> {
    const id = this.authService.getUserId();

    return this.http.get<Categoria[]>(
      `${environment.base_url}/Empresa/${id}/categorias`
    );
  }

  agregarProducto(producto: any): Observable<any> {
    const id = this.authService.getUserId();
    return this.http.post(
      `${environment.base_url}/Empresa/${id}/productos`,
      producto
    );
  }

  editarProducto(producto: any): Observable<any> {
    const id = this.authService.getUserId();
    return this.http.put(
      `${environment.base_url}/Empresa/${id}/productos`,
      producto
    );
  }

  agregarUpSelling(productId: number, nuevoUpSelling: number): Observable<any> {
    return this.http.post(
      `${environment.base_url}/Producto/${productId}/upSelling/${nuevoUpSelling}`,
      null
    );
  }

  agregarCrossSelling(
    productId: number,
    nuevoCrossSelling: number
  ): Observable<any> {
    return this.http.post(
      `${environment.base_url}/Producto/${productId}/crossSelling/${nuevoCrossSelling}`,
      null
    );
  }
}
