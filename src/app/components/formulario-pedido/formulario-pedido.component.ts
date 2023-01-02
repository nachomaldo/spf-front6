import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/classes/pedido/pedido';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
moment.locale('es');

import swal from 'sweetalert2';
import { CarritoService } from 'src/app/services/carrito/carrito.service';
import { Producto } from 'src/app/classes/producto/producto';
import { Cliente } from 'src/app/classes/cliente/cliente';
import { ClienteService } from 'src/app/services/cliente/cliente.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './formulario-pedido.component.html',
  styleUrls: ['./formulario-pedido.component.css'],
})
export class FormularioPedidoComponent implements OnInit {
  // Para validar que la fecha seleccionada no sea anterior a la fecha actual
  fechaActual: string = moment().format('YYYY[-]MM[-]DD');

  // Para guardar/actualizar un pedido
  pedido: Pedido = new Pedido();

  // Para guardar el listado de productos del pedido
  carrito: Producto[] = new Array();

  // Para manejar la búsqueda o creación de clientes
  cliente: Cliente = new Cliente();

  // Total del pedido
  totalAmount: number = 0;

  // Variable para controlar si se muestra la interfaz para buscar un cliente
  registeredClient: boolean = false;

  // Variable para controlar si se muestra la interfaz para registrar a un cliente
  newClient: boolean = false;

  // Para guardar los resultados de la búsqueda de un cliente
  foundClients!: Cliente[];

  idPedido!: number;

  constructor(
    private pedidoService: PedidoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private carritoService: CarritoService,
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPedidoData(); // En caso de que se desee actualizar un pedido
    this.loadCart();
    this.calcTotalAmount();
  }

  // Para cargar el listado de productos del pedido (contenidos en el carrito)
  loadCart() {
    this.carrito = this.carritoService.getCart();
  }

  // Para calcular el total del pedido
  calcTotalAmount() {
    this.carrito.forEach(
      (productInCart) =>
        (this.totalAmount += productInCart.cantidad * productInCart.precio)
    );
  }

  // Para controlar la muestra de la interfaz que permite buscar un cliente registrado
  showSearchClientInterface() {
    this.registeredClient = !this.registeredClient;
    this.newClient = false;
  }

  // Para controlar la muestra de la interfaz que permite registrar a un cliente
  showNewClientInterface() {
    this.newClient = !this.newClient;
    this.registeredClient = false;
  }

  // Crear un nuevo cliente
  registerClient() {
    this.clienteService.guardarCliente(this.cliente).subscribe((res) => {
      this.pedido.cliente = res;
      this.pedido.nombreDelReceptor = res.nombre;
      this.pedido.direccionDeReparto = res.direccion;

      this.toastr.success(
        `Cliente registrado!`,
        `El cliente ha sido registrado exitosamente.`
      );
    });
  }

  // Buscar un cliente; retorna un arreglo de resultados
  // TODO: Probar búsqueda de clientes
  searchClient(name: string) {
    this.clienteService.buscarCliente(name).subscribe((res) => {
        this.foundClients = res as Cliente[];
    }, error => {
      console.log(error);
      this.toastr.error(
        `No se han encontrado clientes con el nombre ${name}.`,
        `No encontrado ...`
      );
    });
  }

  // Para asociar al cliente seleccionado al pedido a realizar
  associateClientToOrder(client: Cliente) {
    this.pedido.cliente = client;
    this.pedido.nombreDelReceptor = client.nombre;
    this.pedido.direccionDeReparto = client.direccion;
  }

  // Crear un nuevo pedido
  guardarNuevoPedido() {
    this.pedido.total = this.totalAmount;
    this.pedido.productos = this.carrito;
    console.log(this.pedido);
    this.pedidoService.crearNuevoPedido(this.pedido).subscribe(
      (pedido) => {
        this.carritoService.cleanCart();
        this.router.navigate(['']);
        swal.fire(
          'Pedido creado!',
          'El pedido ha sido guardado exitosamente.',
          'success'
        );
      },
      (error) => {
        if (error.status == 409) {
          swal.fire(
            'Conflicto de pedidos!',
            'La fecha seleccionada se encuentran en su maximo diario. Por favor, intente nuevamente con una fecha distinta.',
            'error'
          );
        } else if (error.status == 204) {
          swal.fire(
            'Fallo en el ingreso de datos',
            'Para guardar un nuevo pedido, primero debe ingresar todos los datos solicitados',
            'error'
          );
        }
      }
    );
  }

  // Cargar datos de un pedido específico para permitir su actualización
  loadPedidoData() {
    this.activatedRoute.params.subscribe((params) => {
      let idPedido: number = params['idPedido'];
      if (idPedido) {
        this.pedidoService.obtenerPedido(idPedido).subscribe((pedido) => {
          this.pedido = pedido;
          this.totalAmount = this.pedido.total;
        });
      }
    });
  }

  // Actualizar un pedido
  updatePedido() {
    swal
      .fire({
        title: '¿Guardar cambios?',
        text: '¿Estás seguro/a de que deseas guardar los cambios ingresados?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.pedidoService.modificarPedido(this.pedido).subscribe(
            (horario) => {
              this.router.navigate(['']);

              swal.fire(
                'Datos actualizados!',
                'La información ha sido actualizada exitosamente.',
                'success'
              );
            },
            (error) => {
              if (error.status == 409) {
                swal.fire(
                  'Conflicto de pedidos!',
                  'La fecha seleccionada se encuentran en su maximo diario. Por favor, intente nuevamente con una fecha distinta.',
                  'error'
                );
              }
            }
          );
        }
      });
  }

  // Para modificar el estado pendiente del pedido
  // modifyDeliveryStatus() {
  //   if (this.pedido.pendiente == 1) {
  //     swal
  //       .fire({
  //         title: 'Modificar estado pendiente del pedido',
  //         text: '¡El pedido fue retirado/entregado!',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#d33',
  //         cancelButtonColor: '#007f5f',
  //         confirmButtonText: 'No, el cliente no ha recibido su pedido',
  //         cancelButtonText: 'Cancelar',
  //       })
  //       .then((result) => {
  //         if (result.isConfirmed) {
  //           this.pedido.pendiente = 0;
  //           this.pedidoService
  //             .modificarPedido(this.pedido)
  //             .subscribe((pedidoModificado) => {
  //               swal.fire(
  //                 'Estado pendiente del pedido modificado!',
  //                 'El cliente no ha recibido su pedido.',
  //                 'success'
  //               );
  //             });
  //         }
  //       });
  //   } else if (this.pedido.pendiente == 0) {
  //     swal
  //       .fire({
  //         title: 'Modificar estado pendiente del pedido',
  //         text: '¿El cliente sí recibio su pedido?',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#007f5f',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: 'Sí, el cliente recibio su pedido',
  //         cancelButtonText: 'Cancelar',
  //       })
  //       .then((result) => {
  //         if (result.isConfirmed) {
  //           this.pedido.pendiente = 1;
  //           this.pedidoService
  //             .modificarPedido(this.pedido)
  //             .subscribe((pedidoModificado) => {
  //               swal.fire(
  //                 'Estado pendiente del pedido modificado!',
  //                 'El cliente ha recibido su pedido.',
  //                 'success'
  //               );
  //             });
  //         }
  //       });
  //   }
  // }
}
