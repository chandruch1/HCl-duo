using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Api.DTOs.Payment;

public class PaymentCreateDto
{
    [Required]
    public int EnrollmentId { get; set; }

    [Required]
    [Range(0.01, 1000000)]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = "Card"; // Card, UPI, NetBanking, Cash
}

