import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Budget, BudgetDto, BudgetStats } from '../../features/budget/models';
import { Observable } from 'rxjs';
import { TransactionDto } from './dashboard.service';
import { ApiUrls } from '../../shared/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl: string;
  private transactionApiUrl : string 
  constructor(api: ApiUrls, private http: HttpClient) {
    this.apiUrl = api.budgetUrl;
    this.transactionApiUrl = api.transactionUrl;
  }

  getAllBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/all`);
  }

  getBudgetById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/get/${id}`);
  }

  createBudget(budget: BudgetDto): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiUrl}/add`, budget);
  }

  updateBudget(id: string, budget: BudgetDto): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/update/${id}`, budget);
  }

  deleteBudget(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getBudgetStats(budgetId: string): Observable<BudgetStats> {
    return this.http.get<BudgetStats>(`${this.apiUrl}/stats/${budgetId}`);
  }

  getTransactionsByBudget(startDate: Date | string, endDate: Date | string, categoryId: number): Observable<TransactionDto[]> {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format provided');
    }

    return this.http.get<TransactionDto[]>(
        `${this.transactionApiUrl}/by-budget`,
        {
            params: {
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                categoryId: categoryId.toString()
            }
        }
    );
}
}
