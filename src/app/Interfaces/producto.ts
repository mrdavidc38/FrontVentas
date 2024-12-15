export interface Producto {
    idProducto: number;
    nombre: string ;
    idCategoria: number | null;
    descriptionCategoria: string | null;
    stock: number ;
    precio: number;
    esActivo: number | null;
}