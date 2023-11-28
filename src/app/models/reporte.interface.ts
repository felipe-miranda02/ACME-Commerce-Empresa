import { Categoria } from "./producto.interface";

export interface Reporte {
    desde: string;
    hasta: string;
    pagosTarjeta: number;
    pagosEfectivo: number;
    totalOrdenes: number;
    totalVentas: number;
    productosMasVendidos: ProductoMasVendido[];
    serviciosEntregas: ServicioEntrega[];
  }
  
  export interface ProductoMasVendido {
    cantidadVendida: number;
    cantidadDevuelto: number;
    producto: Producto;
  }
  
  export interface Producto {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    precio: number;
    embalajeReciclable: boolean;
    productoReciclable: boolean;
    fabricacionResponsable: boolean;
  }
  
  export interface ServicioEntrega {
    cantidad: number;
    servicioDeEntrega: ServicioDeEntregaDetalle;
  }
  
  export interface ServicioDeEntregaDetalle {
    id: number;
    nombre: string;
    velocidad: string;
    costo: number;
    seguimiento: string;
    huellaDeCarbono: number;
  }

  export interface ReporteGlobal {  
    desde: string;
    hasta: string;
    pagosTarjeta: number;
    pagosEfectivo: number;
    totalOrdenes: number;
    totalVentas: number;
    productosMasVendidos: ProductoMasVendido[];
    serviciosEntregas: ServicioEntrega[];
    direccionEntrega: DireccionEntrega[];
    categorias: CategoriaDetalle[];
  }

  export interface DireccionEntrega {
    direccion: Direccion;
    cantidad: number;
  }

  export interface Direccion {
    id: number
    nombre: string;
    direccionFormateada: string
    latitud: number;
    longitud: number;
  }

  export interface CategoriaDetalle {
    nombre: string;
    cantidadProductos: number;
    cantidadVentas: number;
  }