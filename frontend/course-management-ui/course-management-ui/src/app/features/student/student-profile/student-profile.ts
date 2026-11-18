import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService, Student, UpdateStudentDto } from '../../../core/services/student';
import { Token } from '../../../core/services/token';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css'
})
export class StudentProfile implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private tokenService = inject(Token);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  student: Student | null = null;
  profileForm!: FormGroup;
  isEditing: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      phone: ['', [Validators.required, Validators.maxLength(15)]],
      address: ['', [Validators.maxLength(250)]],
      dateOfBirth: ['']
    });
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.studentService.getMyProfile().subscribe({
      next: (data) => {
        this.student = data;
        let formattedDob = '';
        if (data.dateOfBirth) {
          formattedDob = data.dateOfBirth.split('T')[0];
        }
        this.profileForm.patchValue({
          phone: data.phone,
          address: data.address || '',
          dateOfBirth: formattedDob
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load profile details.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const formValues = this.profileForm.value;
    const dto: UpdateStudentDto = {
      phone: formValues.phone.trim(),
      address: formValues.address ? formValues.address.trim() : null,
      dateOfBirth: formValues.dateOfBirth ? formValues.dateOfBirth : null
    };

    this.studentService.updateMyProfile(dto).subscribe({
      next: (updated) => {
        this.student = updated;
        this.isSubmitting = false;
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update profile.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.tokenService.clearSession();
    this.router.navigate(['/student-login']);
  }
}
