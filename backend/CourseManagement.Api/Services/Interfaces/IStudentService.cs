using CourseManagement.Api.DTOs.Student;

namespace CourseManagement.Api.Interfaces.Services;

public interface IStudentService
{
    Task<StudentResponseDto> GetMyProfileAsync(int userId);

    Task<List<StudentResponseDto>> GetAllAsync();

    Task<StudentResponseDto> GetByIdAsync(int id);

    Task<StudentResponseDto> UpdateMyProfileAsync(
        int userId,
        UpdateStudentDto dto);

    Task<StudentResponseDto> UpdateStudentAsync(
    int id,UpdateStudentDto dto);
}