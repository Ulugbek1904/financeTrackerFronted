import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AccountType, CreateAccountDto } from '../../models';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule,
  ],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css'],
})
export class AccountFormComponent implements OnInit {
  accountForm: FormGroup;
  accountTypes: { label: string; value: AccountType }[] = [];

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.accountTypes = Object.keys(AccountType)
      .filter((key) => isNaN(Number(key))) 
      .map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1), 
        value: AccountType[key as keyof typeof AccountType],
      }));

    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      type: [null, Validators.required], 
      balance: [0, [Validators.required, Validators.min(0)]],
      isPrimary: [false],
    });
  }

  ngOnInit(): void {
    if (this.config.data?.account) {
      this.accountForm.patchValue({
        ...this.config.data.account,
        type: this.config.data.account.type, 
      });
    }
  }

  save(): void {
    if (this.accountForm.valid) {
      const accountDto: CreateAccountDto = this.accountForm.value;
      this.ref.close(accountDto);
    }
  }

  cancel(): void {
    this.ref.close();
  }
}