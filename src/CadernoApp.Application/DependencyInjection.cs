using CadernoApp.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CadernoApp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<SubjectService>();
        services.AddScoped<StudyModuleService>();
        services.AddScoped<NoteService>();

        return services;
    }
}
