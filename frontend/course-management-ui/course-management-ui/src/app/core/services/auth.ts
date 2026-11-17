
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Authentication response from backend
export interface AuthResponse {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  token: string;
}

// Login request
export interface LoginDto {
  email: string;
  password: string;
}

// Registration request
export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5143/api/auth';

  // Student Registration
  registerStudent(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/student/register`,
      dto
    );
  }

  // Student Login
  loginStudent(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/student/login`,
      dto
    );
  }

  // Admin Login
  loginAdmin(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/admin/login`,
      dto
    );
  }
}
