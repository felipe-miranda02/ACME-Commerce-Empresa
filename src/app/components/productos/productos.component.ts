import { Component } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.interface';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent {
  public productos: Producto[] = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public pageCount: number = 1;
  public filter: string = "";
  public pageNumberArray: number[] = [];
  public selectedProducto: Producto = {
    id: -1,
    titulo: "",
    descripcion: "",
    imagen: null,
    precio: -1,
    embalajeReciclable: false,
    productoReciclable: false,
    fabricacionResponsable: false,
    calificaciones: null,
    categoria: null,
    crossSelling: null,
    upSelling: null
  };
  public searchForm = new FormGroup({
    filter: new FormControl(""),
  })


  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.callGetProductos(this.currentPage, this.filter);
  }

  callGetProductos(pageNumber: number,  filter: string) {
    this.productoService.getProductos(pageNumber, this.pageSize, filter, -1).subscribe(
      (product) => {
        this.productos = product.productos,
        this.currentPage = product.currentPage;
        this.pageSize = product.pageSize;
        this.pageCount = product.pageCount;
        this.filter = product.searchText ? product.searchText : '';        
        this.pageNumberArray = Array(this.pageCount).fill(null).map((x, i) => i + 1);
      }
    );
  }

  public onSearchSubmit(searchFormValue: any) {
    if (searchFormValue !== null && searchFormValue !== undefined) {
      this.callGetProductos(1, searchFormValue.filter);
    }
  }

  public eliminarProducto(id: number) {
    this.productoService.deleteProducto(id).subscribe(
      (response) => {
        this.callGetProductos(this.currentPage, this.filter);
      }
    );
  }

}
