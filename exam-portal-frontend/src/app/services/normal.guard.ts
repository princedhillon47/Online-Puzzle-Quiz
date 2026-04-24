import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const normalGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Allow access only if logged in AND role is NORMAL
  if (auth.isLoggedIn() && auth.getUserRole() == 'NORMAL') {
    return true;
  }

  // Otherwise, kick them back to login
  router.navigate(['login']);
  return false;
};