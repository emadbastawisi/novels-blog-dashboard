import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  if (authService.isLoggedInGuard) {
    return true;
  }
  else {
    toastr.warning("You must login first");
    router.navigate(['/login']);
    return false;
  }
};