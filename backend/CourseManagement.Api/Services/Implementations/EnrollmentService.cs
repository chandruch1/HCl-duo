using CourseManagement.Api.DTOs.Enrollment;
using CourseManagement.Api.Models;
using CourseManagement.Api.Repositories.Interfaces;
using CourseManagement.Api.Services.Interfaces;

namespace CourseManagement.Api.Services.Implementations;

public class EnrollmentService : IEnrollmentService
{
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly ICourseRepository _courseRepository;

    public EnrollmentService(
        IEnrollmentRepository enrollmentRepository,
        IStudentRepository studentRepository,
        ICourseRepository courseRepository)
    {
        _enrollmentRepository = enrollmentRepository;
        _studentRepository = studentRepository;
        _courseRepository = courseRepository;
    }

    public async Task<IEnumerable<EnrollmentResponseDto>> GetAllEnrollmentsAsync()
    {
        var enrollments = await _enrollmentRepository.GetAllAsync();
        return enrollments.Select(MapToResponseDto);
    }

    public async Task<IEnumerable<EnrollmentResponseDto>> GetMyEnrollmentsAsync(int userId)
    {
        var student = await _studentRepository.GetByUserIdAsync(userId);
        if (student == null)
            throw new KeyNotFoundException("Student profile not found.");

        var enrollments = await _enrollmentRepository.GetByStudentIdAsync(student.Id);
        return enrollments.Select(MapToResponseDto);
    }

    public async Task<EnrollmentResponseDto?> GetEnrollmentByIdAsync(int id)
    {
        var enrollment = await _enrollmentRepository.GetByIdAsync(id);
        return enrollment == null ? null : MapToResponseDto(enrollment);
    }

    public async Task<EnrollmentResponseDto> EnrollCourseAsync(int userId, EnrollmentCreateDto dto)
    {
        var student = await _studentRepository.GetByUserIdAsync(userId);
        if (student == null)
            throw new KeyNotFoundException("Student profile not found.");

        var course = await _courseRepository.GetByIdAsync(dto.CourseId);
        if (course == null || !course.IsActive)
            throw new KeyNotFoundException("Course not found or is inactive.");

        var existing = await _enrollmentRepository.GetByStudentAndCourseAsync(student.Id, dto.CourseId);
        if (existing != null)
            throw new InvalidOperationException("You are already enrolled in this course.");

        var enrollment = new Enrollment
        {
            StudentId = student.Id,
            CourseId = dto.CourseId,
            Status = "Pending",
            EnrolledAt = DateTime.UtcNow
        };

        var created = await _enrollmentRepository.CreateAsync(enrollment);
        var loaded = await _enrollmentRepository.GetByIdAsync(created.Id);

        return MapToResponseDto(loaded ?? created);
    }

    public async Task<EnrollmentResponseDto?> UpdateEnrollmentStatusAsync(int id, EnrollmentStatusUpdateDto dto)
    {
        var enrollment = await _enrollmentRepository.GetByIdAsync(id);
        if (enrollment == null)
            return null;

        enrollment.Status = dto.Status;
        await _enrollmentRepository.UpdateAsync(enrollment);

        return MapToResponseDto(enrollment);
    }

    public async Task<bool> DeleteEnrollmentAsync(int id)
    {
        return await _enrollmentRepository.DeleteAsync(id);
    }

    private static EnrollmentResponseDto MapToResponseDto(Enrollment enrollment)
    {
        var latestPayment = enrollment.Payments?.OrderByDescending(p => p.PaidAt).FirstOrDefault();

        return new EnrollmentResponseDto
        {
            Id = enrollment.Id,
            StudentId = enrollment.StudentId,
            StudentName = enrollment.Student?.User?.FullName ?? string.Empty,
            StudentEmail = enrollment.Student?.User?.Email ?? string.Empty,
            CourseId = enrollment.CourseId,
            CourseTitle = enrollment.Course?.Title ?? string.Empty,
            CoursePrice = enrollment.Course?.Price ?? 0,
            EnrolledAt = enrollment.EnrolledAt,
            Status = enrollment.Status,
            PaymentStatus = latestPayment?.Status ?? "Unpaid",
            PaymentId = latestPayment?.Id
        };
    }
}

