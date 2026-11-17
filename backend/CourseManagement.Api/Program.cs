using CourseManagement.Api.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using CourseManagement.Api.Repositories.Interfaces;
using CourseManagement.Api.Repositories.Implementations;
using CourseManagement.Api.Interfaces.Services;
using CourseManagement.Api.Services;
using CourseManagement.Api.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

//Dependency Injection
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Database connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

//Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Seed Admin
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    var configuration = scope.ServiceProvider
        .GetRequiredService<IConfiguration>();

    await AdminSeeder.SeedAdminAsync(context, configuration);
}

// HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("Angular");

app.UseAuthorization();

app.MapControllers();

app.Run();