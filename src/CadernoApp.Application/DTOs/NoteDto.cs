namespace CadernoApp.Application.DTOs;

public sealed record NoteDto(
    Guid Id,
    Guid StudyModuleId,
    string Title,
    bool IsFavorite,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    IReadOnlyCollection<NotePageDto> Pages,
    IReadOnlyCollection<TagDto> Tags);
