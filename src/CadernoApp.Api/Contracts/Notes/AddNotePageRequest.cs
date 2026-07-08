namespace CadernoApp.Api.Contracts.Notes;

public sealed record AddNotePageRequest
{
    public string? Content { get; init; }

    public string ContentFormat { get; init; } = "html";
}
