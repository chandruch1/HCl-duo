using CourseManagement.Api.Data;
using CourseManagement.Api.Models;
using CourseManagement.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CourseManagement.Api.Repositories.Implementations;

public class StudentRepository : IStudentRepository
{
    private readonly AppDbContext _context;

    public StudentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Student?> GetByIdAsync(int id)
    {
        return await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Student?> GetByUserIdAsync(int userId)
    {
        return await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserId == userId);
    }

    public async Task<List<Student>> GetAllAsync()
    {
        return await _context.Students
            .Include(s => s.User)
            .ToListAsync();
    }

    public async Task<Student> UpdateAsync(Student student)
    {
        _context.Students.Update(student);

        await _context.SaveChangesAsync();

        return student;
    }
}