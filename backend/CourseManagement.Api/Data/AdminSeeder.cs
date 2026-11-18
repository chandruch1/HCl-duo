
using CourseManagement.Api.Models;
using Microsoft.EntityFrameworkCore;
using CourseManagement.Api.Enums;

namespace CourseManagement.Api.Data;

public static class AdminSeeder
{
    public static async Task SeedAdminAsync(
        AppDbContext context,
        IConfiguration configuration)
    {
        string email = configuration["Admin:Email"]
            ?? throw new InvalidOperationException("Admin email is missing");

        string password = configuration["Admin:Password"]
            ?? throw new InvalidOperationException("Admin password is missing");

        var admin = await context.Users
            .FirstOrDefaultAsync(u => u.Role == UserRole.Admin);

        if (admin != null)
        {
            bool resetPassword = configuration.GetValue<bool>(
                "Admin:ResetPassword");

            if (resetPassword)
            {
                admin.PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(password);

                await context.SaveChangesAsync();

                Console.WriteLine("Admin password reset successfully.");
            }

            return;
        }

        var newAdmin = new ApplicationUser
        {
            FullName = configuration["Admin:FullName"]
                ?? throw new InvalidOperationException("Admin name is missing"),

            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow
        };

        await context.Users.AddAsync(newAdmin);
        await context.SaveChangesAsync();

        Console.WriteLine("Admin account created successfully.");
    }
}
