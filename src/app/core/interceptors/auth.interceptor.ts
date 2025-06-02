import { HttpClient, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/refresh-token') ||
    req.url.includes('password/reset-password') ||
    req.url.includes('password/forgot-password')
  ) {
    return next(req);
  }

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const expiryDate = localStorage.getItem('expiryDate');

  const isExpired = !expiryDate || new Date() > new Date(expiryDate);
  const isTokenValid = accessToken && refreshToken && !isExpired;

  if (!isTokenValid) {

    if (!refreshToken) {
      localStorage.clear();
      router.navigateByUrl('/home');
      return throwError(() => new Error('Refresh token mavjud emas'));
    }

    return refreshTokenRequest(http, refreshToken).pipe(
      switchMap((newTokens) => {

        localStorage.setItem('accessToken', newTokens.accessToken);
        localStorage.setItem('refreshToken', newTokens.refreshToken);
        localStorage.setItem('expiryDate',
          newTokens.expiryDate || new Date(Date.now() + 30 * 60 * 1000).toISOString()
        );

        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newTokens.accessToken}`
          }
        });

        return next(cloned);
      }),
      catchError((err) => {
        console.error('Token yangilashda xatolik:', err);
        localStorage.clear();
        router.navigateByUrl('/login');
        return throwError(() => new Error('Sessiya tugadi. Qaytadan kiring.'));
      })
    );
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return next(authReq);
};

const refreshTokenRequest = (
  http: HttpClient,
  refreshToken: string
) => {
  return http.post<{
    accessToken: string;
    refreshToken: string;
    expiryDate: string;
  }>('http://localhost:5192/api/auth/refresh-token', { refreshToken });
};
