using CadernoApp.Api.Contracts.StudyModules;
using CadernoApp.Application.Services;

namespace CadernoApp.Api.Endpoints;

public static class StudyModuleEndpoints
{
    public static IEndpointRouteBuilder MapStudyModuleEndpoints(this IEndpointRouteBuilder app)
    {
        var subjectModulesGroup = app.MapGroup("/api/subjects/{subjectId:guid}/modules")
            .WithTags("Study Modules");

        subjectModulesGroup.MapPost("", CreateStudyModuleAsync);
        subjectModulesGroup.MapGet("", ListStudyModulesAsync);

        var modulesGroup = app.MapGroup("/api/modules")
            .WithTags("Study Modules");

        modulesGroup.MapGet("/{id:guid}", GetStudyModuleByIdAsync);
        modulesGroup.MapDelete("/{id:guid}", DeleteStudyModuleAsync);

        return app;
    }

    private static async Task<IResult> CreateStudyModuleAsync(
        Guid subjectId,
        CreateStudyModuleRequest request,
        StudyModuleService studyModuleService,
        CancellationToken cancellationToken)
    {
        try
        {
            var module = await studyModuleService.CreateAsync(
                subjectId,
                request.Title,
                request.Description,
                request.OrderIndex,
                cancellationToken);

            return Results.Created($"/api/modules/{module.Id}", module);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> ListStudyModulesAsync(
        Guid subjectId,
        StudyModuleService studyModuleService,
        CancellationToken cancellationToken)
    {
        var modules = await studyModuleService.ListBySubjectIdAsync(subjectId, cancellationToken);

        return Results.Ok(modules);
    }

    private static async Task<IResult> GetStudyModuleByIdAsync(
        Guid id,
        StudyModuleService studyModuleService,
        CancellationToken cancellationToken)
    {
        try
        {
            var module = await studyModuleService.GetByIdAsync(id, cancellationToken);

            return Results.Ok(module);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> DeleteStudyModuleAsync(
        Guid id,
        StudyModuleService studyModuleService,
        CancellationToken cancellationToken)
    {
        try
        {
            await studyModuleService.DeleteAsync(id, cancellationToken);

            return Results.NoContent();
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }
}
