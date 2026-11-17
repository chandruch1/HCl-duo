
using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Api.Models;

public class Course
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [Range(0, 1000000)]
    public decimal Price { get; set; }

    [Required]
    [Range(1, 3650)]
    public int DurationInDays { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
