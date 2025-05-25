import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../features/account/models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl = 'http://localhost:5192/api';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/accounts`);
  }
}
