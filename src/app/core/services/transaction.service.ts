import { Transaction } from './../../features/transactions/models/transaction.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionCreateDto, TransactionQueryDto } from '../../features/transactions/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = 'http://localhost:5192/api/transaction';

  constructor(private http: HttpClient) {}

  addTransaction(dto: TransactionCreateDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, dto);
  }

  getTransactions(query: TransactionQueryDto): Observable<{
    data: Transaction[],
    totalCount: number,
    pageNumber: number,
    pageSize: number
  }> {
    let params = new HttpParams();
    if(query.startDate) params = params.set('startDate', query.startDate.toISOString());
    if (query.endDate)   params = params.set('endDate', query.endDate.toISOString());
    if (query.accountId != null) params = params.set('accountId', query.accountId.toString());
    if (query.categoryId != null) params = params.set('categoryId', query.categoryId.toString());
    if (query.isIncome != null) params = params.set('isIncome', query.isIncome.toString());
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.isDescending != null) params = params.set('isDescending', query.isDescending.toString());
    if (query.pageNumber != null) params = params.set('pageNumber', query.pageNumber.toString());
    if (query.pageSize != null) params = params.set('pageSize', query.pageSize.toString());

    return this.http.get<
      {data: Transaction[], totalCount: number, pageNumber: number, pageSize: number}>
        (`${this.apiUrl}/all`, { params });
  }

  exportTransactions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
  }
}