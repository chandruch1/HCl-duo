namespace CourseManagement.Api.DTOs.Dashboard;

public class DashboardStatsDto
{
    public int TotalStudents { get; set; }
    public int TotalCourses { get; set; }
    public int TotalEnrollments { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<RecentActivityDto> RecentActivities { get; set; } = new();
}

public class RecentActivityDto
{
    public string Type { get; set; } = string.Empty; // "Enrollment", "Payment", "Student"
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

