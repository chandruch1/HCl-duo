using CourseManagement.Api.Data;
using CourseManagement.Api.DTOs.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CourseManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminDashboardStats()
    {
        int totalStudents = await _context.Students.CountAsync();
        int totalCourses = await _context.Courses.CountAsync();
        int totalEnrollments = await _context.Enrollments.CountAsync();
        decimal totalRevenue = await _context.Payments
            .Where(p => p.Status == "Success")
            .SumAsync(p => p.Amount);

        var recentActivities = new List<RecentActivityDto>();

        // Recent 5 enrollments
        var recentEnrollments = await _context.Enrollments
            .Include(e => e.Student).ThenInclude(s => s!.User)
            .Include(e => e.Course)
            .OrderByDescending(e => e.EnrolledAt)
            .Take(5)
            .ToListAsync();

        foreach (var e in recentEnrollments)
        {
            recentActivities.Add(new RecentActivityDto
            {
                Type = "Enrollment",
                Description = $"{e.Student?.User?.FullName ?? "Student"} enrolled in {e.Course?.Title ?? "Course"} ({e.Status})",
                Timestamp = e.EnrolledAt
            });
        }

        // Recent 5 payments
        var recentPayments = await _context.Payments
            .Include(p => p.Enrollment).ThenInclude(e => e!.Course)
            .Include(p => p.Enrollment).ThenInclude(e => e!.Student).ThenInclude(s => s!.User)
            .OrderByDescending(p => p.PaidAt)
            .Take(5)
            .ToListAsync();

        foreach (var p in recentPayments)
        {
            recentActivities.Add(new RecentActivityDto
            {
                Type = "Payment",
                Description = $"{p.Enrollment?.Student?.User?.FullName ?? "Student"} paid ₹{p.Amount:F2} for {p.Enrollment?.Course?.Title ?? "Course"}",
                Timestamp = p.PaidAt
            });
        }

        var stats = new DashboardStatsDto
        {
            TotalStudents = totalStudents,
            TotalCourses = totalCourses,
            TotalEnrollments = totalEnrollments,
            TotalRevenue = totalRevenue,
            RecentActivities = recentActivities.OrderByDescending(a => a.Timestamp).Take(10).ToList()
        };

        return Ok(stats);
    }

    [HttpGet("student")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetStudentDashboardStats()
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
            return NotFound(new { message = "Student profile not found." });

        int enrolledCount = await _context.Enrollments
            .Where(e => e.StudentId == student.Id)
            .CountAsync();

        int activeCount = await _context.Enrollments
            .Where(e => e.StudentId == student.Id && e.Status == "Active")
            .CountAsync();

        decimal totalPaid = await _context.Payments
            .Where(p => p.Enrollment!.StudentId == student.Id && p.Status == "Success")
            .SumAsync(p => p.Amount);

        var stats = new StudentDashboardStatsDto
        {
            EnrolledCoursesCount = enrolledCount,
            ActiveCoursesCount = activeCount,
            TotalAmountPaid = totalPaid,
            StudentName = student.User?.FullName ?? string.Empty,
            StudentEmail = student.User?.Email ?? string.Empty
        };

        return Ok(stats);
    }
}

