export interface Transaction {
  id: string;
  description: string;
  amount: number;
  transactionDate: Date;
  transactionType: TransactionType;
  categoryName: string;
  accountName: string;
}

export interface TransactionCreateDto {
  description: string;
  amount: number;
  transactionDate: Date;
  transactionType: TransactionType;
  categoryId?: number;
  accountId: string;
}

export interface TransactionQueryDto {
  isIncome?: boolean;
  categoryId?: number;
  accountId?: string;
  sortBy?: string;
  isDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
  startDate?: Date;
  endDate?: Date;
}

export enum TransactionType {
  Income = 0,
  Expense = 1
}
