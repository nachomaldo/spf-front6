import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.auth.isAuthenticated()) {
      if (this.expiredToken()) {
        this.auth.logout();
        this.router.navigate(['/login']);

        swal.fire(
          'Sesión expirada!',
          'Su sesión a expirado. Por favor, vuelva a iniciar sesión.',
          'warning'
        );

        return false;
      }

      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  expiredToken(): boolean {
    let token = this.auth.token;
    let payload = this.auth.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000;

    if (payload.exp < now) return true;

    return false;
  }
}
