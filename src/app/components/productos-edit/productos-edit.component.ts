import { Component } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { Producto } from '../../models/producto.interface';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-productos-edit',
  templateUrl: './productos-edit.component.html',
  styleUrls: ['./productos-edit.component.css']
})
export class ProductosEditComponent {

  public productId: number = 0;
  public producto: Producto = {
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
  public pageSize: number = 2;
  
  public productosCross: Producto[] = [];
  public currentPageCross: number = 1;
  public pageCountCross: number = 1;
  public pageNumberArrayCross: number[] = [];

  public productosUp: Producto[] = [];
  public currentPageUp: number = 1;
  public pageCountUp: number = 1;
  public pageNumberArrayUp: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
    });

    this.callGetProductosUp(this.currentPageUp);
    this.callGetProductosCross(this.currentPageCross);

    this.productoService.getProducto(this.productId).subscribe(
      (producto) => {
        this.producto = producto;
      }
    );
  
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      location.reload(); 
    });
  }

  callGetProductosCross(pageNumber: number) {
    this.productoService.getProductos(pageNumber, this.pageSize, "", -1).subscribe(
      (product) => {
        this.productosCross = product.productos,
        this.currentPageCross = product.currentPage;
        this.pageCountCross = product.pageCount;
        this.pageNumberArrayCross = Array(this.pageCountCross).fill(null).map((x, i) => i + 1);
      }
    );
  }

  callGetProductosUp(pageNumber: number) {
    this.productoService.getProductos(pageNumber, this.pageSize, "", -1).subscribe(
      (product) => {
        this.productosUp = product.productos,
        this.currentPageUp = product.currentPage;
        this.pageCountUp = product.pageCount;
        this.pageNumberArrayUp = Array(this.pageCountUp).fill(null).map((x, i) => i + 1);
      }
    );
  }

  editarProducto() {
    this.productoService.editarProducto(this.producto).subscribe((data) => {
      console.log(data);
      this.router.navigate(['/productos']);
    });
  }

  agregarUpSelling(nuevoUpSelling: number) {
    this.productoService.agregarUpSelling(this.productId, nuevoUpSelling).subscribe((data) => {
      location.reload();
    });
  }

  agregarCrossSelling(nuevoCrossSelling: number) {
    this.productoService.agregarCrossSelling(this.productId, nuevoCrossSelling).subscribe((data) => {
      location.reload();
    });
  }

  public onImageUploaded(event: any) {
    const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    const reader = new FileReader();

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  private _handleReaderLoaded(event: any) {
    let reader = event.target;
    this.producto.imagen = reader.result;
  }

}
