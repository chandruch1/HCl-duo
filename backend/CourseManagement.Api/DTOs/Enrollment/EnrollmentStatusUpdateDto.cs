using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Api.DTOs.Enrollment;

public class EnrollmentStatusUpdateDto
{
    [Required]
    [MaxLength(30)]
    public string Status { get; set; } = string.Empty;
}

