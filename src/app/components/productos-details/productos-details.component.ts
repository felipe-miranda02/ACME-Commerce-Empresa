import { Component } from '@angular/core';
import { Producto } from '../../models/producto.interface';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-productos-details',
  templateUrl: './productos-details.component.html',
  styleUrls: ['./productos-details.component.css']
})
export class ProductosDetailsComponent {
  public product: Producto = {} as Producto;
  productId: number = 0;
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

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
    });

    this.productoService.getProducto(this.productId).subscribe(
      (producto) => {
        this.product = producto;
      }
    );

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      location.reload(); 
    });
  }

}
