import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  router = inject(Router)
  forgotForm;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotForm.get('email');
  }

  onSubmit() {
  if (this.forgotForm.valid) {
    const email = this.forgotForm.value.email!;
    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        console.log("Success response:", res);
        alert("Kod emailingizga yuborildi");
        this.router.navigateByUrl('/reset-password');
      },
      error: (err) => {
        console.error("Error:", err);
        alert("Xatolik yuz berdi. Emailni tekshiring.");
      }
    });
  }
}

}
