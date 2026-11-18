
import { Component, inject, OnInit } from '@angular/core';
import { StudentService, Student } from '../../../../core/services/student';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList implements OnInit {

  private studentService = inject(StudentService);

  students: Student[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.studentService.getAllStudents().subscribe({

      next: (response) => {
        this.students = response;
        this.isLoading = false;
      },

      error: (error) => {
        console.error('Error loading students:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load students.';

        this.isLoading = false;
      }

    });
  }
}
