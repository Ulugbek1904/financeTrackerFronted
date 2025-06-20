import { HttpClient, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, tap, throwError } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

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

  const isExpired = !expiryDate || isNaN(new Date(expiryDate).getTime()) || new Date() > new Date(expiryDate);
  const isTokenValid = accessToken && refreshToken && !isExpired;

  if (isTokenValid) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return next(authReq);
  }

  if (!refreshToken) {
    localStorage.clear();
    router.navigateByUrl('/home');
    return throwError(() => new Error('Refresh token mavjud emas'));
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return refreshTokenRequest(http, refreshToken).pipe(
      switchMap((newTokens) => {
        localStorage.setItem('accessToken', newTokens.accessToken);
        localStorage.setItem('refreshToken', newTokens.refreshToken);
        localStorage.setItem('expiryDate', newTokens.accessTokenExpiryDate);
        refreshTokenSubject.next(newTokens.accessToken);
        isRefreshing = false;

        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newTokens.accessToken}`
          }
        });
        return next(cloned);
      }),
      catchError((err) => {
        console.error('Token yangilashda xatolik:', err);
        isRefreshing = false;
        refreshTokenSubject.next(null);
        localStorage.clear();
        router.navigateByUrl('/login');
        return throwError(() => new Error('Sessiya tugadi. Qaytadan kiring.'));
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((newToken) => {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next(cloned);
      })
    );
  }
};

const refreshTokenRequest = (http: HttpClient, refreshToken: string) => {
  return http.post<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpiryDate: string;
  }>('https://financetrackerbackend-1tp6.onrender.com/api/auth/refresh-token', { refreshToken }).pipe(
    tap(response => console.log('Refresh Response:', response))
  );
};
