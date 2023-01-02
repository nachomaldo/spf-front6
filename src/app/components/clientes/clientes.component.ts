import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/classes/cliente/cliente';
import { Deuda } from 'src/app/classes/deuda/deuda';
import { Pedido } from 'src/app/classes/pedido/pedido';
import { Producto } from 'src/app/classes/producto/producto';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { DeudaService } from 'src/app/services/deuda/deuda.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  // Para manejar los clientes activos
  clientes: Cliente[] = new Array();

  // Para manejar los clientes inactivos
  clientesInactivos: Cliente[] = new Array();

  // Para manejar la búsqueda de clientes
  clientesBuscados: Cliente[] = new Array();

  // Pedidos del cliente
  pedidosCliente: Pedido[] = new Array();

  // Productos de un pedido específico del cliente
  productosPedidosCliente: Producto[] = new Array();

  // Deudas del cliente
  deudasCliente: Deuda[] = new Array();

  // Para manejar la paginación
  paginador: any;

  // Para entregar la ruta a seguir al paginador
  route: string = '../../clientes';

  // Para el despliegue del nombre del cliente en los modales
  nombreCliente: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private deudaService: DeudaService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  // Obtener todos los clientes paginados
  loadClients() {
    this.activatedRoute.paramMap.subscribe((params) => {
      let pageNumber: number = +params.get('page')!;

      if (!pageNumber) pageNumber = 0;

      this.clienteService
        .obtenerClientesPaginados(pageNumber)
        .subscribe((res) => {
          this.clientes = res.content as Cliente[];
          this.paginador = res;
        });
    });
  }

  loadInactiveClients() {
    this.clienteService.obtenerClientesInactivos().subscribe(res => {
      this.clientesInactivos = res as Cliente[];
    });
  }

  // Para asignar los pedidos del cliente seleccionado a la variable de la clase
  getPedidosCliente(pedidos: Pedido[]) {
    this.pedidosCliente = pedidos;
  }

  // Para asignar las deudas del cliente seleccionado a la variable de la clase
  getDeudasCliente(deudas: Deuda[]) {
    this.deudasCliente = deudas as Deuda[];
  }

  // Para asignar los productos un pedido específico del cliente a la variable de la clase
  getProductosPedidoCliente(productos: Producto[]) {
    this.productosPedidosCliente = productos;
  }

  // Para buscar un cliente por su nombre
  searchClients(name: string) {
    if (name) {
      this.clienteService.buscarCliente(name).subscribe((res) => {
        this.clientesBuscados = res;
      });
    }
  }

  // Para modificar el estado de la deuda de un cliente
  modifyDebtStatus(deuda: Deuda) {
    if (deuda) {
      swal
        .fire({
          title: '¿Modificar estado?',
          text: '¿Está seguro de que desea modificar el estado de la deuda?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '##2b8a3e',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar',
        })
        .then((result) => {
          if (result.isConfirmed) {
            deuda.vigente = !deuda.vigente;
            this.deudaService.modifyDebt(deuda).subscribe((res) => {
              swal.fire(
                'Estado modificado!',
                'El estado de la deuda del cliente fue modificado correctamente',
                'success'
              );

              this.loadClients();
            });
          }
        });
    }
  }

  // Para eliminar un cliente
  eliminarCliente(cliente: Cliente) {
    swal
      .fire({
        title: '¿Eliminar cliente?',
        text: '¿Está seguro de que desea eliminar al cliente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '##2b8a3e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.eliminarCliente(cliente).subscribe(
            (res) => {
              swal.fire(
                'Cliente eliminado',
                'El cliente ha sido eliminado exitosamente.',
                'success'
              );

              this.loadClients();
            },
            (err) => {
              if (err.status == 400) {
                console.log(err);
                swal.fire('Eliminación fallida!', `${err.error.message}`, 'error');
              }
            }
          );
        }
      });
  }

  setNombreCliente(nombre: string, apellido: string) {
    this.nombreCliente = nombre + ' ' + apellido;
  }

  clearClientesBuscados() {
    this.clientesBuscados = [];
  }

  // Reintegrar un cliente
  reintegrarCliente(cliente: Cliente) {
    swal
      .fire({
        title: '¿Reintegrar cliente?',
        text: '¿Está seguro de que desea reintegrar al cliente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '##2b8a3e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.reintegrarCliente(cliente).subscribe(
            (res) => {
              swal.fire(
                'Cliente reintegrado!',
                'El cliente ha sido reintegrado exitosamente.',
                'success'
              );

              this.loadClients();
            }
          );
        }
      });
  }
}
