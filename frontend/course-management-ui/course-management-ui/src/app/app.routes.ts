import { Routes } from '@angular/router';

import { StudentLogin } from './features/auth/student-login/student-login';
import { StudentRegister } from './features/auth/student-register/student-register';
import { AdminLogin } from './features/auth/admin-login/admin-login';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { adminAuthGuard } from './core/guards/admin-auth-guard';
import { StudentManagement } from './features/admin/student-management/student-management';

export const routes: Routes = [
  { path: '', redirectTo: 'student-login', pathMatch: 'full' },

  { path: 'student-login', component: StudentLogin },
  { path: 'student-register', component: StudentRegister },
  { path: 'admin-login', component: AdminLogin },

  { path: 'admin/dashboard', component: AdminDashboard , canActivate : [adminAuthGuard] },
  {
  path: 'admin/students', component: StudentManagement, canActivate: [adminAuthGuard]},

  { path: '**', redirectTo: 'student-login' }
];