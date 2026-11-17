using CourseManagement.Api.Models;

namespace CourseManagement.Api.Interfaces.Services;

public interface IJwtService
{
    string GenerateToken(ApplicationUser user);
}