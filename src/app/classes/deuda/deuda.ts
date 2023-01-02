import { Cliente } from "../cliente/cliente";

export class Deuda {
    idDeuda!: number;
    vigente!: boolean;
    motivo!: string;
    monto!: number;
    fecha!: string;
    cliente!: Cliente;
}
