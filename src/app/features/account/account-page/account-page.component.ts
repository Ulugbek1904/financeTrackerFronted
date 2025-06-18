import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { Account, AccountType, CreateAccountDto } from '../models';
import { ButtonModule } from 'primeng/button';
import { AccountFormComponent } from '../components/account-form/account-form.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountService } from '../../../core/services/account.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-account-page',
  imports: [DropdownModule, InputNumberModule, ButtonModule, CommonModule, ToastModule, TableModule],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.css',
  providers: [MessageService, DialogService]
})
export class AccountPageComponent {

  showSuccess(message: string): void {
    this.messageService.add({severity: 'success', summary: 'Success', detail: message});
  }

  showError(message: string): void {
    this.messageService.add({severity: 'error', summary: 'Error', detail: message});
  }

  showConfirm(message: string): any {
    this.messageService.add({severity: 'warning', summary: "Warning", detail: message})
  }

  accounts: Account[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(
    private accountService: AccountService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => (this.accounts = accounts),
      error: () => this.showError("Failed to load accounts")
    });
  }

  getAccountTypeName(type: AccountType): string {
    return AccountType[type];
  }
  openCreateDialog(): void {
    this.ref = this.dialogService.open(AccountFormComponent, {
      header: 'Create Account',
      width: '30%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' }
    });

    this.ref.onClose.subscribe((accountDto: CreateAccountDto) => {
      if (accountDto) {
        this.accountService.createAccount(accountDto).subscribe({
          next: () => {
            this.showSuccess("Account created");
            this.loadAccounts();
          },
          error: () => this.showError("Failed to create account")
        });
      }
    });

    this,this.loadAccounts();
  }

  openEditDialog(account: Account): void {
    this.ref = this.dialogService.open(AccountFormComponent, {
      header: 'Edit Account',
      width: '30%',
      data: { account },
      contentStyle: { 'max-height': '500px', overflow: 'auto' }
    });

    this.ref.onClose.subscribe((accountDto: CreateAccountDto) => {
      if (accountDto) {
        this.accountService.updateAccount(account.id, accountDto).subscribe({
          next: () => {
            this.showSuccess("Account updated");
            this.loadAccounts();
          },
          error: () => this.showError("Failed to update account")
        });
      }
    });
  }

  deleteAccount(id: string): void {
    if(confirm("are u sure!!! bu akkauntga bog'langan tranzaksiyalar ham o'chib ketadi?")){
      this.accountService.deleteAccount(id).subscribe({
        next: () => {
          this.showSuccess("Account deleted");
          this.loadAccounts();
        },
        error: () => this.showError("Failed to delete account")
      });
    }
  }

  setPrimary(id: string): void {
    this.accountService.setPrimary(id).subscribe({
      next: () => {
        this.showSuccess("Primary account set");
        this.loadAccounts();
      },
      error: () => this.showError("Failed to set primary account")
    });
  }

  updateBalance(id: string, balance: number): void {
    this.accountService.updateBalance(id, balance).subscribe({
      next: () => {
        this.showSuccess("Balance updated");
        this.loadAccounts();
      },
      error: () => this.showError("Failed to update balance")
    });
  }
}
