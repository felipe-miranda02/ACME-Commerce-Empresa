export interface Producto {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string | null;
  precio: number;
  embalajeReciclable: boolean;
  productoReciclable: boolean;
  fabricacionResponsable: boolean;
  calificaciones: Calificacion[] | null;
  categoria: any | null; // Define el tipo adecuado para la categoría
  crossSelling: any[] | null; // Define el tipo adecuado para crossSelling
  upSelling: any[] | null; // Define el tipo adecuado para upSelling
}

export interface Calificacion {
  id: number;
  valor: number;
  comentario: string;
}

export interface DireccionDeEntrega {
  id?: number;
  nombre: string;
  direccionFormateada: string;
  latitud: number;
  longitud: number;
}

export interface ServicioDeEntrega {
  id?: number;
  nombre: string;
  velocidad: string;
  costo: number;
  seguimiento: string;
  huellaDeCarbono: HuellaDeCarbono;
}

export enum HuellaDeCarbono {
  Fosil,
  Hidrico,
  Electrico,
  MedioLiviano,
}

export interface ProductoOrden {
  id: number;
  producto: Producto;
  cantidad: number;
  precio: number;
  devuelto: boolean;
}

export interface Orden {
  id: number;
  productoOrden: ProductoOrden[];
  costoTotal: number;
  estado: number;
  metodoPago: number;
  direccionDeEntrega: DireccionDeEntrega;
  servicioDeEntrega: ServicioDeEntrega;
  fechaDeModificacion: string;
  fechaDeCompra: string;
}

export interface PaginatedOrder {
  ordenes: Orden[];
  currentPage: number;
  pageSize: number;
  pageCount: number;
  inicio?: Date;
  fin?: Date;
}
