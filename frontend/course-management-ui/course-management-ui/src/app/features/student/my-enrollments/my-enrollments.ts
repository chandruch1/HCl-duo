import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EnrollmentService, Enrollment } from '../../../core/services/enrollment';
import { PaymentService, Payment, PaymentCreateDto } from '../../../core/services/payment';
import { Token } from '../../../core/services/token';

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './my-enrollments.html',
  styleUrl: './my-enrollments.css'
})
export class MyEnrollments implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private paymentService = inject(PaymentService);
  private tokenService = inject(Token);
  private router = inject(Router);

  enrollments: Enrollment[] = [];
  payments: Payment[] = [];
  activeTab: 'enrollments' | 'payments' = 'enrollments';

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Payment Modal State
  selectedEnrollment: Enrollment | null = null;
  paymentMethod: string = 'Card';
  isProcessingPayment: boolean = false;
  paymentSuccessReceipt: Payment | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.enrollmentService.getMyEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.loadPayments();
      },
      error: () => {
        this.errorMessage = 'Failed to load your enrollments.';
        this.isLoading = false;
      }
    });
  }

  private loadPayments(): void {
    this.paymentService.getMyPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openPaymentModal(enrollment: Enrollment): void {
    this.selectedEnrollment = enrollment;
    this.paymentMethod = 'Card';
    this.paymentSuccessReceipt = null;
  }

  closePaymentModal(): void {
    this.selectedEnrollment = null;
    this.paymentSuccessReceipt = null;
  }

  submitPayment(): void {
    if (!this.selectedEnrollment) return;

    this.isProcessingPayment = true;
    this.errorMessage = '';

    const dto: PaymentCreateDto = {
      enrollmentId: this.selectedEnrollment.id,
      amount: this.selectedEnrollment.coursePrice,
      paymentMethod: this.paymentMethod
    };

    this.paymentService.processPayment(dto).subscribe({
      next: (receipt) => {
        this.isProcessingPayment = false;
        this.paymentSuccessReceipt = receipt;
        this.successMessage = `Payment of ₹${receipt.amount} successful! Transaction ID: ${receipt.transactionId}`;
        this.loadData();
      },
      error: (err) => {
        this.isProcessingPayment = false;
        this.errorMessage = err.error?.message || 'Payment processing failed. Please try again.';
      }
    });
  }

  logout(): void {
    this.tokenService.clearSession();
    this.router.navigate(['/student-login']);
  }
}
