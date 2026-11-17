
using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Api.DTOs.Course;

public class CourseCreateDto
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Range(0, 1000000)]
    public decimal Price { get; set; }

    [Range(1, 3650)]
    public int DurationInDays { get; set; }
}
