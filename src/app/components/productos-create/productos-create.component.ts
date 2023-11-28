import { Component } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { Categoria } from 'src/app/models/producto.interface';
import { Producto } from 'src/app/models/orden.interface';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-productos-create',
  templateUrl: './productos-create.component.html',
  styleUrls: ['./productos-create.component.css']
})
export class ProductosCreateComponent {

  producto : Producto = {
    id: 0,
    titulo: '',
    descripcion: '',
    imagen: '',
    precio: 0,
    embalajeReciclable: false,
    productoReciclable: false,
    fabricacionResponsable: false,
    calificaciones: [],
    categoria: {id: 0, nombre: ''},
    crossSelling: [],
    upSelling: []
  };
  categorias: Categoria[] = [];

  constructor(private productoService: ProductoService,
              private route: Router,

    ) {}

  ngOnInit() {
    this.productoService.getCategorias().subscribe( (data) => {
        this.categorias = data;
    });
  }

  agregarProducto() {
    var nombreCat = this.categorias.find( (categoria) => categoria.id === this.producto.categoria.id)?.nombre;
    if(nombreCat !== undefined){
      this.producto.categoria.nombre = nombreCat;
    } else{
      this.producto.categoria = null;  
    }

    this.productoService.agregarProducto(this.producto).subscribe((data) => {
      this.route.navigate(['/productos']);
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
