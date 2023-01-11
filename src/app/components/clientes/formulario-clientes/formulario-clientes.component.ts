import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/classes/cliente/cliente';
import { ClienteService } from 'src/app/services/cliente/cliente.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-clientes',
  templateUrl: './formulario-clientes.component.html',
  styleUrls: ['./formulario-clientes.component.css'],
})
export class FormularioClientesComponent implements OnInit {
  cliente: Cliente = new Cliente();

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadClientData(); // En caso de que se desee actualizar un cliente
  }

  // Para guardar un cliente
  registerClient() {
    this.clienteService.guardarCliente(this.cliente).subscribe((res) => {
      this.cliente = res;
      this.router.navigate(['../clientes/0']);
      swal.fire(
        'Cliente registrado!',
        'El cliente ha sido registrado exitosamente.',
        'success'
      );
    });
  }

  // Cargar datos de un cliente específico para permitir su actualización
  loadClientData() {
    this.activatedRoute.params.subscribe((params) => {
      let idCliente: number = params['idCliente'];

      if (idCliente) {
        this.clienteService.obtenerCliente(idCliente).subscribe((res) => {
          this.cliente = res;
          this.cliente.telefono = this.cliente.telefono.slice(4, 12);
        });
      }
    });
  }

  // Para actualizar al cliente
  updateCliente() {
    swal
      .fire({
        title: '¿Guardar cambios?',
        text: '¿Está seguro/a de que desea guardar los cambios ingresados?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.modificarCliente(this.cliente.idCliente, this.cliente).subscribe(
            (res) => {
              this.router.navigate(['../../clientes/0']);

              swal.fire(
                'Datos actualizados!',
                'La información ha sido actualizada exitosamente.',
                'success'
              );
            },
            (error) => {
              console.log(error);
            }
          );
        }
      });
  }
}
