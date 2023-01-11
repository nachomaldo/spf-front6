import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/classes/pedido/pedido';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

import swal from 'sweetalert2';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Producto } from 'src/app/classes/producto/producto';
moment.locale('es');

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.component.html',
  styleUrls: ['./lista-pedidos.component.css']
})
export class ListaPedidosComponent implements OnInit {

  today = moment().format("YYYY[-]MM[-]DD");

  pedidosDelDia: Array<Pedido> = new Array();

  // Para manejar el display de los productos de un pedido
  productosPedido: Producto[] = new Array();

  // Para manejar la cantidad límite de pedidos por día
  // limitePedidos!: number;

  constructor(private pedidoService: PedidoService, public authService: AuthService) { }

  ngOnInit(): void {
    this.getPedidosFechaActual(this.today);

    // this.limitePedidos = this.pedidoService.getPedidosLimit();
  }

  getPedidosFechaActual(fechaActual: string) {
    this.pedidosDelDia = [];
    return this.pedidoService.obtenerPedidosDelDia(fechaActual).subscribe((res: any) => {
      res.forEach((pedido: Pedido) => this.pedidosDelDia.push(pedido));
    });
  }

  // Para eliminar un pedido
  eliminarPedido(idPedido: number) {
    swal.fire({
      title: '¿Eliminar el pedido?',
      text: 'Esta acción es irreversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidoService.eliminarPedido(idPedido).subscribe(res => {
          this.pedidosDelDia = [];
          this.getPedidosFechaActual(this.today);

          swal.fire(
            'Pedido eliminado',
            'El pedido ha sido eliminado.',
            'success'
          );
        });
      }
    });
  }

  // Para modificar el estado de entrega de un pedido
  modificarEstadoEntrega(pedido: Pedido) {
    swal.fire({
      title: '¿Modificar el estado de entrega?',
      text: `¿Desea cambiar el estado a ${pedido.pendiente ? 'entregado' : 'pendiente'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        pedido.pendiente = !pedido.pendiente;

        this.pedidoService.modificarPedido(pedido).subscribe(res => {
          swal.fire(
            'Estado actualizado!',
            `El estado del pedido ha sido modificado a ${res.pendiente ? 'pendiente' : 'entregado'}.`,
            'success'
          );

          this.getPedidosFechaActual(this.today);
        });
      }
    });
  }

  // Para actualizar el valor máximo de pedidos diarios
  // actualizarMaximo(maximo: number) {
  //   this.pedidoService.setPedidosLimit(maximo);

  //   swal.fire(
  //     'Máximo actualizado!',
  //     'El máximo de pedidos diarios ha sido actualizado correctamente.',
  //     'success'
  //   );

  //   this.limitePedidos = this.pedidoService.getPedidosLimit();
  // }

  getProductosPedido(productos: Producto[]) {
    this.productosPedido = productos;
  }

}
