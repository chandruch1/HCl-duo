using CourseManagement.Api.DTOs.Auth;

namespace CourseManagement.Api.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterStudentAsync(RegisterDto dto);

    Task<AuthResponseDto> LoginStudentAsync(LoginDto dto);

    Task<AuthResponseDto> LoginAdminAsync(LoginDto dto);
}