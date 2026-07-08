namespace CadernoApp.Application.DTOs.Export;

public sealed record PrintableNotePageDto(
    Guid PageId,
    int PageNumber,
    int OrderIndex,
    decimal WidthMm,
    decimal HeightMm,
    string Content,
    string ContentFormat);
