import { Injectable } from '@angular/core';
import { Pedido } from 'src/app/classes/pedido/pedido';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  // URL principal del backend
  url: string = "https://spf-backend.rj.r.appspot.com/api/"

  // Para manejar el límite de pedidos
  // limitePedidos: number = 5;

  // Headers
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Para solicitar la autorización de acceso a un recurso del backend mediante token
  private addAuthorization() {
    let token = this.authService.token;

    if (token != null && token != '') {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return this.httpHeaders;
  }

  // Crear un nuevo pedido
  crearNuevoPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.url}pedidos`, pedido, {
      headers: this.addAuthorization(),
    });
  }

  // Para realizar una compra rápida
  compraRapida(pedido: Pedido): Observable<any> {
    return this.http.put<Pedido>(`${this.url}pedidos/rapida`, pedido, {
      headers: this.addAuthorization(),
    });
  }

  // Obtener los pedidos del día actual
  obtenerPedidosDelDia(fecha: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.url}pedidos/get/${fecha}`, {
      headers: this.addAuthorization(),
    });
  }

  // Obtener un pedido específico por su ID
  obtenerPedido(idPedido: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.url}pedidos/${idPedido}`, {
      headers: this.addAuthorization(),
    });
  }

  // Actualizar un pedido
  modificarPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.url}pedidos/update/${pedido.idPedido}`, pedido, {
      headers: this.addAuthorization(),
    });
  }

  // Eliminar (eliminación física) un pedido
  eliminarPedido(idPedido: number): Observable<String> {
    return this.http.delete<String>(`${this.url}pedidos/delete/${idPedido}`, {
      headers: this.addAuthorization(),
    });
  }

  // Para setear el límite de pedidos
  // setPedidosLimit(limit: number) {
  //   this.limitePedidos = limit;
  // }

  // Para retornar el límite de pedidos seteado actualmente
  // getPedidosLimit(): number {
  //   return this.limitePedidos;
  // }
}
