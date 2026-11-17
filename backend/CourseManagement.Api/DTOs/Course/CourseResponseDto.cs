
namespace CourseManagement.Api.DTOs.Course;

public class CourseResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public int DurationInDays { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}
