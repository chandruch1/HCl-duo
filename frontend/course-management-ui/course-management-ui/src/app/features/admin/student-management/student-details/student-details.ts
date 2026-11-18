
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService, Student } from '../../../../core/services/student';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [RouterLink,DatePipe],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css'
})
export class StudentDetails implements OnInit {

  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);

  student: Student | null = null;

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || isNaN(id)) {
      this.errorMessage = 'Invalid student ID.';
      return;
    }

    this.loadStudent(id);
  }

  loadStudent(id: number): void {

    this.isLoading = true;

    this.studentService.getStudentById(id).subscribe({

      next: (response) => {
        this.student = response;
        this.isLoading = false;
      },

      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to load student details.';

        this.isLoading = false;
      }

    });
  }
}
