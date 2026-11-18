
using CourseManagement.Api.DTOs.Student;
using CourseManagement.Api.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CourseManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StudentController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    // GET: api/Student/me
    // Student can view their own profile
    [HttpGet("me")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMyProfile()
    {
        try
        {
            int userId = GetCurrentUserId();

            var student = await _studentService.GetMyProfileAsync(userId);

            return Ok(student);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // GET: api/Student
    // Admin can view all students
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllStudents()
    {
        var students = await _studentService.GetAllAsync();

        return Ok(students);
    }

    // GET: api/Student/5
    // Admin can view a specific student
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetStudentById(int id)
    {
        try
        {
            var student = await _studentService.GetByIdAsync(id);

            return Ok(student);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // PUT: api/Student/me
    // Student can update their own profile
    [HttpPut("me")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> UpdateMyProfile(
        [FromBody] UpdateStudentDto dto)
    {
        try
        {
            int userId = GetCurrentUserId();

            var student = await _studentService.UpdateMyProfileAsync(
                userId, dto);

            return Ok(student);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Get logged-in user's ID from JWT
    private int GetCurrentUserId()
    {
        return int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );
    }
}
