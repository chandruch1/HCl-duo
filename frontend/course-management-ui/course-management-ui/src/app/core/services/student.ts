
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Student response model
export interface Student {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string | null;
  dateOfBirth: string | null;
}

// Student update model
export interface UpdateStudentDto {
  phone: string;
  address: string | null;
  dateOfBirth: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5143/api/Student';

  // Get logged-in student's profile
  getMyProfile(): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/me`);
  }

  // Get all students (Admin)
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // Get student by ID (Admin)
  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  // Update logged-in student's profile
  updateMyProfile(dto: UpdateStudentDto): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/me`, dto);
  }

}
