using CadernoApp.Application.Abstractions;
using CadernoApp.Application.DTOs.Export;
using CadernoApp.Domain.Entities;

namespace CadernoApp.Application.Services;

public sealed class NoteExportService
{
    private readonly INoteRepository _noteRepository;
    private readonly IStudyModuleRepository _studyModuleRepository;
    private readonly ISubjectRepository _subjectRepository;

    public NoteExportService(
        INoteRepository noteRepository,
        IStudyModuleRepository studyModuleRepository,
        ISubjectRepository subjectRepository)
    {
        _noteRepository = noteRepository;
        _studyModuleRepository = studyModuleRepository;
        _subjectRepository = subjectRepository;
    }

    public async Task<PrintableNoteDto> GetPrintableNoteAsync(
        Guid noteId,
        CancellationToken cancellationToken = default)
    {
        var note = await _noteRepository.GetByIdAsync(
            noteId,
            includePages: true,
            includeTags: false,
            cancellationToken)
            ?? throw new KeyNotFoundException($"Note '{noteId}' was not found.");

        var studyModule = await _studyModuleRepository.GetByIdAsync(
            note.StudyModuleId,
            includeNotes: false,
            cancellationToken)
            ?? throw new KeyNotFoundException($"Study module '{note.StudyModuleId}' was not found.");

        var subject = await _subjectRepository.GetByIdAsync(
            studyModule.SubjectId,
            includeModules: false,
            cancellationToken)
            ?? throw new KeyNotFoundException($"Subject '{studyModule.SubjectId}' was not found.");

        return MapPrintableNote(note, studyModule, subject);
    }

    private static PrintableNoteDto MapPrintableNote(
        Note note,
        StudyModule studyModule,
        Subject subject)
    {
        var pages = note.Pages
            .OrderBy(page => page.OrderIndex)
            .ThenBy(page => page.PageNumber)
            .Select(MapPrintablePage)
            .ToList();

        var metadata = new PrintableNoteMetadataDto(
            subject.Id,
            subject.Name,
            studyModule.Id,
            studyModule.Title,
            note.CreatedAt,
            note.UpdatedAt);

        return new PrintableNoteDto(
            note.Id,
            note.Title,
            note.IsFavorite,
            metadata,
            pages);
    }

    private static PrintableNotePageDto MapPrintablePage(NotePage page)
    {
        return new PrintableNotePageDto(
            page.Id,
            page.PageNumber,
            page.OrderIndex,
            page.WidthMm,
            page.HeightMm,
            page.Content,
            page.ContentFormat);
    }
}
