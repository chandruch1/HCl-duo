
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, LoginDto } from '../../../core/services/auth';
import { Token } from '../../../core/services/token';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {

  private authService = inject(AuthService);
  private tokenService = inject(Token);
  private router = inject(Router);

  errorMessage = '';
  isSubmitting = false;
  showPassword = false;

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const loginData: LoginDto = this.loginForm.getRawValue();

    this.authService.loginAdmin(loginData).subscribe({

      next: response => {

        // Save session using Token Service
        this.tokenService.saveSession(response);

        this.isSubmitting = false;

        // Navigate to Admin Dashboard
        this.router.navigate(['/admin/dashboard']);
      },

      error: error => {

        this.errorMessage =
          error.error?.message || 'Invalid admin credentials.';

        this.isSubmitting = false;
      }

    });
  }
}
