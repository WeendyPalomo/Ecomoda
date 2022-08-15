

export interface Producto {
    nombre: string;
    precio: number;
    foto: string;
    id: string;
    fecha: Date;
    descripcion: string;
    categoria: Categoria;
}

export interface Categoria{
    nombreSub: string;
    idCateg: string;
}

export interface Pedido {
   id: string;
   cliente: Cliente;
   productos: ProductoPedido[];
   precioTotal: number;
   estado: EstadoPedido;
   fecha: any;
   valoracion: number;
}

export interface ProductoPedido {
    producto: Producto;
    cantidad: number;
}

export type  EstadoPedido = 'enviado' | 'visto' | 'camino' | 'entregado';


export interface Cliente {
    uid: string;
    nombres: string;
    apellidos: string;
    direccion: string;
    celular: string;
    correo: string;
    contrasena: string;
    foto: string;
 }