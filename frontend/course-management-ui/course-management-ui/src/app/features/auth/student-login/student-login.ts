import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService, LoginDto } from '../../../core/services/auth';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './student-login.html',
  styleUrl: './student-login.css'
})
export class StudentLogin {

  private authService = inject(AuthService);

  errorMessage = '';
  isSubmitting = false;

  // FormGroup
  loginForm = new FormGroup({

    // FormControls
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required
    ])

  });

  onLogin(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const loginData: LoginDto = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.authService.loginStudent(loginData).subscribe({

      next: (response) => {

        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('userId', response.userId.toString());
        sessionStorage.setItem('role', response.role);
        sessionStorage.setItem('fullName', response.fullName);

        this.isSubmitting = false;
      },

      error: (error) => {

        this.errorMessage =
          error.error?.message || 'Invalid email or password.';

        this.isSubmitting = false;
      }

    });
  }
}