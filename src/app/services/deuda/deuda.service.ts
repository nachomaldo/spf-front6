import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Deuda } from 'src/app/classes/deuda/deuda';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DeudaService {
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

  // Para obtener una deuda específica
  getDebt(debtId: number): Observable<Deuda> {
    return this.http.get<Deuda>(`${this.url}deudas/${debtId}`, {
      headers: this.addAuthorization(),
    });
  }

  // Para registrar una deuda
  registerDebt(deuda: Deuda): Observable<Deuda> {
    return this.http.post<Deuda>(`${this.url}deudas`, deuda, {
      headers: this.addAuthorization(),
    });
  }

  // Para modificar una deuda
  modifyDebt(deuda: Deuda): Observable<any> {
    return this.http.put<any>(
      `${this.url}deudas/update/${deuda.idDeuda}`,
      deuda,
      {
        headers: this.addAuthorization(),
      }
    );
  }
}
