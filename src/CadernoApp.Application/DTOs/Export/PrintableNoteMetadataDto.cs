namespace CadernoApp.Application.DTOs.Export;

public sealed record PrintableNoteMetadataDto(
    Guid SubjectId,
    string SubjectName,
    Guid StudyModuleId,
    string StudyModuleTitle,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
