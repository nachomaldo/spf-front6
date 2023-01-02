import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pedido } from 'src/app/classes/pedido/pedido';
import { Producto } from 'src/app/classes/producto/producto';
import { CarritoService } from 'src/app/services/carrito/carrito.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-carrito-productos',
  templateUrl: './carrito-productos.component.html',
  styleUrls: ['./carrito-productos.component.css'],
})
export class CarritoProductosComponent implements OnInit {
  title: string = 'Carrito de compras';

  // Atributo pedido para manejar la compra rápida
  pedidoRapido: Pedido = new Pedido();

  carrito: Producto[] = [];
  totalAmount: number = 0;

  constructor(
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCarrito();
    this.calcTotalAmount();
  }

  // TODO: Agregar lógica cuando no hay nada en el carrito
  private loadCarrito() {
    this.carrito = this.carritoService.getCart();
  }

  private calcTotalAmount() {
    this.carrito.forEach(
      (productInCart) =>
        (this.totalAmount += productInCart.cantidad * productInCart.precio)
    );
  }

  compraRapida() {
    swal.fire({
      title: 'Compra rápida!',
      text: '¿Desea realizar una compra rápida?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2b8a3e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.carrito.map(producto => producto.stock = producto.stock - producto.cantidad);
        this.pedidoRapido.productos = this.carrito;

        this.pedidoService.compraRapida(this.pedidoRapido).subscribe(res => {
          this.carritoService.cleanCart();

          swal.fire(
            'Compra realizada!',
            'La compra se ha realizado exitosamente.',
            'success'
          );

          this.router.navigate(['']);
        });
      }
    });
  }

  // Para remover un producto del carrito
  removeProduct(product: Producto) {
    swal.fire({
      title: '¿Eliminar producto?',
      text: '¿Desea remover el producto del carrito de compras?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2b8a3e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimínalo',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.carritoService.removeProductFromCart(product)) {
          this.toastr.error(
            `Producto(s) removido(s) del carrito.`,
            `Producto eliminado`
          );

          this.loadCarrito();
          this.totalAmount = 0;
          this.calcTotalAmount();
        }
      }
    });
  }
}
