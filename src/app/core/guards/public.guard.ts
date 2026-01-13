import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const publicGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const targetUrl = authService.getRedirectUrl();
    return router.parseUrl(targetUrl);
  }

  return true;
};