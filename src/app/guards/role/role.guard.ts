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
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    let roles = route.data['role'] as string[];
    let hasRole = false;

    roles.forEach((role) => {
      if (this.auth.hasRole(role)) hasRole = true;
    });

    if (hasRole) return true;

    swal.fire(
      'Acceso denegado!',
      `${this.auth.usuario.nombre}, no posees acceso a esta información.`,
      'warning'
    );

    this.router.navigate(['']);
    return false;
  }
}
