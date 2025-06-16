import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { Budget, BudgetDto, BudgetStats } from '../models';
import { Category } from '../../category/models';
import { BudgetService } from '../../../core/services/budget.service';
import { CategoryService } from '../../../core/services/category.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { TransactionDto } from '../../../core/services/dashboard.service';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-budget-page',
    imports: [CommonModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        ToastModule,
        DialogModule,
        InputTextModule,
        InputNumberModule,
        CalendarModule,
        SelectModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        ProgressBarModule],
    templateUrl: './budget-page.component.html',
    styleUrl: './budget-page.component.css'
})
export class BudgetPageComponent {
    budgets: Budget[] = [];
    categories: Category[] = [];
    budgetForm!: FormGroup;
    isEditMode = false;
    selectedBudgetId: string | null = null;
    displayBudgetDialog = false;
    displayDetailsDialog = false;
    selectedBudget: Budget | null = null;
    transactions: TransactionDto[] = [];
    budgetStats: BudgetStats | null = null;
    loading = false;

    constructor(
        private budgetService: BudgetService,
        private categoryService: CategoryService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.loadCategories();
        this.loadBudgets();
    }

    initForm(): void {
        this.budgetForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            limitAmount: ['', [Validators.required, Validators.min(0)]],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            categoryId: ['', Validators.required]
        });
    }

    loadCategories(): void {
        this.categoryService.getAllCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: () => {
                this.showError('Failed to load categories');
            }
        });
    }

    loadBudgets(): void {
        this.loading = true;
        this.budgetService.getAllBudgets().subscribe({
            next: (budgets) => {
                this.budgets = budgets;
                this.loading = false;
            },
            error: () => {
                this.showError('Failed to load budgets');
                this.loading = false;
            }
        });
    }

    openBudgetDialog(budget?: Budget): void {
        this.isEditMode = !!budget;
        if (budget) {
            this.selectedBudgetId = budget.id;
            this.budgetForm.patchValue({
                name: budget.name,
                limitAmount: budget.limitAmount,
                startDate: new Date(budget.startDate),
                endDate: new Date(budget.endDate),
                categoryId: budget.categoryId
            });
        } else {
            this.budgetForm.reset();
            this.selectedBudgetId = null;
        }
        this.displayBudgetDialog = true;
    }

    saveBudget(): void {
        if (this.budgetForm.invalid) {
            this.budgetForm.markAllAsTouched();
            return;
        }

        const budgetDto: BudgetDto = this.budgetForm.value;
        const operation: Observable<Budget> = this.isEditMode
            ? this.budgetService.updateBudget(this.selectedBudgetId!, budgetDto)
            : this.budgetService.createBudget(budgetDto);

        operation.subscribe({
            next: () => {
                this.showSucces(`Budget ${this.isEditMode ? 'updated' : 'created'} successfully`);
                this.loadBudgets();
                this.displayBudgetDialog = false;
            },
            error: () => {
                this.showError(`Failed to ${this.isEditMode ? 'update' : 'create'} budget`);
            }
        });
    }

    deleteBudget(budget: Budget) {
        this.confirmationService.confirm({
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            message: `Are you sure you want to delete the budget '${budget.name}'?`,
            accept: () => {
                this.budgetService.deleteBudget(budget.id).subscribe({
                    next: () => {
                        this.showSucces('Budget deleted successfully');
                        this.loadBudgets();
                    },
                    error: () => {
                        this.showError('Failed to delete budget');
                    }
                });
            }
        });
    }

    openDetailsDialog(budget: Budget) {
        this.selectedBudget = budget;
        this.loading = true;
        this.budgetService.getTransactionsByBudget(
            budget.startDate instanceof Date ? budget.startDate : new Date(budget.startDate),
            budget.endDate instanceof Date ? budget.endDate : new Date(budget.endDate),
            budget.categoryId
        ).subscribe({
            next: (transactions) => {
                this.transactions = transactions;
                this.budgetService.getBudgetStats(budget.id).subscribe({
                    next: (stats) => {
                        this.budgetStats = stats;
                        this.displayDetailsDialog = true;
                        this.loading = false;
                    },
                    error: () => {
                        this.showError('Failed to load budget stats');
                        this.loading = false;
                    }
                });
            },
            error: () => {
                this.showError('Failed to load transactions');
                this.loading = false;
            }
        });
    }

    closeBudgetDialog(): void {
        this.displayBudgetDialog = false;
        this.budgetForm.reset();
        this.isEditMode = false;
        this.selectedBudgetId = null;
    }

    closeDetailsDialog(): void {
        this.displayDetailsDialog = false;
        this.selectedBudget = null;
        this.transactions = [];
        this.budgetStats = null;
    }

    showSucces(message: string): void {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
    }
    showError(message: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
    }
    showInfo(message: string): void {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
    }
    showWarn(message: string): void {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: message });
    }


}
