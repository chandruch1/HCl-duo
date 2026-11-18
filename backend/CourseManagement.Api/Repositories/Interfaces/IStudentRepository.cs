using CourseManagement.Api.DTOs.Student;
using CourseManagement.Api.Models;

namespace CourseManagement.Api.Repositories.Interfaces;

public interface IStudentRepository
{
    Task<Student?> GetByIdAsync(int id);

    Task<Student?> GetByUserIdAsync(int userId);

    Task<List<Student>> GetAllAsync();

    Task<Student> UpdateAsync(Student student);
}