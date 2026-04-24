import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Allow access only if logged in AND role is ADMIN
  if (auth.isLoggedIn() && auth.getUserRole() == 'ADMIN') {
    return true;
  }

  // Otherwise, kick them back to login
  router.navigate(['login']);
  return false;
};