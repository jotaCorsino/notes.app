namespace CadernoApp.Api.Contracts.Notes;

public sealed record UpdateNotePageContentRequest
{
    public string? Content { get; init; }

    public string ContentFormat { get; init; } = "html";
}
