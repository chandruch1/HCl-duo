import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecentActivity {
  type: string;
  description: string;
  timestamp: string;
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentActivities: RecentActivity[];
}

export interface StudentDashboardStats {
  enrolledCoursesCount: number;
  activeCoursesCount: number;
  totalAmountPaid: number;
  studentName: string;
  studentEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5143/api/dashboard';

  getAdminStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.apiUrl}/admin`);
  }

  getStudentStats(): Observable<StudentDashboardStats> {
    return this.http.get<StudentDashboardStats>(`${this.apiUrl}/student`);
  }
}

