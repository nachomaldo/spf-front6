import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/classes/cliente/cliente';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  url: string = 'https://spf-backend.rj.r.appspot.com/api/';

  // Headers
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Para solicitar la autorización de acceso a un recurso del backend mediante token
  private addAuthorization() {
    let token = this.authService.token;

    if (token != null && token != '') {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return this.httpHeaders;
  }

  // Obtener todos los clientes, paginados
  obtenerClientesPaginados(pageNumber: number): Observable<any> {
    return this.http.get<any>(`${this.url}clientes/get/page/${pageNumber}`, {
      headers: this.addAuthorization(),
    });
  }

  // Obtener todos los clientes inactivos, paginados
  obtenerClientesInactivos(): Observable<any> {
    return this.http.get<any>(
      `${this.url}clientes/get/inactive`,
      {
        headers: this.addAuthorization(),
      }
    );
  }

  // Obtener un cliente específico
  obtenerCliente(idCliente: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}clientes/${idCliente}`, {
      headers: this.addAuthorization(),
    });
  }

  // Guardar un nuevo cliente
  guardarCliente(client: Cliente): Observable<any> {
    return this.http.post<Cliente>(`${this.url}clientes`, client, {
      headers: this.addAuthorization(),
    });
  }

  // Buscar un cliente activo por su nombre
  buscarCliente(name: string): Observable<any> {
    let params = new HttpParams().set('nombre', name);
    return this.http.get<Cliente[]>(`${this.url}clientes/get/by-name`, {
      params,
      headers: this.addAuthorization(),
    });
  }

  // Buscar un cliente inactivo por su nombre
  buscarClienteInactivo(name: string): Observable<any> {
    let params = new HttpParams().set('nombre', name);
    return this.http.get<Cliente[]>(
      `${this.url}clientes/get/inactive/by-name`,
      {
        params,
        headers: this.addAuthorization(),
      }
    );
  }

  // Modificar un cliente
  modificarCliente(idCliente: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.url}clientes/update/${idCliente}`,
      cliente,
      { headers: this.addAuthorization() }
    );
  }

  // Eliminar un cliente
  eliminarCliente(cliente: Cliente): Observable<any> {
    return this.http.put<any>(
      `${this.url}clientes/delete/${cliente.idCliente}`,
      cliente,
      { headers: this.addAuthorization() }
    );
  }

  // Reintegrar cliente
  reintegrarCliente(cliente: Cliente): Observable<any> {
    return this.http.put(
      `${this.url}clientes/integrate/${cliente.idCliente}`,
      cliente,
      { headers: this.addAuthorization() }
    );
  }
}
