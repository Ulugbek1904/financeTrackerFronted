import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const router = inject(Router);
    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.navigateByUrl('/login');
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;

    if (allowedRoles.includes(userRole)) {
      return true;  
    }

    router.navigateByUrl('/unauthorized'); 
    return false;
  };
}
