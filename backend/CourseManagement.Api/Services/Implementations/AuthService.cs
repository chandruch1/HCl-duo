
using CourseManagement.Api.DTOs.Auth;
using CourseManagement.Api.Interfaces.Services;
using CourseManagement.Api.Models;
using CourseManagement.Api.Repositories.Interfaces;

namespace CourseManagement.Api.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public AuthService(
        IUserRepository userRepository,
        IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    // Student Registration
    public async Task<AuthResponseDto> RegisterStudentAsync(RegisterDto dto)
    {
        string email = dto.Email.Trim().ToLowerInvariant();

        // Check whether email already exists
        bool emailExists = await _userRepository.EmailExistsAsync(email);

        if (emailExists)
            throw new InvalidOperationException("Email already registered.");

        // Create student user
        var user = new ApplicationUser
        {
            FullName = dto.FullName.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Student",
            CreatedAt = DateTime.UtcNow
        };

        // Save user through repository
        await _userRepository.CreateAsync(user);

        return GenerateAuthResponse(user);
    }

    // Student Login
    public async Task<AuthResponseDto> LoginStudentAsync(LoginDto dto)
    {
        string email = dto.Email.Trim().ToLowerInvariant();

        var user = await _userRepository.GetByEmailAsync(email);

        if (user == null ||
            user.Role != "Student" ||
            !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        return GenerateAuthResponse(user);
    }

    // Admin Login
    public async Task<AuthResponseDto> LoginAdminAsync(LoginDto dto)
    {
        string email = dto.Email.Trim().ToLowerInvariant();

        var user = await _userRepository.GetByEmailAsync(email);

        if (user == null ||
            user.Role != "Admin" ||
            !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        return GenerateAuthResponse(user);
    }

    // Generate Authentication Response
    private AuthResponseDto GenerateAuthResponse(ApplicationUser user)
    {
        return new AuthResponseDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            Token = _jwtService.GenerateToken(user)
        };
    }
}
