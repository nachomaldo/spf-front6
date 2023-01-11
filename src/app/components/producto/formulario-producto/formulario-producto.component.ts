import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { Producto } from 'src/app/classes/producto/producto';
import { ProductoService } from 'src/app/services/producto/producto.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.component.html',
  styleUrls: ['./formulario-producto.component.css'],
})
export class FormularioProductoComponent implements OnInit {
  // Para mapear los datos del producto a crear
  producto: Producto = new Producto();

  // Para manejar la imagen del producto
  imageFile!: File;

  constructor(
    private productoService: ProductoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProducto();
  }

  // Crear el producto
  crearProducto() {
    this.productoService.saveProduct(this.producto).subscribe((res) => {
      this.producto = res;

      if (this.imageFile) this.addImagenProducto(this.producto.codigo, false);
      else {
        swal.fire(
          'Producto creado!',
          'El producto ha sido guardado exitosamente.',
          'success'
        );
      }
    });
  }

  assignImage(event: any) {
    this.imageFile = event.target.files[0];
  }

  // Para añadir la imagen del producto
  addImagenProducto(productCode: number, isModificar: boolean) {
    this.productoService
      .addProductImg(this.imageFile, productCode)
      .subscribe((res) => {
        if (isModificar) {
          swal.fire(
            'Producto actualizado!',
            'El producto ha sido actualizado exitosamente.',
            'success'
          );
        } else {
          swal.fire(
            'Producto creado!',
            'El producto ha sido guardado exitosamente.',
            'success'
          );
        }

        this.router.navigate(['productos/0']);
      });
  }

  // Para cargar los datos de un producto para su actualización
  cargarProducto() {
    this.activatedRoute.params.subscribe((params) => {
      let codigoProducto: number = params['codigoProducto'];

      if (codigoProducto) {
        this.productoService
          .getProductByCode(codigoProducto)
          .subscribe((res) => {
            this.producto = res;
          });
      }
    });
  }

  // Modificar un producto
  actualizarProducto() {
    swal
      .fire({
        title: '¿Guardar cambios?',
        text: '¿Está seguro/a de que desea guardar los cambios ingresados?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '##2b8a3e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.productoService
            .updateProduct(this.producto, this.producto.codigo)
            .subscribe((res) => {
              if (this.imageFile) {
                this.addImagenProducto(this.producto.codigo, true);
              }
              else {
                swal.fire(
                  'Producto actualizado!',
                  'El producto ha sido actualizado exitosamente.',
                  'success'
                );
                this.router.navigate(['productos/0']);
              }
            });
        }
      });
  }
}
