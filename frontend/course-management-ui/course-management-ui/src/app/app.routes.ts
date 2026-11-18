import { Routes } from '@angular/router';

import { StudentLogin } from './features/auth/student-login/student-login';
import { StudentRegister } from './features/auth/student-register/student-register';
import { AdminLogin } from './features/auth/admin-login/admin-login';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';

import { adminAuthGuard } from './core/guards/admin-auth-guard';
import { studentAuthGuard } from './core/guards/student-auth-guard';

import { StudentManagement } from './features/admin/student-management/student-management';
import { StudentDetails } from './features/admin/student-management/student-details/student-details';
import { StudentEdit } from './features/admin/student-management/student-edit/student-edit';

import { CourseManagement } from './features/admin/course-management/course-management';
import { CourseForm } from './features/admin/course-management/course-form/course-form';
import { EnrollmentList } from './features/admin/enrollment-management/enrollment-list/enrollment-list';
import { PaymentList } from './features/admin/payment-management/payment-list/payment-list';

import { StudentDashboard } from './features/student/student-dashboard/student-dashboard';
import { BrowseCourses } from './features/student/browse-courses/browse-courses';
import { MyEnrollments } from './features/student/my-enrollments/my-enrollments';
import { StudentProfile } from './features/student/student-profile/student-profile';

export const routes: Routes = [
  { path: '', redirectTo: 'student-login', pathMatch: 'full' },

  { path: 'student-login', component: StudentLogin },
  { path: 'student-register', component: StudentRegister },
  { path: 'admin-login', component: AdminLogin },

  // Admin Routes (Protected by adminAuthGuard)
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin/students',
    component: StudentManagement,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin/students/edit/:id',
    component: StudentEdit,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin/students/:id',
    component: StudentDetails,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin/courses',
    component: CourseManagement,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin/courses/create',
    component: CourseForm,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin/courses/edit/:id',
    component: CourseForm,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin/enrollments',
    component: EnrollmentList,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin/payments',
    component: PaymentList,
    canActivate: [adminAuthGuard]
  },

  // Student Routes (Protected by studentAuthGuard)
  {
    path: 'student/dashboard',
    component: StudentDashboard,
    canActivate: [studentAuthGuard]
  },
  {
    path: 'student/courses',
    component: BrowseCourses,
    canActivate: [studentAuthGuard]
  },
  {
    path: 'student/enrollments',
    component: MyEnrollments,
    canActivate: [studentAuthGuard]
  },
  {
    path: 'student/profile',
    component: StudentProfile,
    canActivate: [studentAuthGuard]
  },

  { path: '**', redirectTo: 'student-login' }
];
