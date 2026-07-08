namespace CadernoApp.Application.DTOs;

public sealed record StudyModuleDto(
    Guid Id,
    Guid SubjectId,
    string Title,
    string? Description,
    int OrderIndex,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
