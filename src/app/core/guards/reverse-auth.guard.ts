import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const reverseAuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  const accessToken = localStorage.getItem("accessToken");
  const expiryDate = localStorage.getItem("expiryDate");

  const isExpired = expiryDate ? new Date() > new Date(expiryDate) : true;

  if (accessToken && !isExpired) {
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};
