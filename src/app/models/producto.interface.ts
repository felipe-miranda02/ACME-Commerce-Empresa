export interface ProductoOrden {
    id: number;
    producto: Producto;
    cantidad: number;
    precio: number;
    devuelto: boolean;
  }
  
  export interface Producto {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: any;
    precio: number;
    embalajeReciclable: boolean;
    productoReciclable: boolean;
    fabricacionResponsable: boolean;
    calificaciones: any;
    categoria: any;
    crossSelling: any;
    upSelling: any;
  }
  
  export interface PaginatedProducts {
    productos: Producto[];
    currentPage: number;
    pageSize: number;
    pageCount: number;
    searchText?: string;
    categoriaId?: number; 
  }
  
  export interface Categoria {
    id: number;
    nombre: string;
  }
  