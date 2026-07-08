using CadernoApp.Application.Abstractions;
using CadernoApp.Application.DTOs;
using CadernoApp.Domain.Entities;

namespace CadernoApp.Application.Services;

public sealed class NoteService
{
    private readonly IStudyModuleRepository _studyModuleRepository;
    private readonly INoteRepository _noteRepository;
    private readonly ITagRepository _tagRepository;
    private readonly IUnitOfWork _unitOfWork;

    public NoteService(
        IStudyModuleRepository studyModuleRepository,
        INoteRepository noteRepository,
        ITagRepository tagRepository,
        IUnitOfWork unitOfWork)
    {
        _studyModuleRepository = studyModuleRepository;
        _noteRepository = noteRepository;
        _tagRepository = tagRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<NoteSummaryDto> CreateAsync(
        Guid studyModuleId,
        string title,
        CancellationToken cancellationToken = default)
    {
        var module = await _studyModuleRepository.GetByIdAsync(studyModuleId, includeNotes: true, cancellationToken)
            ?? throw new KeyNotFoundException($"Study module '{studyModuleId}' was not found.");

        var note = module.AddNote(title);

        await _noteRepository.AddAsync(note, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapNoteSummary(note);
    }

    public async Task<IReadOnlyList<NoteSummaryDto>> ListByStudyModuleIdAsync(
        Guid studyModuleId,
        CancellationToken cancellationToken = default)
    {
        var notes = await _noteRepository.ListByStudyModuleIdAsync(studyModuleId, cancellationToken);

        return notes.Select(MapNoteSummary).ToList();
    }

    public async Task<NoteDto> GetByIdAsync(Guid noteId, CancellationToken cancellationToken = default)
    {
        var note = await GetNoteOrThrowAsync(noteId, includePages: true, includeTags: true, cancellationToken);

        return MapNote(note);
    }

    public async Task<NotePageDto> AddPageAsync(
        Guid noteId,
        string? content = null,
        string contentFormat = NotePage.DefaultContentFormat,
        CancellationToken cancellationToken = default)
    {
        var note = await GetNoteOrThrowAsync(noteId, includePages: true, includeTags: false, cancellationToken);
        var page = note.AddPage(content, contentFormat);

        await _noteRepository.AddPageAsync(page, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapPage(page);
    }

    public async Task<NotePageDto> UpdatePageContentAsync(
        Guid noteId,
        Guid pageId,
        string? content,
        string contentFormat = NotePage.DefaultContentFormat,
        CancellationToken cancellationToken = default)
    {
        var note = await GetNoteOrThrowAsync(noteId, includePages: true, includeTags: false, cancellationToken);
        var page = note.Pages.SingleOrDefault(page => page.Id == pageId)
            ?? throw new KeyNotFoundException($"Note page '{pageId}' was not found.");

        page.UpdateContent(content, contentFormat);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapPage(page);
    }

    public async Task<TagDto> AddTagAsync(
        Guid noteId,
        string name,
        string? color = null,
        CancellationToken cancellationToken = default)
    {
        var note = await GetNoteOrThrowAsync(noteId, includePages: false, includeTags: true, cancellationToken);
        var existingTag = await _tagRepository.GetByNameAsync(name, cancellationToken);
        var tag = existingTag is null ? note.AddTag(name, color) : note.AddTag(existingTag);

        if (existingTag is null)
        {
            await _tagRepository.AddAsync(tag, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapTag(tag);
    }

    public async Task<NoteDto> RemoveTagAsync(
        Guid noteId,
        string tagName,
        CancellationToken cancellationToken = default)
    {
        var note = await GetNoteOrThrowAsync(noteId, includePages: true, includeTags: true, cancellationToken);

        if (!note.RemoveTag(tagName))
        {
            throw new KeyNotFoundException($"Tag '{tagName}' was not found in note '{noteId}'.");
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapNote(note);
    }

    public async Task<NoteDto> RemoveTagAsync(
        Guid noteId,
        Guid tagId,
        CancellationToken cancellationToken = default)
    {
        var note = await GetNoteOrThrowAsync(noteId, includePages: true, includeTags: true, cancellationToken);

        if (!note.RemoveTag(tagId))
        {
            throw new KeyNotFoundException($"Tag '{tagId}' was not found in note '{noteId}'.");
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapNote(note);
    }

    public async Task<NoteSummaryDto> MarkAsFavoriteAsync(
        Guid noteId,
        CancellationToken cancellationToken = default)
    {
        var note = await GetNoteOrThrowAsync(noteId, includePages: false, includeTags: true, cancellationToken);

        note.MarkAsFavorite();
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapNoteSummary(note);
    }

    public async Task<NoteSummaryDto> UnmarkAsFavoriteAsync(
        Guid noteId,
        CancellationToken cancellationToken = default)
    {
        var note = await GetNoteOrThrowAsync(noteId, includePages: false, includeTags: true, cancellationToken);

        note.UnmarkAsFavorite();
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapNoteSummary(note);
    }

    public async Task<IReadOnlyList<NoteSummaryDto>> ListFavoritesAsync(
        CancellationToken cancellationToken = default)
    {
        var notes = await _noteRepository.ListFavoritesAsync(cancellationToken);

        return notes.Select(MapNoteSummary).ToList();
    }

    public async Task<IReadOnlyList<NoteSummaryDto>> SearchAsync(
        string searchTerm,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return [];
        }

        var notes = await _noteRepository.SearchAsync(searchTerm.Trim(), cancellationToken);

        return notes.Select(MapNoteSummary).ToList();
    }

    private async Task<Note> GetNoteOrThrowAsync(
        Guid noteId,
        bool includePages,
        bool includeTags,
        CancellationToken cancellationToken)
    {
        var note = await _noteRepository.GetByIdAsync(noteId, includePages, includeTags, cancellationToken);

        return note ?? throw new KeyNotFoundException($"Note '{noteId}' was not found.");
    }

    private static NoteDto MapNote(Note note)
    {
        return new NoteDto(
            note.Id,
            note.StudyModuleId,
            note.Title,
            note.IsFavorite,
            note.CreatedAt,
            note.UpdatedAt,
            note.Pages
                .OrderBy(page => page.OrderIndex)
                .Select(MapPage)
                .ToList(),
            note.Tags
                .OrderBy(tag => tag.Name)
                .Select(MapTag)
                .ToList());
    }

    private static NoteSummaryDto MapNoteSummary(Note note)
    {
        return new NoteSummaryDto(
            note.Id,
            note.StudyModuleId,
            note.Title,
            note.IsFavorite,
            note.CreatedAt,
            note.UpdatedAt,
            note.Pages.Count,
            note.Tags
                .OrderBy(tag => tag.Name)
                .Select(tag => tag.Name)
                .ToList());
    }

    private static NotePageDto MapPage(NotePage page)
    {
        return new NotePageDto(
            page.Id,
            page.NoteId,
            page.PageNumber,
            page.Content,
            page.ContentFormat,
            page.WidthMm,
            page.HeightMm,
            page.OrderIndex,
            page.CreatedAt,
            page.UpdatedAt);
    }

    private static TagDto MapTag(Tag tag)
    {
        return new TagDto(
            tag.Id,
            tag.Name,
            tag.Color,
            tag.CreatedAt,
            tag.UpdatedAt);
    }
}
