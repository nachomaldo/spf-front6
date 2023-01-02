import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { FormularioPedidoComponent } from './components/formulario-pedido/formulario-pedido.component';
import { ListaPedidosComponent } from './components/lista-pedidos/lista-pedidos.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CategoriaProductoComponent } from './components/pedido/categoria-producto/categoria-producto.component';
import { CarritoProductosComponent } from './components/pedido/carrito-productos/carrito-productos.component';
import { ListaProductosComponent } from './components/pedido/lista-productos/lista-productos.component';
import { ProductoComponent } from './components/producto/producto.component';
import { FormularioProductoComponent } from './components/producto/formulario-producto/formulario-producto.component';
import { PaginadorComponent } from './components/paginador/paginador.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { FormularioDeudaComponent } from './components/formulario-deuda/formulario-deuda.component';
import { FormularioClientesComponent } from './components/clientes/formulario-clientes/formulario-clientes.component';
import { LoginComponent } from './components/login/login.component';

import { AuthGuard } from './guards/auth/auth.guard';
import { RoleGuard } from './guards/role/role.guard';

const routes = [
  { path: '', component: ListaPedidosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR', 'ROLE_REPARTIDOR'] } },
  { path: 'nuevo-pedido', component: FormularioPedidoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR'] } },
  { path: 'modificar-pedido/:idPedido', component: FormularioPedidoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR'] } },
  { path: 'seleccion-categoria', component: CategoriaProductoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR'] } },
  { path: 'productos/:categoria/:page', component: ListaProductosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR'] } },
  { path: 'carrito-producto', component: CarritoProductosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR'] } },
  { path: 'productos/:page', component: ProductoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR', 'ROLE_REPARTIDOR'] } },
  { path: 'nuevo-producto', component: FormularioProductoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR'] } },
  { path: 'modificar-producto/:codigoProducto', component: FormularioProductoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR'] }},
  { path: 'clientes/:page', component: ClientesComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR', 'ROLE_REPARTIDOR'] } },
  { path: 'nueva-deuda/:idCliente', component: FormularioDeudaComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR'] } },
  { path: 'modificar-cliente/:idCliente', component: FormularioClientesComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR'] } },
  { path: 'modificar-deuda/:idDeuda', component: FormularioDeudaComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_OPERADOR'] } },
  { path: 'login', component: LoginComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    FormularioPedidoComponent,
    ListaPedidosComponent,
    NavbarComponent,
    CategoriaProductoComponent,
    CarritoProductosComponent,
    ListaProductosComponent,
    ProductoComponent,
    FormularioProductoComponent,
    PaginadorComponent,
    ClientesComponent,
    FormularioDeudaComponent,
    FormularioClientesComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
