import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetForm;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otpCode: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    const { email, otpCode, newPassword, confirmPassword } = this.resetForm.value;

    if (newPassword !== confirmPassword) {
      alert("Parollar mos emas");
      return;
    }

    this.authService.resetPassword({
      email: this.resetForm.value.email!,
      otpCode: this.resetForm.value.otpCode!,
      newPassword: this.resetForm.value.newPassword!}).subscribe({
          next: () => alert("Parolingiz muvaffaqiyatli yangilandi"),
          error: () => alert("Xatolik. Kod yoki email noto‘g‘ri.")
    });

  }
}
