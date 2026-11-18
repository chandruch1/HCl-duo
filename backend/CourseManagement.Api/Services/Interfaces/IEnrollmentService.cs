using CourseManagement.Api.DTOs.Enrollment;

namespace CourseManagement.Api.Services.Interfaces;

public interface IEnrollmentService
{
    Task<IEnumerable<EnrollmentResponseDto>> GetAllEnrollmentsAsync();
    Task<IEnumerable<EnrollmentResponseDto>> GetMyEnrollmentsAsync(int userId);
    Task<EnrollmentResponseDto?> GetEnrollmentByIdAsync(int id);
    Task<EnrollmentResponseDto> EnrollCourseAsync(int userId, EnrollmentCreateDto dto);
    Task<EnrollmentResponseDto?> UpdateEnrollmentStatusAsync(int id, EnrollmentStatusUpdateDto dto);
    Task<bool> DeleteEnrollmentAsync(int id);
}

