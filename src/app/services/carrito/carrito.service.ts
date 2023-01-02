import { Injectable } from '@angular/core';
import { Producto } from 'src/app/classes/producto/producto';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  carrito: Producto[] = [];

  constructor() {}

  // Para agregar productos al carrito
  addToCart(product: Producto, quantity: number): boolean {
    if (product && quantity) {
      if (this.carrito.includes(product)) {
        this.carrito.map((productInCart) => {
          if (productInCart.codigo === product.codigo) {
            productInCart.cantidad += quantity;
          }
        });

        return true;
      }

      product.cantidad = quantity;
      this.carrito.push(product);

      return true;
    }

    return false;
  }

  // Para mantener los productos que el cliente desea comprar
  // setupCart(cart: Producto[]) {
  //   if (this.carrito.length === 0) {
  //     this.carrito = cart;
  //     return;
  //   }

  //   cart.forEach((productFromParameter) => {
  //     // TODO: Validar cuando se vuelven a ingresar los mismos productos
  //     if (this.carrito.includes(productFromParameter)) {
  //     } else {
  //       this.carrito.push(productFromParameter);
  //     }
  //   });
  // }

  // Para retornar los productos que el cliente desea retornar
  getCart(): Producto[] {
    return this.carrito;
  }

  // Para eliminar un producto del carrito
  removeProductFromCart(product: Producto): boolean {
    if (product) {
      // Para setear la cantidad del producto en 0
      this.carrito.map((productInCart) => {
        if (productInCart.codigo === product.codigo) {
          productInCart.cantidad = 0;
        }
      });

      // Remueve el producto del carrito
      let index = this.carrito.findIndex(
        (val) => val.codigo === product.codigo
      );
      this.carrito.splice(index, 1);

      return true;
    }

    return false;
  }

  // Para limpiar el carrito luego de que se haya concretado una compra
  cleanCart() {
    this.carrito = [];
  }
}
