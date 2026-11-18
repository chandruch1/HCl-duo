
import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { StudentService, Student } from '../../../../core/services/student';

@Component({
  selector: 'app-student-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './student-edit.html',
  styleUrl: './student-edit.css'
})
export class StudentEdit implements OnInit {

  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  student: Student | null = null;

  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  editForm = new FormGroup({

    phone: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(15)
      ]
    }),

    address: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(250)]
    }),

    dateOfBirth: new FormControl('', {
      nonNullable: true
    })

  });

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || isNaN(id)) {
      this.errorMessage = 'Invalid student ID.';
      return;
    }

    this.loadStudent(id);
  }

  // Load student information
  loadStudent(id: number): void {

    this.isLoading = true;

    this.studentService.getStudentById(id).subscribe({

      next: (response) => {

        this.student = response;

        this.editForm.patchValue({
          phone: response.phone,
          address: response.address ?? '',
          dateOfBirth: response.dateOfBirth
            ? response.dateOfBirth.substring(0, 10)
            : ''
        });

        this.isLoading = false;
      },

      error: (error) => {

        this.errorMessage =
          error.error?.message || 'Unable to load student.';

        this.isLoading = false;
      }

    });
  }

  goBack(): void {
    this.router.navigate(['/admin/students']);
  }

}
