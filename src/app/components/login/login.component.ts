import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/classes/usuario/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  title: string = 'Sistema de pedidos facilito';

  usuario!: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      swal.fire(
        `Hola ${this.authService.usuario.nombre}!`,
        'Ya estás autenticado',
        'info'
      );
      this.router.navigate(['']);
    }
  }

  login() {
    if (this.usuario.username == null || this.usuario.password == null) {
      swal.fire(
        'Error al iniciar sesión',
        'Nombre de usuario o contraseña no válidos!',
        'error'
      );

      return;
    }

    this.authService.login(this.usuario).subscribe((response) => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;

      this.router.navigate(['']);

      swal.fire(
        `Bienvenid@ ${usuario.nombre}!`,
        'Has iniciado sesión correctamente.',
        'success'
      );
    }, error => {
      if (error.status == 400) {
        swal.fire(
          'Error al iniciar sesión',
          'Nombre de usuario o contraseña incorrecta.',
          'error'
        );
      } else if (error.status == 401) {
        swal.fire(
          'Error al iniciar sesión',
          'Nombre de usuario o contraseña incorrecta.',
          'error'
        );
      }
    });
  }
}
