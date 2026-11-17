using CourseManagement.Api.DTOs.Auth;
using CourseManagement.Api.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CourseManagement.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // Student Registration
    [HttpPost("student/register")]
    public async Task<IActionResult> RegisterStudent(RegisterDto dto)
    {
        try
        {
            var result = await _authService.RegisterStudentAsync(dto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // Student Login
    [HttpPost("student/login")]
    public async Task<IActionResult> LoginStudent(LoginDto dto)
    {
        try
        {
            var result = await _authService.LoginStudentAsync(dto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    // Admin Login
    [HttpPost("admin/login")]
    public async Task<IActionResult> LoginAdmin(LoginDto dto)
    {
        try
        {
            var result = await _authService.LoginAdminAsync(dto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}