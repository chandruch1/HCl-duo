import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Token } from '../services/token';

export const studentAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(Token);

  if (!tokenService.isLoggedIn()) {
    return router.createUrlTree(['/student-login']);
  }

  if (tokenService.getRole() !== 'Student') {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return true;
};

