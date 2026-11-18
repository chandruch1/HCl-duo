using CourseManagement.Api.DTOs.Payment;
using CourseManagement.Api.Models;
using CourseManagement.Api.Repositories.Interfaces;
using CourseManagement.Api.Services.Interfaces;

namespace CourseManagement.Api.Services.Implementations;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly IStudentRepository _studentRepository;

    public PaymentService(
        IPaymentRepository paymentRepository,
        IEnrollmentRepository enrollmentRepository,
        IStudentRepository studentRepository)
    {
        _paymentRepository = paymentRepository;
        _enrollmentRepository = enrollmentRepository;
        _studentRepository = studentRepository;
    }

    public async Task<IEnumerable<PaymentResponseDto>> GetAllPaymentsAsync()
    {
        var payments = await _paymentRepository.GetAllAsync();
        return payments.Select(MapToResponseDto);
    }

    public async Task<IEnumerable<PaymentResponseDto>> GetMyPaymentsAsync(int userId)
    {
        var student = await _studentRepository.GetByUserIdAsync(userId);
        if (student == null)
            throw new KeyNotFoundException("Student profile not found.");

        var payments = await _paymentRepository.GetByStudentIdAsync(student.Id);
        return payments.Select(MapToResponseDto);
    }

    public async Task<PaymentResponseDto?> GetPaymentByIdAsync(int id)
    {
        var payment = await _paymentRepository.GetByIdAsync(id);
        return payment == null ? null : MapToResponseDto(payment);
    }

    public async Task<PaymentResponseDto> ProcessPaymentAsync(int userId, PaymentCreateDto dto)
    {
        var student = await _studentRepository.GetByUserIdAsync(userId);
        if (student == null)
            throw new KeyNotFoundException("Student profile not found.");

        var enrollment = await _enrollmentRepository.GetByIdAsync(dto.EnrollmentId);
        if (enrollment == null)
            throw new KeyNotFoundException("Enrollment not found.");

        if (enrollment.StudentId != student.Id)
            throw new UnauthorizedAccessException("You cannot make a payment for someone else's enrollment.");

        var payment = new Payment
        {
            EnrollmentId = dto.EnrollmentId,
            Amount = dto.Amount,
            PaymentMethod = dto.PaymentMethod,
            TransactionId = "TXN" + DateTime.UtcNow.ToString("yyyyMMddHHmmss") + Random.Shared.Next(100, 999),
            PaidAt = DateTime.UtcNow,
            Status = "Success"
        };

        var created = await _paymentRepository.CreateAsync(payment);

        // Update enrollment status to Active upon successful payment
        if (enrollment.Status == "Pending")
        {
            enrollment.Status = "Active";
            await _enrollmentRepository.UpdateAsync(enrollment);
        }

        var loaded = await _paymentRepository.GetByIdAsync(created.Id);
        return MapToResponseDto(loaded ?? created);
    }

    private static PaymentResponseDto MapToResponseDto(Payment payment)
    {
        return new PaymentResponseDto
        {
            Id = payment.Id,
            EnrollmentId = payment.EnrollmentId,
            StudentName = payment.Enrollment?.Student?.User?.FullName ?? string.Empty,
            StudentEmail = payment.Enrollment?.Student?.User?.Email ?? string.Empty,
            CourseTitle = payment.Enrollment?.Course?.Title ?? string.Empty,
            Amount = payment.Amount,
            PaymentMethod = payment.PaymentMethod,
            TransactionId = payment.TransactionId,
            PaidAt = payment.PaidAt,
            Status = payment.Status
        };
    }
}

