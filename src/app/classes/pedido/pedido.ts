import { Cliente } from "../cliente/cliente";
import { Producto } from "../producto/producto";

export class Pedido {
    idPedido!: number;
    nombreDelReceptor!: string;
    fecha!: string;
    direccionDeReparto!: string;
    total!: number;
    pendiente!: boolean;
    productos!: Producto[]
    cliente!: Cliente;
    constructor() { }
}