import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EnrollmentService, Enrollment } from '../../../../core/services/enrollment';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.css'
})
export class EnrollmentList implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private cdr = inject(ChangeDetectorRef);

  enrollments: Enrollment[] = [];
  searchText: string = '';
  statusFilter: string = 'ALL';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load enrollments. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredEnrollments(): Enrollment[] {
    let list = this.enrollments;

    if (this.statusFilter !== 'ALL') {
      list = list.filter(e => e.status.toUpperCase() === this.statusFilter);
    }

    if (this.searchText.trim()) {
      const term = this.searchText.toLowerCase().trim();
      list = list.filter(e =>
        e.studentName.toLowerCase().includes(term) ||
        e.studentEmail.toLowerCase().includes(term) ||
        e.courseTitle.toLowerCase().includes(term) ||
        e.status.toLowerCase().includes(term)
      );
    }

    return list;
  }

  updateStatus(enrollment: Enrollment, newStatus: string): void {
    if (enrollment.status === newStatus) return;

    this.enrollmentService.updateStatus(enrollment.id, { status: newStatus }).subscribe({
      next: (updated) => {
        enrollment.status = updated.status;
        this.successMessage = `Enrollment status updated to ${newStatus}.`;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update enrollment status.';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  deleteEnrollment(id: number): void {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      this.enrollmentService.deleteEnrollment(id).subscribe({
        next: () => {
          this.successMessage = 'Enrollment deleted successfully.';
          this.loadEnrollments();
          this.cdr.detectChanges();
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete enrollment.';
          this.cdr.detectChanges();
          setTimeout(() => {
            this.errorMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        }
      });
    }
  }
}
