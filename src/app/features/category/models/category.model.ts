export interface Category {
  id: number;
  name: string;
  isIncome: boolean;
  isDefault: boolean;
  userId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryDto {
  name: string;
  isIncome: boolean;
}