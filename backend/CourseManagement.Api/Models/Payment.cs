using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CourseManagement.Api.Models;

public class Payment
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int EnrollmentId { get; set; }

    [ForeignKey(nameof(EnrollmentId))]
    public Enrollment? Enrollment { get; set; }

    [Required]
    [Range(0, 1000000)]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = "Card";

    [MaxLength(100)]
    public string TransactionId { get; set; } = string.Empty;

    public DateTime PaidAt { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(30)]
    public string Status { get; set; } = "Success";
}

