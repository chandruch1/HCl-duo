import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseService, Course } from '../../../../core/services/course';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList implements OnInit {
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);

  courses: Course[] = [];
  searchText: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load courses. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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

  deleteCourse(id: number, title: string): void {
    if (confirm(`Are you sure you want to deactivate the course "${title}"?`)) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.successMessage = `Course "${title}" deactivated successfully.`;
          this.loadCourses();
          this.cdr.detectChanges();
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 4000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to deactivate course.';
          this.cdr.detectChanges();
          setTimeout(() => {
            this.errorMessage = '';
            this.cdr.detectChanges();
          }, 4000);
        }
      });
    }
  }
}
