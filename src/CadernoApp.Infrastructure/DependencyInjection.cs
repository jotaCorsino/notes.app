using CadernoApp.Application.Abstractions;
using CadernoApp.Infrastructure.Persistence;
using CadernoApp.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CadernoApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new ArgumentException("Connection string is required.", nameof(connectionString));
        }

        services.AddDbContext<CadernoAppDbContext>(options => options.UseSqlite(connectionString));

        services.AddScoped<ISubjectRepository, SubjectRepository>();
        services.AddScoped<IStudyModuleRepository, StudyModuleRepository>();
        services.AddScoped<INoteRepository, NoteRepository>();
        services.AddScoped<ITagRepository, TagRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
