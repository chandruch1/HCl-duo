
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  StudentService,
  Student
} from '../../../../core/services/student';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList implements OnInit {

  private studentService = inject(StudentService);

  students: Student[] = [];

  searchText = '';

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadStudents();
  }

  // Load all students
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

  // Filter students by name, email or phone
  get filteredStudents(): Student[] {

    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      return this.students;
    }

    return this.students.filter(student =>

      student.fullName.toLowerCase().includes(search) ||

      student.email.toLowerCase().includes(search) ||

      student.phone.toLowerCase().includes(search)

    );
  }

}
