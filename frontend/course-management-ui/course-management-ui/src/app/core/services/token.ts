import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Token {

  private readonly TOKEN_KEY = 'token';
  private readonly ROLE_KEY = 'role';
  private readonly USER_ID_KEY = 'userId';
  private readonly FULL_NAME_KEY = 'fullName';

  // Save login information
  saveSession(response: {
    token: string;
    role: string;
    userId: number;
    fullName: string;
  }): void {
    sessionStorage.setItem(this.TOKEN_KEY, response.token);
    sessionStorage.setItem(this.ROLE_KEY, response.role);
    sessionStorage.setItem(this.USER_ID_KEY, response.userId.toString());
    sessionStorage.setItem(this.FULL_NAME_KEY, response.fullName);
  }

  // Get token
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  // Get user role
  getRole(): string | null {
    return sessionStorage.getItem(this.ROLE_KEY);
  }

  // Get user name
  getFullName(): string | null {
    return sessionStorage.getItem(this.FULL_NAME_KEY);
  }

  // Get user ID
  getUserId(): string | null {
    return sessionStorage.getItem(this.USER_ID_KEY);
  }

  // Check login status
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Clear session
  clearSession(): void {
    sessionStorage.clear();
  }
}