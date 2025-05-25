import { TransactionService } from './../../../../core/services/transaction.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Category } from '../../../category/models';
import { Account } from '../../../account/models/account.model';
import { CategoryService } from '../../../../core/services/category.service';
import { AccountService } from '../../../../core/services/account.service';
import { TransactionCreateDto } from '../../models';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../../../../core/services/data.service';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DialogModule, SelectModule, ButtonModule],
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent {
  @Input() transactionType: 'income' | 'expense' = 'income';
  @Output() formSubmitted = new EventEmitter<void>();

  categories: Category[] = [];
  accounts: Account[] = [];
  form: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private accountService: AccountService,
    private dataService: DataService
  ) {
    this.form = this.formBuilder.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      transactionDate: [new Date(), Validators.required],
      categoryId: [null, Validators.required],
      accountId: [null, Validators.required],
      
    });

    this.loadData();
  }

  get filteredCategories(): Category[] {
    return this.categories.
      filter(cat => this.transactionType === 'income' 
        ? cat.isIncome : !cat.isIncome);
  }

  private loadData() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.accountService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload: TransactionCreateDto = {
      ...this.form.value,
      transactionType: this.transactionType === 'income' ? 0 : 1
    };

    this.transactionService.addTransaction(payload).subscribe({
      next: () => {
        this.form.reset();
        this.dataService.notifyTransactionAdded();
        this.formSubmitted.emit();
      },
      error: (err) => {
        (console.error('Xato:', err), alert('Xato: ' + err.message));
        this.form.reset();
      },
      complete: () => console.log('Transaction added successfully')
      
    });
  }

  onCancel(): void {
    this.form.reset();
  }
}
