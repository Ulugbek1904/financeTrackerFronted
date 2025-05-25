export interface Category {
  id: number;
  name: string;
  isIncome: boolean;
  isDefault: boolean;
  userId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}