namespace CadernoApp.Application.DTOs;

public sealed record NotePageDto(
    Guid Id,
    Guid NoteId,
    int PageNumber,
    string Content,
    string ContentFormat,
    decimal WidthMm,
    decimal HeightMm,
    int OrderIndex,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
