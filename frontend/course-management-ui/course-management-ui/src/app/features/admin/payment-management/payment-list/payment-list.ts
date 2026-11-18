import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaymentService, Payment } from '../../../../core/services/payment';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.css'
})
export class PaymentList implements OnInit {
  private paymentService = inject(PaymentService);
  private cdr = inject(ChangeDetectorRef);

  payments: Payment[] = [];
  searchText: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load payments.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get totalRevenue(): number {
    return this.payments
      .filter(p => p.status === 'Success')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  get filteredPayments(): Payment[] {
    if (!this.searchText.trim()) {
      return this.payments;
    }
    const term = this.searchText.toLowerCase().trim();
    return this.payments.filter(p =>
      p.studentName.toLowerCase().includes(term) ||
      p.studentEmail.toLowerCase().includes(term) ||
      p.courseTitle.toLowerCase().includes(term) ||
      p.transactionId.toLowerCase().includes(term) ||
      p.paymentMethod.toLowerCase().includes(term)
    );
  }
}
