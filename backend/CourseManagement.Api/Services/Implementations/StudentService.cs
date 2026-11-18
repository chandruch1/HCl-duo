using CourseManagement.Api.DTOs.Student;
using CourseManagement.Api.Interfaces.Services;
using CourseManagement.Api.Repositories.Interfaces;
using CourseManagement.Api.Models;

namespace CourseManagement.Api.Services;

public class StudentService : IStudentService
{
    private readonly IStudentRepository _studentRepository;

    public StudentService(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<StudentResponseDto> GetMyProfileAsync(int userId)
    {
        var student = await _studentRepository.GetByUserIdAsync(userId);

        if (student == null)
            throw new KeyNotFoundException("Student profile not found.");

        return MapToDto(student);
    }

    public async Task<List<StudentResponseDto>> GetAllAsync()
    {
        var students = await _studentRepository.GetAllAsync();

        return students.Select(MapToDto).ToList();
    }

    public async Task<StudentResponseDto> GetByIdAsync(int id)
    {
        var student = await _studentRepository.GetByIdAsync(id);

        if (student == null)
            throw new KeyNotFoundException("Student not found.");

        return MapToDto(student);
    }

    public async Task<StudentResponseDto> UpdateMyProfileAsync(
        int userId,
        UpdateStudentDto dto)
    {
        var student = await _studentRepository.GetByUserIdAsync(userId);

        if (student == null)
            throw new KeyNotFoundException("Student profile not found.");

        student.Phone = dto.Phone;
        student.Address = dto.Address;
        student.DateOfBirth = dto.DateOfBirth;

        await _studentRepository.UpdateAsync(student);

        return MapToDto(student);
    }

    private static StudentResponseDto MapToDto(Student student)
    {
        return new StudentResponseDto
        {
            Id = student.Id,
            UserId = student.UserId,
            FullName = student.User?.FullName ?? string.Empty,
            Email = student.User?.Email ?? string.Empty,
            Phone = student.Phone,
            Address = student.Address,
            DateOfBirth = student.DateOfBirth
        };
    }
}