using CourseManagement.Api.Data;
using CourseManagement.Api.Models;
using CourseManagement.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CourseManagement.Api.Repositories.Implementations;

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _context;

    public PaymentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Payment>> GetAllAsync()
    {
        return await _context.Payments
            .Include(p => p.Enrollment)
                .ThenInclude(e => e!.Student)
                    .ThenInclude(s => s!.User)
            .Include(p => p.Enrollment)
                .ThenInclude(e => e!.Course)
            .OrderByDescending(p => p.PaidAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Payment>> GetByStudentIdAsync(int studentId)
    {
        return await _context.Payments
            .Include(p => p.Enrollment)
                .ThenInclude(e => e!.Student)
                    .ThenInclude(s => s!.User)
            .Include(p => p.Enrollment)
                .ThenInclude(e => e!.Course)
            .Where(p => p.Enrollment!.StudentId == studentId)
            .OrderByDescending(p => p.PaidAt)
            .ToListAsync();
    }

    public async Task<Payment?> GetByIdAsync(int id)
    {
        return await _context.Payments
            .Include(p => p.Enrollment)
                .ThenInclude(e => e!.Student)
                    .ThenInclude(s => s!.User)
            .Include(p => p.Enrollment)
                .ThenInclude(e => e!.Course)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Payment> CreateAsync(Payment payment)
    {
        await _context.Payments.AddAsync(payment);
        await _context.SaveChangesAsync();
        return payment;
    }
}

