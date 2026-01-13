import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      const isAdmin = user && user.roles.includes('admin');
      
      if (isAdmin) {
        return true;
      }
      
      return router.parseUrl('/auth/login');
    })
  );
};