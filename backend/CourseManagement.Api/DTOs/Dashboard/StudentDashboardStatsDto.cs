namespace CourseManagement.Api.DTOs.Dashboard;

public class StudentDashboardStatsDto
{
    public int EnrolledCoursesCount { get; set; }
    public int ActiveCoursesCount { get; set; }
    public decimal TotalAmountPaid { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
}

