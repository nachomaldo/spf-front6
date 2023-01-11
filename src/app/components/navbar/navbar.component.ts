import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    swal
      .fire({
        title: 'Cierre de sesión',
        text: '¿Desea cerrar su sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '##2b8a3e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.authService.logout();

          swal.fire(
            `Cierre de sesión`,
            'Ha cerrado sesión correctamente.',
            'success'
          );
          this.router.navigate(['/login']);
        }
      });
  }
}
