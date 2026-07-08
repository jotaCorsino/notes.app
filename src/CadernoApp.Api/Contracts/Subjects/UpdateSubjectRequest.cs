namespace CadernoApp.Api.Contracts.Subjects;

public sealed record UpdateSubjectRequest
{
    public string Name { get; init; } = string.Empty;

    public string? Description { get; init; }

    public string? Color { get; init; }
}
