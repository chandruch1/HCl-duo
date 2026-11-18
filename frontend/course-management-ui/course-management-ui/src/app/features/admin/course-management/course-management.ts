import { Component } from '@angular/core';
import { CourseList } from './course-list/course-list';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CourseList],
  templateUrl: './course-management.html',
  styleUrl: './course-management.css'
})
export class CourseManagement {}

