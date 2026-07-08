namespace CadernoApp.Application.DTOs;

public sealed record SubjectDto(
    Guid Id,
    string Name,
    string? Description,
    string? Color,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    IReadOnlyCollection<StudyModuleDto> Modules);
