import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role: string;
  profilePictureUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:5192/api'; // http://localhost:5192/api/dashboard/summary

  constructor(private http: HttpClient) {}

  getMe(): Observable<User> {
    const token = localStorage.getItem('accessToken'); 
    return this.http.get<User>(`${this.baseUrl}/home/get-me?accessToken=${token}`);
  }

  
}
