using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CourseManagement.Api.DTOs;
using CourseManagement.Api.DTOs.Auth;
using CourseManagement.Api.Interfaces.Services;
using CourseManagement.Api.Models;
using CourseManagement.Api.Repositories.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace CourseManagement.Api.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(
        IUserRepository userRepository,
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    // Student Registration
    public async Task<AuthResponseDto> RegisterStudentAsync(RegisterDto dto)
    {
        string email = dto.Email.Trim().ToLowerInvariant();

        bool emailExists = await _userRepository.EmailExistsAsync(email);

        if (emailExists)
            throw new InvalidOperationException("Email already registered.");

        var user = new ApplicationUser
        {
            FullName = dto.FullName.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Student",
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.CreateAsync(user);

        return GenerateAuthResponse(user);
    }

    // Student Login
    public async Task<AuthResponseDto> LoginStudentAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(
            dto.Email.Trim().ToLowerInvariant());

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
        var user = await _userRepository.GetByEmailAsync(
            dto.Email.Trim().ToLowerInvariant());

        if (user == null ||
            user.Role != "Admin" ||
            !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        return GenerateAuthResponse(user);
    }

    // Generate JWT Token
    private AuthResponseDto GenerateAuthResponse(ApplicationUser user)
    {
        string secretKey = _configuration["Jwt:SecretKey"]
            ?? throw new InvalidOperationException("JWT SecretKey is missing.");

        string issuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("JWT Issuer is missing.");

        string audience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("JWT Audience is missing.");

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(secretKey));

        var credentials = new SigningCredentials(
            key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new AuthResponseDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            Token = new JwtSecurityTokenHandler().WriteToken(token)
        };
    }
}