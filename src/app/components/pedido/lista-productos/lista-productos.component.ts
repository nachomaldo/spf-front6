import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/classes/producto/producto';
import { CarritoService } from 'src/app/services/carrito/carrito.service';
import { ProductoService } from 'src/app/services/producto/producto.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css'],
})
export class ListaProductosComponent implements OnInit {
  title: string = '';
  productos: Producto[] = [];
  carrito: Producto[] = [];

  // Para manejar la paginación
  paginador: any;

  // Para entregar la ruta a seguir al paginador
  route!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProductsFromCategory();
    // this.loadCart();
  }

  // Para cargar los productos paginados de una categoría específica
  loadProductsFromCategory() {
    this.activatedRoute.paramMap.subscribe((params) => {
      let pageNumber: number = +params.get('page')!;

      // TODO: Probar funcionalidad 
      let category: string = params.get('categoria')!;

      this.title = this.definePageTitle(category);

      if (!pageNumber) pageNumber = 0;

      this.productoService
        .getProductsFromCategory(category, pageNumber)
        .subscribe((res) => {
          this.productos = res.content as Producto[];
          this.paginador = res;
          this.route = `../../../productos/${category}`
        });

      // this.productoService.getProductsFromCategoryList(category).subscribe(res => {
      //   this.productos = res;

      //   this.productos.forEach(p => {
      //     p.imageBytes = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + p.imageBytes);
      //   });
      // });
    });

    // this.productos = this.productoService.getMockedProductos();
  }

  // Para cargar el carrito de compras
  // loadCart() {
  //   let cartFromService: Producto[] = this.carritoService.getCart();

  //   if (cartFromService.length > 0) {
  //     this.carrito = cartFromService;
  //   }
  // }

  // Para agregar productos al carrito
  // addToCart(product: Producto, quantity: number) {
  //   if (this.carrito.includes(product)) {
  //     this.carrito.map((productInCart) => {
  //       if (productInCart.codigo === product.codigo) {
  //         productInCart.cantidad += quantity;
  //       }
  //     });

  //     return;
  //   }

  //   product.cantidad = quantity;
  //   this.carrito.push(product);
  //   this.toastr.success(
  //     `${quantity} producto(s) agregado(s)`,
  //     `${product.nombre}`
  //   );
  // }

  // Para agregar productos al carrito usando el servicio CarritoService
  addToCart(product: Producto, quantity: number) {
    if (this.carritoService.addToCart(product, quantity)) {
      this.toastr.success(
        `${quantity} producto(s) agregado(s)`,
        `${product.nombre}`
      );
    } 
    else {
      this.toastr.error(
        `No se pudo agregar el producto al carrito. Intente nuevamente.`,
        `Error`
      );
    }
  }

  // Para remover productos del carrito usando el servicio CarritoService
  removeProduct(product: Producto) {
    Swal.fire({
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
        }
      }
    });
  }

  // Para remover productos del carrito
  // removeProduct(product: Producto) {
  //   Swal.fire({
  //     title: '¿Eliminar producto?',
  //     text: '¿Desea remover el producto del carrito de compras?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#2b8a3e',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sí, elimínalo',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // Para setear la cantidad del producto en 0
  //       this.carrito.map((productInCart) => {
  //         if (productInCart.codigo === product.codigo) {
  //           productInCart.cantidad = 0;
  //         }
  //       });

  //       // Remueve el producto del carrito
  //       let index = this.carrito.findIndex(
  //         (val) => val.codigo === product.codigo
  //       );
  //       this.carrito.splice(index, 1);

  //       this.toastr.error(
  //         `Producto(s) removido(s) del carrito.`,
  //         `Producto eliminado`
  //       );
  //     }
  //   });
  // }

  // Para guardar los productos seleccionados en el carrito
  // setupCarrito() {
  //   this.carritoService.setupCart(this.carrito);
  //   this.router.navigate(['carrito-producto']);
  // }

  // Para definir el título de la página
  private definePageTitle(category: string): string {
    switch (category) {
      case 'alimento-perro': {
        return 'Alimentos para perros';
      }

      case 'alimento-gato': {
        return 'Alimentos para gatos';
      }

      case 'antiparasitarios': {
        return 'Antiparasitarios y antipulgas';
      }

      case 'higiene': {
        return 'Higiene para mascotas';
      }

      case 'accesorios': {
        return 'Accesorios para mascotas';
      }
    }

    return 'Productos';
  }
}
