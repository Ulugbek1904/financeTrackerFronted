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
    constructor(api: ApiUrls, private http: HttpClient) {
      this.apiUrl = api.authUrl;
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

  getTransactionsByBudget(startDate: Date, endDate: Date, categoryId: number): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(
      `http://localhost:5192/api/transaction/by-budget`,
      {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          categoryId: categoryId.toString()
        }
      }
    );
}
}
