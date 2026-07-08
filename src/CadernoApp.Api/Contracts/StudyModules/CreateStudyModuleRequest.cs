namespace CadernoApp.Api.Contracts.StudyModules;

public sealed record CreateStudyModuleRequest
{
    public string Title { get; init; } = string.Empty;

    public string? Description { get; init; }

    public int? OrderIndex { get; init; }
}
