import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  monthlySummary: MonthlySummary[];
  accountSummaries: AccountSummaries[];
  recentTransactions: TransactionDto[];
  topCategories: Category[];
  }

export interface MonthlySummary {
  month: string;
  totalIncome: number;
  totalExpense: number;
}

export interface AccountSummaries {
  accountName: string;
  totalBalance: number;
}

export interface TransactionDto {
  description: string;
  amount: number;
  transactionDate: string;
  transactionType: number;
  categoryName: string;
  accountName: string;
}

export interface Category {
  name: string;
  amount: number;
}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:5192/api';

  http = inject(HttpClient)

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard/summary`);
  }
}
