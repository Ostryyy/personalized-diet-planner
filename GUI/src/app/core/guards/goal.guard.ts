import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

export const goalGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    await firstValueFrom(authService.initUserProfile());

    const user = await firstValueFrom(authService.currentUser$);
    if (user?.goalsSet) {
      return true;
    } else {
      return router.createUrlTree(['/user-informations']);
    }
  } catch (error) {
    console.error('Error in goalGuard:', error);
    return router.createUrlTree(['/login']);
  }
};
