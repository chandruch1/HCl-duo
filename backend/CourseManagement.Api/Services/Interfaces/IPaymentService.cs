using CourseManagement.Api.DTOs.Payment;

namespace CourseManagement.Api.Services.Interfaces;

public interface IPaymentService
{
    Task<IEnumerable<PaymentResponseDto>> GetAllPaymentsAsync();
    Task<IEnumerable<PaymentResponseDto>> GetMyPaymentsAsync(int userId);
    Task<PaymentResponseDto?> GetPaymentByIdAsync(int id);
    Task<PaymentResponseDto> ProcessPaymentAsync(int userId, PaymentCreateDto dto);
}

