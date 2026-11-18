import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService, CourseCreateDto, CourseUpdateDto } from '../../../../core/services/course';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './course-form.html',
  styleUrl: './course-form.css'
})
export class CourseForm implements OnInit {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courseForm!: FormGroup;
  isEditMode: boolean = false;
  courseId: number | null = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.courseId = Number(idParam);
      this.loadCourse(this.courseId);
    }
  }

  private initForm(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      description: ['', [Validators.maxLength(1000)]],
      price: [0, [Validators.required, Validators.min(0), Validators.max(1000000)]],
      durationInDays: [30, [Validators.required, Validators.min(1), Validators.max(3650)]]
    });
  }

  private loadCourse(id: number): void {
    this.isLoading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          title: course.title,
          description: course.description || '',
          price: course.price,
          durationInDays: course.durationInDays
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load course details.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValues = this.courseForm.value;

    if (this.isEditMode && this.courseId) {
      const updateDto: CourseUpdateDto = {
        title: formValues.title.trim(),
        description: formValues.description ? formValues.description.trim() : null,
        price: Number(formValues.price),
        durationInDays: Number(formValues.durationInDays)
      };

      this.courseService.updateCourse(this.courseId, updateDto).subscribe({
        next: () => {
          this.successMessage = 'Course updated successfully!';
          this.isSubmitting = false;
          setTimeout(() => this.router.navigate(['/admin/courses']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update course.';
          this.isSubmitting = false;
        }
      });
    } else {
      const createDto: CourseCreateDto = {
        title: formValues.title.trim(),
        description: formValues.description ? formValues.description.trim() : null,
        price: Number(formValues.price),
        durationInDays: Number(formValues.durationInDays)
      };

      this.courseService.createCourse(createDto).subscribe({
        next: () => {
          this.successMessage = 'Course created successfully!';
          this.isSubmitting = false;
          setTimeout(() => this.router.navigate(['/admin/courses']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to create course.';
          this.isSubmitting = false;
        }
      });
    }
  }
}

