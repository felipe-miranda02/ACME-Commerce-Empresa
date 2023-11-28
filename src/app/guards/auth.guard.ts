import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService: AuthenticationService = inject(AuthenticationService);
  const router: Router = inject(Router);

  if (authService.isUserAuthenticated()) {
    return true;
  }

  console.log(' UNAUTHORIZED!!!!');

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};
