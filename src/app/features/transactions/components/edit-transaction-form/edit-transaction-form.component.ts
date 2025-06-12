import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction, TransactionCreateDto } from '../../models';
import { CategoryService } from '../../../../core/services/category.service';
import { AccountService } from '../../../../core/services/account.service';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './edit-transaction-form.component.html',
  styleUrls: ['./edit-transaction-form.component.css'],
})
export class EditTransactionFormComponent implements OnInit, OnChanges {
  @Input() transaction: Transaction | null = null;
  @Output() formSubmitted = new EventEmitter<TransactionCreateDto>();
  @Output() cancel = new EventEmitter<void>();

  editForm: FormGroup;
  transactionTypes = [
    { label: 'Kirim', value: 0 },
    { label: 'Chiqim', value: 1 },
  ];
  categories: { label: string; value: number }[] = [];
  accounts: { label: string; value: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private accountService: AccountService
  ) {
    this.editForm = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      transactionDate: [new Date(), Validators.required],
      categoryId: [null, Validators.required],
      accountId: [null, Validators.required],
      transactionType: [0, Validators.required],
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadAccounts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transaction'] && this.transaction) {
      this.populateForm();
    }
  }

  private loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map((category) => ({
          label: category.name,
          value: category.id,
        }));
        this.populateForm(); 
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  private loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts.map((account) => ({
          label: account.name,
          value: account.id,
        }));
        this.populateForm();
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      },
    });
  }

  private populateForm() {
    if (!this.transaction || !this.categories.length || !this.accounts.length) {
      return; 
    }

    const matchingCategory = this.categories.find(
      (cat) => cat.label === this.transaction?.categoryName
    );
    const matchingAccount = this.accounts.find(
      (acc) => acc.label === this.transaction?.accountName
    );

    this.editForm.patchValue({
      description: this.transaction.description || '',
      amount: this.transaction.amount || 0,
      transactionDate: this.transaction.transactionDate ? new Date(this.transaction.transactionDate) : new Date(),
      categoryId: matchingCategory ? matchingCategory.value : null,
      accountId: matchingAccount ? matchingAccount.value : null,
      transactionType: this.transaction.transactionType || 0,
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      const dto: TransactionCreateDto = {
        ...this.editForm.value,
        transactionDate: this.editForm.value.transactionDate.toISOString(),
      };
      this.formSubmitted.emit(dto);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}