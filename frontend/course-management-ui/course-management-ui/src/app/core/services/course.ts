import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id: number;
  title: string;
  description: string | null;
  price: number;
  durationInDays: number;
  isActive: boolean;
  createdAt: string;
}

export interface CourseCreateDto {
  title: string;
  description: string | null;
  price: number;
  durationInDays: number;
}

export interface CourseUpdateDto {
  title: string;
  description: string | null;
  price: number;
  durationInDays: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5143/api/Course';

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(dto: CourseCreateDto): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, dto);
  }

  updateCourse(id: number, dto: CourseUpdateDto): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, dto);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

