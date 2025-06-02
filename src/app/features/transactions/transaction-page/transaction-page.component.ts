import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TransactionService } from '../../../core/services/transaction.service';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Transaction, TransactionQueryDto } from '../models';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { CategoryService } from '../../../core/services/category.service';
import { AccountService } from '../../../core/services/account.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DataService } from '../../../core/services/data.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-transaction-page',
  imports: [ TableModule, SelectModule, CommonModule, DialogModule, DatePickerModule, ButtonModule, ReactiveFormsModule,
          RadioButtonModule, FormsModule
  ],
  templateUrl: './transaction-page.component.html',
  styleUrl: './transaction-page.component.css'
})
export class TransactionPageComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  selectedTransactions: Transaction[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  displayFilter: boolean = false;
  private destroy$ = new Subject<void>();
  search: string = '';
  searchTimeout: any;

  transactionService = inject(TransactionService);
  categoryServise = inject(CategoryService);
  accountService = inject(AccountService);
  categories: any[] = [];
  accounts: any[] = []; 
  filterForm: FormGroup;
  exportTransactions() {
    this.transactionService.exportTransactions().subscribe({
    next: (blob: Blob) => {
      const fileName = `Mening-Tranzaktsiyalarim-${new Date().toISOString().slice(0,10)}.csv`;
      
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error('Export xatolik:', error);
    }
  });
  }

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService  
  ) {
    this.filterForm = this.formBuilder.group({
      isIncome: [null],
      categoryId: [null],
      accountId: [null],
      startDate: [null],
      endDate: [null],
    })
  }

  ngOnInit() {
    this.categoryServise.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map(category => ({
          label: category.name,
          value: category.id,
        }))
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts.map(account => ({
          label: account.name,
          value: account.id,
        }))
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      }
    });

    this.dataService.transactionAdded$.pipe(
      takeUntil(this.destroy$)).subscribe(() => {
      this.loadTransactions({first: 0, rows: 11 });
    })

  }

  loadTransactions(event: any) {
    this.loading = true;
    
    const filterValues = this.filterForm.value;
    const query: TransactionQueryDto = {
      pageNumber: Math.floor(event.first / event.rows) + 1, 
      pageSize: event.rows,
      sortBy: event.sortField || null,
      isDescending: event.sortOrder === 1 ? true : (event.sortOrder === 1 ? false : undefined),
      search: this.search.trim() || undefined,
      ...filterValues,
    };

    this.transactionService.getTransactions(query).subscribe({
      next: (response) => {
        this.transactions = response.items;
        this.totalRecords = response.totalCount;
        this.loading = false; 
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.loading = false;
      }
    });
  }

  openFilter() {
    this.displayFilter = true;
  }

  applyFilter() {
    this.displayFilter = false;
    this.loadTransactions({ first: 0, rows: 10 });
  }

  clearFilter() {
    this.filterForm.reset();
    this.applyFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearSearch() {
    this.search = '';
    this.loadTransactions({ first: 0, rows: 10 });
  }

  onSearchChange() {
    if( this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.loadTransactions({ first: 0, rows: 10 });
    }, 500); 
  }

  getTotalIncome(): number {
  return this.selectedTransactions
    .filter(t =>t && t.transactionType === 0)
    .reduce((sum, t) => sum + t.amount, 0);
}

  getTotalExpense(): number {
    return this.selectedTransactions
      .filter(t => t && t.transactionType === 1)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  trackByTransactionId(index: number, transaction: Transaction): string {
    return transaction.id;
  }

  deleteSelected() {
    const confirmed = confirm(`${this.selectedTransactions.length} ta tranzaksiyani o‘chirmoqchimisiz?`);
    if (!confirmed) return;

    const deleteCalls = this.selectedTransactions.map(t =>
      this.transactionService.deleteTransaction(t.id)
    );

    forkJoin(deleteCalls).subscribe({
      next: () => {
        this.selectedTransactions = [];
        this.loadTransactions({ first: 0, rows: 10 });
      },
      error: (err) => {
        console.error('O‘chirishda xatolik:', err);
      }
    });
  }

}
