using CourseManagement.Api.DTOs.Enrollment;
using CourseManagement.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CourseManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EnrollmentController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllEnrollments()
    {
        var enrollments = await _enrollmentService.GetAllEnrollmentsAsync();
        return Ok(enrollments);
    }

    [HttpGet("my")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMyEnrollments()
    {
        try
        {
            int userId = GetCurrentUserId();
            var enrollments = await _enrollmentService.GetMyEnrollmentsAsync(userId);
            return Ok(enrollments);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetEnrollmentById(int id)
    {
        var enrollment = await _enrollmentService.GetEnrollmentByIdAsync(id);
        if (enrollment == null)
            return NotFound(new { message = "Enrollment not found." });

        return Ok(enrollment);
    }

    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> EnrollInCourse([FromBody] EnrollmentCreateDto dto)
    {
        try
        {
            int userId = GetCurrentUserId();
            var enrollment = await _enrollmentService.EnrollCourseAsync(userId, dto);
            return CreatedAtAction(nameof(GetEnrollmentById), new { id = enrollment.Id }, enrollment);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] EnrollmentStatusUpdateDto dto)
    {
        var updated = await _enrollmentService.UpdateEnrollmentStatusAsync(id, dto);
        if (updated == null)
            return NotFound(new { message = "Enrollment not found." });

        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteEnrollment(int id)
    {
        bool deleted = await _enrollmentService.DeleteEnrollmentAsync(id);
        if (!deleted)
            return NotFound(new { message = "Enrollment not found." });

        return NoContent();
    }

    private int GetCurrentUserId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}

