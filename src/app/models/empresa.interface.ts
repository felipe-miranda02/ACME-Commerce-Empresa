export interface Empresa {
    id: string,
    nombre: string,
    apellido: string,
    email: string,
    image?: string,
    uri: string,
    puntuacionDeSostenibilidad: 0,
    suscripcion: number,
    puntosDeEntrega: any,
    productos: any,
    serviciosDeEntregas: any,
    lookAndFeel?: LookAndFeel;
}

export interface EmpresaDto {
    id: string;
    nombre: string;
    uri: string;
    image?: string;
    lookAndFeel?: LookAndFeel;
}
  
export interface LookAndFeel {
    id: string;
    imagenBanner?: string;
    paletaDeColores: string;
}

export enum colors {
    blue = 'blue',
    red = 'red',
    purple = 'purple',
    teal = 'teal',
    grey = 'grey',
}