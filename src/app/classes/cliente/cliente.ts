import { Deuda } from "../deuda/deuda";
import { Pedido } from "../pedido/pedido";

export class Cliente {
    idCliente!: number;
    nombre!: string;
    apellido!: string;
    telefono!: string;
    direccion!: string;
    email!: string;
    estado!: string;
    pedidos!: Pedido[];
    deudas!: Deuda[];
}
