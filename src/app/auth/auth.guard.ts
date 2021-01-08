import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.loggedIn$;
  }
}
