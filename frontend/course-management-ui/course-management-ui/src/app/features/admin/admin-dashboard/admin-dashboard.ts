import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Token } from '../../../core/services/token';
import { DashboardService, AdminDashboardStats } from '../../../core/services/dashboard';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private tokenService = inject(Token);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  adminName: string = '';
  stats: AdminDashboardStats | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    this.adminName = this.tokenService.getFullName() || 'Admin';
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.dashboardService.getAdminStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load dashboard statistics.';
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.tokenService.clearSession();
    this.router.navigate(['/admin-login']);
  }
}
