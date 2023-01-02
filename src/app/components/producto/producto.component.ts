import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/classes/producto/producto';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProductoService } from 'src/app/services/producto/producto.service';
import { DomSanitizer } from '@angular/platform-browser';

import swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = new Array();

  // Productos inactivos
  productosInactivos: Producto[] = new Array();

  // Para los productos buscados
  productosBuscados: Producto[] = new Array();
  // Para manejar la paginación
  paginador: any;

  // Para entregar la ruta a seguir al paginador
  route: string = '../../productos';

  constructor(
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    public authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Para cargar los productos activos, paginados
  loadProducts() {
    this.activatedRoute.paramMap.subscribe((params) => {
      let pageNumber: number = +params.get('page')!;

      if (!pageNumber) pageNumber = 0;

      this.productoService.getPagedProducts(pageNumber).subscribe((res) => {
        console.log(res);
        this.productos = res.content as Producto[];
        

        this.paginador = res;
        this.productosInactivos = [];
      });
    });
  }

  // Para cargar los productos inactivos, paginados
  loadInactiveProducts() {
    this.productoService.getInactiveProducts().subscribe((res) => {
      this.productosInactivos = res as Producto[];
    });
  }

  // Para buscar productos por su nombre
  searchProducts(nombre: string) {
    this.productoService.searchProducts(nombre).subscribe((res) => {
      this.productosBuscados = res;
    });
  }

  // Para eliminar un producto
  eliminarProducto(producto: Producto) {
    swal
      .fire({
        title: '¿Eliminar producto?',
        text: '¿Está seguro que desea eliminar este producto del sistema?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '##2b8a3e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.productoService.deleteProduct(producto).subscribe((res) => {
            swal.fire(
              'Producto eliminado',
              'El producto ha sido eliminado del sistema exitosamente.',
              'success'
            );

            this.loadProducts();
          });
        }
      });
  }

  // Para reintegrar un producto
  reintegrarProducto(producto: Producto) {
    swal
      .fire({
        title: '¿Reintegrar producto?',
        text: '¿Está seguro de que desea reintegrar este producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '##2b8a3e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.productoService.reintegrarProducto(producto).subscribe((res) => {
            swal.fire(
              'Producto reintegrado!',
              'El producto ha sido reintegrado exitosamente.',
              'success'
            );

            this.loadProducts();
          });
        }
      });
  }

  clearproductosBuscados() {
    this.productosBuscados = [];
  }
}
