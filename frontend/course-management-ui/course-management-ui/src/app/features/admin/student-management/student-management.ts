import { Component } from '@angular/core';
import { StudentList } from './student-list/student-list';

@Component({
  imports: [StudentList],
  selector: 'app-student-management',
  styleUrl: './student-management.css',
  templateUrl: './student-management.html',
})
export class StudentManagement {}
