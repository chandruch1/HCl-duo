import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Enrollment {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  courseId: number;
  courseTitle: string;
  coursePrice: number;
  enrolledAt: string;
  status: string;
  paymentStatus: string;
  paymentId: number | null;
}

export interface EnrollmentCreateDto {
  courseId: number;
}

export interface EnrollmentStatusUpdateDto {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5143/api/Enrollment';

  getAllEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.apiUrl);
  }

  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/my`);
  }

  getEnrollmentById(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.apiUrl}/${id}`);
  }

  enrollInCourse(dto: EnrollmentCreateDto): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.apiUrl, dto);
  }

  updateStatus(id: number, dto: EnrollmentStatusUpdateDto): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}/${id}/status`, dto);
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

