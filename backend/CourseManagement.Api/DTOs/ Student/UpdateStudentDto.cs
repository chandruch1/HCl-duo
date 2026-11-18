using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Api.DTOs.Student;

public class UpdateStudentDto
{
    [Required]
    [Phone]
    [MaxLength(15)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(250)]
    public string? Address { get; set; }

    public DateTime? DateOfBirth { get; set; }
}