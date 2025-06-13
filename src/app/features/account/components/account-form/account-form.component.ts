import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CreateAccountDto } from '../../models';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-account-form',
  imports: [ReactiveFormsModule, CommonModule, ButtonModule, InputNumberModule, FormsModule, DropdownModule, CheckboxModule],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css',
  providers: []
})
export class AccountFormComponent {
  accountForm: FormGroup;
  accountTypes = [
    { label: 'Checking', value: 'Checking' },
    { label: 'Savings', value: 'Savings' },
    { label: 'Credit', value: 'Credit' }
  ];

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      balance: [0, [Validators.required, Validators.min(0)]],
      isPrimary: [false]
    });
  }

  ngOnInit(): void {
    if (this.config.data?.account) {
      this.accountForm.patchValue(this.config.data.account);
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
