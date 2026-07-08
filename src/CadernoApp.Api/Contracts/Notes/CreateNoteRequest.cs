namespace CadernoApp.Api.Contracts.Notes;

public sealed record CreateNoteRequest
{
    public string Title { get; init; } = string.Empty;
}
