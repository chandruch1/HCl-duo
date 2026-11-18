
import { Component, inject } from '@angular/core';

import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import {
  AuthService,
  RegisterDto
} from '../../../core/services/auth';

import { Token } from '../../../core/services/token';

// Custom password matching validator
const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword
    ? null
    : { passwordMismatch: true };
};

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './student-register.html',
  styleUrl: './student-register.css'
})
export class StudentRegister {

  private authService = inject(AuthService);
  private tokenService = inject(Token);
  private router = inject(Router);

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;

  // Registration Form
  registerForm = new FormGroup({

    fullName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2)
      ]
    }),

    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    }),

    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    })

  }, {
    validators: passwordMatchValidator
  });

  // Password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Student Registration
  onRegister(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.registerForm.getRawValue();

    const registerData: RegisterDto = {
      fullName: formValue.fullName,
      email: formValue.email,
      password: formValue.password
    };

    this.authService.registerStudent(registerData).subscribe({

      next: (response) => {

        // Save session using Token Service
        this.tokenService.saveSession(response);

        this.successMessage = 'Registration successful!';

        this.isSubmitting = false;

        this.registerForm.reset();

        // Navigate to Student Dashboard
        this.router.navigate(['/student/dashboard']);
      },

      error: (error) => {

        this.errorMessage =
          error.error?.message || 'Registration failed.';

        this.isSubmitting = false;
      }

    });
  }
}
