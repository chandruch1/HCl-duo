
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService, Student } from '../../../../core/services/student';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList implements OnInit {

  private studentService = inject(StudentService);
  private cdr = inject(ChangeDetectorRef);

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
      console.log('API Response:', response);
      console.log('Is Array:', Array.isArray(response));

      this.students = response;

      console.log('Students:', this.students);
      console.log('Student Count:', this.students.length);

      this.isLoading = false;
      this.cdr.detectChanges();
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
