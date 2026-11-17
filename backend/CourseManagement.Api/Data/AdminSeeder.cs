using CourseManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagement.Api.Data;

public static class AdminSeeder
{
    public static async Task SeedAdminAsync(
        AppDbContext context,
        IConfiguration configuration)
    {
        bool adminExists = await context.Users
            .AnyAsync(u => u.Role == "Admin");

        if (adminExists)
            return;

        var admin = new ApplicationUser
        {
            FullName = configuration["Admin:FullName"]
                ?? throw new InvalidOperationException("Admin name is missing"),

            Email = configuration["Admin:Email"]
                ?? throw new InvalidOperationException("Admin email is missing"),

            PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                configuration["Admin:Password"]
                ?? throw new InvalidOperationException("Admin password is missing")
            ),

            Role = "Admin",
            CreatedAt = DateTime.UtcNow
        };

        await context.Users.AddAsync(admin);
        await context.SaveChangesAsync();
    }
}