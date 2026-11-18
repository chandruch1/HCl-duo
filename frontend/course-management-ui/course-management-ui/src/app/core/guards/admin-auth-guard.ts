
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Token } from '../services/token';

export const adminAuthGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const tokenService = inject(Token);

  // Check whether the user is logged in
  if (!tokenService.isLoggedIn()) {
    return router.createUrlTree(['/admin-login']);
  }

  // Check whether the user is an Admin
  if (tokenService.getRole() !== 'Admin') {
    return router.createUrlTree(['/student-login']);
  }

  return true;
};
