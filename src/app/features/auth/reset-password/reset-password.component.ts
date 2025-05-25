import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otpCode: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      const emailFromQuery = params['email'];
      if (emailFromQuery) {
        this.resetForm.patchValue({ email: emailFromQuery });
      }
    });
  }

  get email() { return this.resetForm.get('email'); }
  get otpCode() { return this.resetForm.get('otpCode'); }
  get newPassword() { return this.resetForm.get('newPassword'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }

  onSubmit() {
    if (this.resetForm.invalid) return;

    const { email, otpCode, newPassword, confirmPassword } = this.resetForm.value;

    if (newPassword !== confirmPassword) {
      alert("Parollar mos emas");
      return;
    }

    if (!email || !otpCode || !newPassword) {
      alert("Barcha maydonlarni to'ldiring.");
      return;
    }

    this.authService.resetPassword({ email, otpCode, newPassword }).subscribe({
      next: () => {
        alert("Parolingiz muvaffaqiyatli yangilandi");
        this.router.navigate(['/login']);
      },
      error: () => {
        alert("Xatolik. Kod yoki email noto‘g‘ri.");
      }
    });
  }
}
