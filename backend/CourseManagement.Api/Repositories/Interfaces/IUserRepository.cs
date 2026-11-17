using CourseManagement.Api.Models;

namespace CourseManagement.Api.Repositories.Interfaces;

public interface IUserRepository
{
    Task<ApplicationUser?> GetByEmailAsync(string email);

    Task<ApplicationUser?> GetByIdAsync(int id);

    Task<ApplicationUser> CreateAsync(ApplicationUser user);

    Task<bool> EmailExistsAsync(string email);
}