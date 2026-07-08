namespace CadernoApp.Application.DTOs.Export;

public sealed record PrintableNoteDto(
    Guid NoteId,
    string Title,
    bool IsFavorite,
    PrintableNoteMetadataDto Metadata,
    IReadOnlyCollection<PrintableNotePageDto> Pages)
{
    public int PageCount => Pages.Count;
}
