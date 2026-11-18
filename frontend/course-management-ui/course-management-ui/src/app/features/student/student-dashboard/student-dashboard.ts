import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Token } from '../../../core/services/token';
import { DashboardService, StudentDashboardStats } from '../../../core/services/dashboard';
import { EnrollmentService, Enrollment } from '../../../core/services/enrollment';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboard implements OnInit {
  private tokenService = inject(Token);
  private dashboardService = inject(DashboardService);
  private enrollmentService = inject(EnrollmentService);
  private router = inject(Router);

  studentName: string = '';
  stats: StudentDashboardStats | null = null;
  myEnrollments: Enrollment[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    this.studentName = this.tokenService.getFullName() || 'Student';
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getStudentStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loadEnrollments();
      },
      error: () => {
        this.loadEnrollments();
      }
    });
  }

  private loadEnrollments(): void {
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

  logout(): void {
    this.tokenService.clearSession();
    this.router.navigate(['/student-login']);
  }
}
