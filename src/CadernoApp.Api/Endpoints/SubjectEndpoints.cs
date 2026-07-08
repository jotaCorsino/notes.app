using CadernoApp.Api.Contracts.Subjects;
using CadernoApp.Application.Services;

namespace CadernoApp.Api.Endpoints;

public static class SubjectEndpoints
{
    public static IEndpointRouteBuilder MapSubjectEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/subjects")
            .WithTags("Subjects");

        group.MapPost("", CreateSubjectAsync);
        group.MapGet("", ListSubjectsAsync);
        group.MapGet("/{id:guid}", GetSubjectByIdAsync);
        group.MapPut("/{id:guid}", UpdateSubjectAsync);
        group.MapDelete("/{id:guid}", DeleteSubjectAsync);

        return app;
    }

    private static async Task<IResult> CreateSubjectAsync(
        CreateSubjectRequest request,
        SubjectService subjectService,
        CancellationToken cancellationToken)
    {
        try
        {
            var subject = await subjectService.CreateAsync(
                request.Name,
                request.Description,
                request.Color,
                cancellationToken);

            return Results.Created($"/api/subjects/{subject.Id}", subject);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> ListSubjectsAsync(
        SubjectService subjectService,
        CancellationToken cancellationToken)
    {
        var subjects = await subjectService.ListAsync(cancellationToken);

        return Results.Ok(subjects);
    }

    private static async Task<IResult> GetSubjectByIdAsync(
        Guid id,
        SubjectService subjectService,
        CancellationToken cancellationToken)
    {
        try
        {
            var subject = await subjectService.GetByIdAsync(id, cancellationToken);

            return Results.Ok(subject);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> UpdateSubjectAsync(
        Guid id,
        UpdateSubjectRequest request,
        SubjectService subjectService,
        CancellationToken cancellationToken)
    {
        try
        {
            var subject = await subjectService.UpdateAsync(
                id,
                request.Name,
                request.Description,
                request.Color,
                cancellationToken);

            return Results.Ok(subject);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> DeleteSubjectAsync(
        Guid id,
        SubjectService subjectService,
        CancellationToken cancellationToken)
    {
        try
        {
            await subjectService.DeleteAsync(id, cancellationToken);

            return Results.NoContent();
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }
}
