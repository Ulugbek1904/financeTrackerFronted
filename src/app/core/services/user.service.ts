import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../shared/apiUrl';

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
  private apiUrl: string;
    constructor(api: ApiUrls, private http: HttpClient) {
      this.apiUrl = api.userUrl;
    }

  getMe(): Observable<User> {
    const token = localStorage.getItem('accessToken'); 
    return this.http.get<User>(`${this.apiUrl}/home/get-me?accessToken=${token}`);
  }

  
}
