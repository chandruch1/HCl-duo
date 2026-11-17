
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CourseManagement.Api.Models;

public class Student
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [Phone]
    [MaxLength(15)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(250)]
    public string? Address { get; set; }

    public DateTime? DateOfBirth { get; set; }

    // Navigation property
    [ForeignKey(nameof(UserId))]
    public ApplicationUser? User { get; set; }
}
