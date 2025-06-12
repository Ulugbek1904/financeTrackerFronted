import { TransactionDto } from "../../../core/services/dashboard.service";

export interface ReportFilterDto {
  startDate: Date;
  endDate: Date;
  categoryIds: number[];
  accountIds: string[];
}

export interface FinancialReport {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categories: CategorySummary[];
}

export interface CategorySummary {
  name: string;
  amount: number;
}

export interface ReportResultDto {
  totalIncome: number;
  totalExpense: number;
  transactions: TransactionDto[];
}