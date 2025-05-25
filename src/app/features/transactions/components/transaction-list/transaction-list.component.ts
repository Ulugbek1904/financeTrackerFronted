import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Transaction, TransactionQueryDto } from '../../models';
import { TransactionService } from '../../../../core/services/transaction.service';
import { CategoryService } from '../../../../core/services/category.service';
import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-transaction-list',
  imports: [SelectModule, DatePickerModule, ButtonModule, TableModule, CommonModule, DialogModule,
    FormsModule, 
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  totalRecords = 0;
  selectedTransactions: Transaction[] = [];
  
  // Reactive form for advanced filters
  filterForm: FormGroup;
  displayFilter = false;
  
  searchTerm = '';
  selectedYear: number | null = null;
  query: TransactionQueryDto = { pageNumber: 0, pageSize: 10 };

  categories = []; // to hold {label,value} for category filter
  accounts = [];   // to hold {label,value} for account filter

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,  // assume provided
    private accountService: AccountService    // assume provided
  ) {
    // Initialize filter form fields
    this.filterForm = new FormGroup({
      isIncome: new FormControl(null),
      categoryId: new FormControl(null),
      accountId: new FormControl(null),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
    });
  }

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe(data => {
    });
    this.accountService.getAccounts().subscribe(data => {
    });

    // Initial load of transactions
    this.loadTransactions();
  }

  loadTransactions(event?: any) {
    // Handle pagination and sorting from PrimeNG onLazyLoad event
    if (event) {
      this.query.pageNumber = event.first / event.rows;
      this.query.pageSize = event.rows;
      if (event.sortField) {
      }
    }

    const f = this.filterForm.value;
    this.query.isIncome = f.isIncome;
    this.query.categoryId = f.categoryId;
    this.query.accountId = f.accountId;
    this.query.startDate = f.startDate;
    this.query.endDate = f.endDate;

    this.transactionService.getTransactions(this.query).subscribe((res:any) => {
      this.transactions = res.data;
      this.totalRecords = res.totalCount;
      this.query.pageNumber = res.pageNumber;
      this.query.pageSize = res.pageSize;
    });
  }

  applyFilter() {
    this.displayFilter = false;
    this.query.pageNumber = 0;
    this.loadTransactions();
  }

  clearFilter() {
    this.filterForm.reset();
    this.applyFilter();
  }

  openFilter() {
    this.displayFilter = true;
  }

  exportTransactions() {
    console.log('Export transactions', this.selectedTransactions);
  }

  importTransactions() {
    console.log('Import transactions');
  }
}
