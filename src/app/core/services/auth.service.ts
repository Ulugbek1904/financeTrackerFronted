import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrls } from '../../shared/apiUrl';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl: string;
  constructor(api: ApiUrls) {
    this.apiUrl = api.authUrl;
  }
  http = inject(HttpClient);
  router = inject(Router);

  forgotPassword(email: string) {
    return this.http.post(
      `${this.apiUrl}/password/forgot-password`,
      {},
      {
        params: { email },
        responseType: 'text'
      }
    );
  }

  resetPassword(data: { email: string; otpCode: string; newPassword: string }) {
    return this.http.post(
      `${this.apiUrl}/password/reset-password`,
      data, {
      responseType: 'text'
    });
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>('http://localhost:5192/api/auth/login', credentials);
  }

  getUserRole():string {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return '';
    }
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      return payload["role"];
    }
    catch (error) {
      console.error('Error parsing token payload:', error);
      return '';
    }
  }

  getUserName(): string {
    const token = localStorage.getItem('accessToken');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    } catch {
      return '';
    }
  }

  logout() {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
    next: (res: any) => {
      console.log('Logout successful:', res);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("expiryDate");

      this.router.navigateByUrl('login');
    },
    error: (err: any) => {
      console.error('Logout failed:', err);
    }
  });
  }

}
