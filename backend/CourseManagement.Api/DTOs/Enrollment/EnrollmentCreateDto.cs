using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Api.DTOs.Enrollment;

public class EnrollmentCreateDto
{
    [Required]
    public int CourseId { get; set; }
}

