import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5192/api';

  constructor(private http: HttpClient) {}

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
       data,{
        responseType: 'text'
       });
  }
}
