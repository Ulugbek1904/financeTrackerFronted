import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, CreateAccountDto } from '../../features/account/models';
import { ApiUrls } from '../../shared/apiUrl';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl: string;
    constructor(api: ApiUrls, private http: HttpClient) {
      this.apiUrl = api.accountUrl;
    }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}`);
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  createAccount(accountDto: CreateAccountDto) {
    return this.http.post(`${this.apiUrl}/create`,accountDto);
  }

  updateAccount(id: string, accountDto: CreateAccountDto): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}/update-balance`, accountDto);
  }

  deleteAccount(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  setPrimary(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/set-primary/${id}`, null);
  }

  updateBalance(id: string, balance: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, balance);
  }
}
