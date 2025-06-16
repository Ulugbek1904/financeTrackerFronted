export interface BudgetDto {
    name: string;
    limitAmount: number;
    startDate: Date;
    endDate: Date;
    categoryId: number;
}

export interface Budget {
    id: string;
    name: string;
    limitAmount: number;
    startDate: Date;
    endDate: Date;
    categoryId: number;
    categoryName: string;
}

export interface BudgetStats {
    totalSpent: number;
    remainingAmount: number;
    limitAmount: number;
}