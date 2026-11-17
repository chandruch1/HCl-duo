import { Routes } from '@angular/router';

import { StudentLogin } from './features/auth/student-login/student-login';
import { StudentRegister } from './features/auth/student-register/student-register';
import { AdminLogin } from './features/auth/admin-login/admin-login';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'student-login',
    pathMatch: 'full'
  },

  {
    path: 'student-login',
    component: StudentLogin
  },

  {
    path: 'student-register',
    component: StudentRegister
  },

  {
    path: 'admin-login',
    component: AdminLogin
  },

  {
    path: '**',
    redirectTo: 'student-login'
  }

];