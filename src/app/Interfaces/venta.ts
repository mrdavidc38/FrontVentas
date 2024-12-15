import { DetalleVenta } from "./detalle-venta";


export interface Venta {
    idVenta: number;
    numeroDocumento: string | null;
    tipoPago: string | null;
    totalTexto: string | null;
    fechaRegistro: string | null;
    detalleVenta: DetalleVenta[];
}