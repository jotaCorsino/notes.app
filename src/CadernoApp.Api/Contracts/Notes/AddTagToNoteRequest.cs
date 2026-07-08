namespace CadernoApp.Api.Contracts.Notes;

public sealed record AddTagToNoteRequest
{
    public string Name { get; init; } = string.Empty;

    public string? Color { get; init; }
}
