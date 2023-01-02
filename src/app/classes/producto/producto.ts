import { SafeResourceUrl } from "@angular/platform-browser";

export class Producto {
    codigo!: number;
    nombre!: string;
    precio!: number;
    stock!: number;
    descripcion!: string;
    categoria!: string;
    imageName!: string;
    imageBytes!: any;
    imageType!: string;
    cantidad: number = 0;
    estado!: string;
}
