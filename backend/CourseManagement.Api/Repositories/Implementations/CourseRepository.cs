
using CourseManagement.Api.Data;
using CourseManagement.Api.Models;
using CourseManagement.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CourseManagement.Api.Repositories.Implementations;

public class CourseRepository : ICourseRepository
{
    private readonly ApplicationDbContext _context;

    public CourseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Course>> GetAllAsync()
    {
        return await _context.Courses.ToListAsync();
    }

    public async Task<Course?> GetByIdAsync(int id)
    {
        return await _context.Courses.FindAsync(id);
    }

    public async Task<Course> CreateAsync(Course course)
    {
        await _context.Courses.AddAsync(course);
        await _context.SaveChangesAsync();

        return course;
    }

    public async Task<Course> UpdateAsync(Course course)
    {
        _context.Courses.Update(course);
        await _context.SaveChangesAsync();

        return course;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var course = await _context.Courses.FindAsync(id);

        if (course == null)
        {
            return false;
        }

        // Soft delete: preserve enrollment history
        course.IsActive = false;

        await _context.SaveChangesAsync();

        return true;
    }
}
