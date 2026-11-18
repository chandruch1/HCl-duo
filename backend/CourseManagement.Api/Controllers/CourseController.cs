
using CourseManagement.Api.DTOs.Course;
using CourseManagement.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CourseController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CourseController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCourses()
    {
        var courses = await _courseService.GetAllCoursesAsync();
        return Ok(courses);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCourseById(int id)
    {
        var course = await _courseService.GetCourseByIdAsync(id);

        if (course == null)
            return NotFound(new { message = "Course not found." });

        return Ok(course);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCourse(CourseCreateDto dto)
    {
        var course = await _courseService.CreateCourseAsync(dto);

        return CreatedAtAction(
            nameof(GetCourseById),
            new { id = course.Id },
            course);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCourse(int id, CourseUpdateDto dto)
    {
        var course = await _courseService.UpdateCourseAsync(id, dto);

        if (course == null)
            return NotFound(new { message = "Course not found." });

        return Ok(course);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        bool deleted = await _courseService.DeleteCourseAsync(id);

        if (!deleted)
            return NotFound(new { message = "Course not found." });

        return NoContent();
    }
}
