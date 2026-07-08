using CadernoApp.Api.Contracts.Notes;
using CadernoApp.Application.Services;

namespace CadernoApp.Api.Endpoints;

public static class NoteEndpoints
{
    public static IEndpointRouteBuilder MapNoteEndpoints(this IEndpointRouteBuilder app)
    {
        var moduleNotesGroup = app.MapGroup("/api/modules/{moduleId:guid}/notes")
            .WithTags("Notes");

        moduleNotesGroup.MapPost("", CreateNoteAsync);
        moduleNotesGroup.MapGet("", ListNotesAsync);

        var notesGroup = app.MapGroup("/api/notes")
            .WithTags("Notes");

        notesGroup.MapGet("/favorites", ListFavoriteNotesAsync);
        notesGroup.MapGet("/search", SearchNotesAsync);
        notesGroup.MapGet("/{id:guid}", GetNoteByIdAsync);
        notesGroup.MapPost("/{noteId:guid}/pages", AddPageAsync);
        notesGroup.MapPut("/{noteId:guid}/pages/{pageId:guid}/content", UpdatePageContentAsync);
        notesGroup.MapPost("/{noteId:guid}/tags", AddTagAsync);
        notesGroup.MapDelete("/{noteId:guid}/tags/{tagName}", RemoveTagAsync);
        notesGroup.MapPut("/{noteId:guid}/favorite", MarkAsFavoriteAsync);
        notesGroup.MapDelete("/{noteId:guid}/favorite", UnmarkAsFavoriteAsync);

        return app;
    }

    private static async Task<IResult> CreateNoteAsync(
        Guid moduleId,
        CreateNoteRequest request,
        NoteService noteService,
        CancellationToken cancellationToken)
    {
        try
        {
            var note = await noteService.CreateAsync(moduleId, request.Title, cancellationToken);

            return Results.Created($"/api/notes/{note.Id}", note);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> ListNotesAsync(
        Guid moduleId,
        NoteService noteService,
        CancellationToken cancellationToken)
    {
        var notes = await noteService.ListByStudyModuleIdAsync(moduleId, cancellationToken);

        return Results.Ok(notes);
    }

    private static async Task<IResult> GetNoteByIdAsync(
        Guid id,
        NoteService noteService,
        CancellationToken cancellationToken)
    {
        try
        {
            var note = await noteService.GetByIdAsync(id, cancellationToken);

            return Results.Ok(note);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> AddPageAsync(
        Guid noteId,
        AddNotePageRequest request,
        NoteService noteService,
        CancellationToken cancellationToken)
    {
        try
        {
            var page = await noteService.AddPageAsync(
                noteId,
                request.Content,
                request.ContentFormat,
                cancellationToken);

            return Results.Created($"/api/notes/{noteId}/pages/{page.Id}", page);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> UpdatePageContentAsync(
        Guid noteId,
        Guid pageId,
        UpdateNotePageContentRequest request,
        NoteService noteService,
        CancellationToken cancellationToken)
    {
        try
        {
            var page = await noteService.UpdatePageContentAsync(
                noteId,
                pageId,
                request.Content,
                request.ContentFormat,
                cancellationToken);

            return Results.Ok(page);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> AddTagAsync(
        Guid noteId,
        AddTagToNoteRequest request,
        NoteService noteService,
        CancellationToken cancellationToken)
    {
        try
        {
            var tag = await noteService.AddTagAsync(
                noteId,
                request.Name,
                request.Color,
                cancellationToken);

            return Results.Created($"/api/notes/{noteId}/tags/{tag.Id}", tag);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> RemoveTagAsync(
        Guid noteId,
        string tagName,
        NoteService noteService,
        CancellationToken cancellationToken)
    {
        try
        {
            var note = await noteService.RemoveTagAsync(noteId, tagName, cancellationToken);

            return Results.Ok(note);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> MarkAsFavoriteAsync(
        Guid noteId,
        NoteService noteService,
        CancellationToken cancellationToken)
    {
        try
        {
            var note = await noteService.MarkAsFavoriteAsync(noteId, cancellationToken);

            return Results.Ok(note);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> UnmarkAsFavoriteAsync(
        Guid noteId,
        NoteService noteService,
        CancellationToken cancellationToken)
    {
        try
        {
            var note = await noteService.UnmarkAsFavoriteAsync(noteId, cancellationToken);

            return Results.Ok(note);
        }
        catch (Exception exception)
        {
            return EndpointResults.FromException(exception);
        }
    }

    private static async Task<IResult> ListFavoriteNotesAsync(
        NoteService noteService,
        CancellationToken cancellationToken)
    {
        var notes = await noteService.ListFavoritesAsync(cancellationToken);

        return Results.Ok(notes);
    }

    private static async Task<IResult> SearchNotesAsync(
        string? query,
        NoteService noteService,
        CancellationToken cancellationToken)
    {
        var notes = await noteService.SearchAsync(query ?? string.Empty, cancellationToken);

        return Results.Ok(notes);
    }
}
