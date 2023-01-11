import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/classes/cliente/cliente';
import { Deuda } from 'src/app/classes/deuda/deuda';
import swal from 'sweetalert2';

import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { DeudaService } from 'src/app/services/deuda/deuda.service';
moment.locale('es');

@Component({
  selector: 'app-formulario-deuda',
  templateUrl: './formulario-deuda.component.html',
  styleUrls: ['./formulario-deuda.component.css'],
})
export class FormularioDeudaComponent implements OnInit {
  // Para validar que la fecha seleccionada no sea anterior a la fecha actual
  fechaActual: string = moment().format('YYYY[-]MM[-]DD');

  deuda: Deuda = new Deuda();

  clienteAsociado: Cliente = new Cliente();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private deudaService: DeudaService
  ) {}

  ngOnInit(): void {
    this.loadClient();
    this.loadDebtData();
  }

  loadClient() {
    this.activatedRoute.paramMap.subscribe((params) => {
      let idCliente: number = +params.get('idCliente')!;

      if (idCliente) {
        this.clienteService.obtenerCliente(idCliente).subscribe((res) => {
          this.clienteAsociado = res;
        });
      }
    });
  }

  // Cargar datos de una deuda específica para permitir su actualización
  loadDebtData() {
    this.activatedRoute.params.subscribe((params) => {
      let idDeuda: number = params['idDeuda'];

      if (idDeuda) {
        this.deudaService.getDebt(idDeuda).subscribe((res) => {
          this.deuda = res;
        });
      }
    });
  }

  registerDebt() {
    this.deuda.cliente = new Cliente();
    this.deuda.cliente.idCliente = this.clienteAsociado.idCliente;

    this.deudaService.registerDebt(this.deuda).subscribe((res) => {
      swal.fire(
        'Deuda creada!',
        'La deuda ha sido registrada existosamente.',
        'success'
      );

      this.router.navigate(['../../clientes/0']);
    });
  }

  // Para actualizar una deuda
  updateDeuda() {
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
          this.deuda.cliente = new Cliente();
          this.deuda.cliente.idCliente = this.clienteAsociado.idCliente;
          this.deudaService.modifyDebt(this.deuda).subscribe(
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
