namespace CadernoApp.Application.DTOs;

public sealed record NoteSummaryDto(
    Guid Id,
    Guid StudyModuleId,
    string Title,
    bool IsFavorite,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    int PageCount,
    IReadOnlyCollection<string> Tags);
