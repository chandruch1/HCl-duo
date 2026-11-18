
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService, LoginDto } from '../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { Token } from '../../../core/services/token';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './student-login.html',
  styleUrl: './student-login.css'
})
export class StudentLogin {

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

    this.authService.loginStudent(loginData).subscribe({

      next: (response) => {

        this.tokenService.saveSession(response);

        this.isSubmitting = false;

        this.router.navigate(['/student/dashboard']);
      },

      error: (error) => {

        this.errorMessage =
          error.error?.message || 'Invalid email or password.';

        this.isSubmitting = false;
      }

    });
  }
}
