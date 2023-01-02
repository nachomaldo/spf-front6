import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/classes/usuario/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL principal del backend
  url: string = "https://spf-backend.rj.r.appspot.com/oauth/token";

  private _usuario!: Usuario;
  private _token!: string;

  constructor( private http: HttpClient) { }

  get usuario(): Usuario {
    if (this._usuario != null) return this._usuario;

    else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')!) as Usuario;
      return this._usuario;
    }

    return new Usuario();
  }

  get token(): string {
    if (this._token != null) return this._token;

    else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token')!;
      return this._token;
    }

    return '';
  }

  login(usuario: Usuario): Observable<any> {
    const credenciales = btoa("spf-front" + ":" + "12345");
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    return this.http.post<any>(`${this.url}`, params.toString(), { headers: httpHeaders });
  }

  guardarUsuario(accessToken: string) {
    let payload = this.obtenerDatosToken(accessToken);

    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string) {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null && accessToken != '') {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }

    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);

    if (payload != null && payload.user_name && payload.user_name.length > 0) return true;
    
    return false;
  }

  hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) return true;

    return false;
  }

  logout() {
    this._token = null!;
    this._usuario = null!;

    sessionStorage.clear();
  }
}
