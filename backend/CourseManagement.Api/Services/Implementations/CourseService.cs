
using CourseManagement.Api.DTOs.Course;
using CourseManagement.Api.Models;
using CourseManagement.Api.Repositories.Interfaces;
using CourseManagement.Api.Services.Interfaces;

namespace CourseManagement.Api.Services.Implementations;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepository;

    public CourseService(ICourseRepository courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<IEnumerable<CourseResponseDto>> GetAllCoursesAsync()
    {
        var courses = await _courseRepository.GetAllAsync();

        return courses.Select(course => MapToResponseDto(course));
    }

    public async Task<CourseResponseDto?> GetCourseByIdAsync(int id)
    {
        var course = await _courseRepository.GetByIdAsync(id);

        if (course == null)
            return null;

        return MapToResponseDto(course);
    }

    public async Task<CourseResponseDto> CreateCourseAsync(CourseCreateDto dto)
    {
        var course = new Course
        {
            Title = dto.Title,
            Description = dto.Description,
            Price = dto.Price,
            DurationInDays = dto.DurationInDays,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var createdCourse = await _courseRepository.CreateAsync(course);

        return MapToResponseDto(createdCourse);
    }

    public async Task<CourseResponseDto?> UpdateCourseAsync(int id, CourseUpdateDto dto)
    {
        var course = await _courseRepository.GetByIdAsync(id);

        if (course == null)
            return null;

        course.Title = dto.Title;
        course.Description = dto.Description;
        course.Price = dto.Price;
        course.DurationInDays = dto.DurationInDays;

        var updatedCourse = await _courseRepository.UpdateAsync(course);

        return MapToResponseDto(updatedCourse);
    }

    public async Task<bool> DeleteCourseAsync(int id)
    {
        return await _courseRepository.DeleteAsync(id);
    }

    private static CourseResponseDto MapToResponseDto(Course course)
    {
        return new CourseResponseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            Price = course.Price,
            DurationInDays = course.DurationInDays,
            IsActive = course.IsActive,
            CreatedAt = course.CreatedAt
        };
    }
}
