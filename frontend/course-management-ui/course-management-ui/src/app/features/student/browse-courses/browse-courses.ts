import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService, Course } from '../../../core/services/course';
import { EnrollmentService, Enrollment } from '../../../core/services/enrollment';
import { Token } from '../../../core/services/token';

@Component({
  selector: 'app-browse-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './browse-courses.html',
  styleUrl: './browse-courses.css'
})
export class BrowseCourses implements OnInit {
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private tokenService = inject(Token);
  private router = inject(Router);

  courses: Course[] = [];
  myEnrollments: Enrollment[] = [];
  searchText: string = '';
  isLoading: boolean = false;
  isEnrollingId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load active courses
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses.filter(c => c.isActive);
        this.loadMyEnrollments();
      },
      error: () => {
        this.errorMessage = 'Failed to load courses.';
        this.isLoading = false;
      }
    });
  }

  private loadMyEnrollments(): void {
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (enrollments) => {
        this.myEnrollments = enrollments;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  isEnrolled(courseId: number): boolean {
    return this.myEnrollments.some(e => e.courseId === courseId);
  }

  get filteredCourses(): Course[] {
    if (!this.searchText.trim()) {
      return this.courses;
    }
    const term = this.searchText.toLowerCase().trim();
    return this.courses.filter(c =>
      c.title.toLowerCase().includes(term) ||
      (c.description && c.description.toLowerCase().includes(term))
    );
  }

  enroll(course: Course): void {
    if (this.isEnrolled(course.id)) return;

    this.isEnrollingId = course.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.enrollmentService.enrollInCourse({ courseId: course.id }).subscribe({
      next: (enrolled) => {
        this.myEnrollments.push(enrolled);
        this.isEnrollingId = null;
        this.successMessage = `Successfully enrolled in "${course.title}"! You can now proceed to pay the fee.`;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to enroll in this course.';
        this.isEnrollingId = null;
      }
    });
  }

  logout(): void {
    this.tokenService.clearSession();
    this.router.navigate(['/student-login']);
  }
}
