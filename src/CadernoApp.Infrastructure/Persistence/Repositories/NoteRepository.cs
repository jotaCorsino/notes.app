using CadernoApp.Application.Abstractions;
using CadernoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CadernoApp.Infrastructure.Persistence.Repositories;

public sealed class NoteRepository : INoteRepository
{
    private readonly CadernoAppDbContext _context;

    public NoteRepository(CadernoAppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Note note, CancellationToken cancellationToken = default)
    {
        await _context.Notes.AddAsync(note, cancellationToken);
    }

    public async Task AddPageAsync(NotePage page, CancellationToken cancellationToken = default)
    {
        await _context.NotePages.AddAsync(page, cancellationToken);
    }

    public async Task<IReadOnlyList<Note>> ListByStudyModuleIdAsync(
        Guid studyModuleId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Notes
            .Include(note => note.Pages)
            .Include(note => note.Tags)
            .AsNoTracking()
            .Where(note => note.StudyModuleId == studyModuleId)
            .OrderBy(note => note.Title)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Note>> ListFavoritesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Notes
            .Include(note => note.Pages)
            .Include(note => note.Tags)
            .AsNoTracking()
            .Where(note => note.IsFavorite)
            .OrderBy(note => note.Title)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Note>> SearchAsync(
        string searchTerm,
        CancellationToken cancellationToken = default)
    {
        var likeTerm = $"%{searchTerm}%";

        return await _context.Notes
            .Include(note => note.Pages)
            .Include(note => note.Tags)
            .AsNoTracking()
            .Where(note =>
                EF.Functions.Like(note.Title, likeTerm)
                || note.Tags.Any(tag => EF.Functions.Like(tag.Name, likeTerm)))
            .OrderBy(note => note.Title)
            .ToListAsync(cancellationToken);
    }

    public async Task<Note?> GetByIdAsync(
        Guid noteId,
        bool includePages = false,
        bool includeTags = false,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Notes.AsQueryable();

        if (includePages)
        {
            query = query.Include(note => note.Pages);
        }

        if (includeTags)
        {
            query = query.Include(note => note.Tags);
        }

        return await query.SingleOrDefaultAsync(note => note.Id == noteId, cancellationToken);
    }

    public void Remove(Note note)
    {
        _context.Notes.Remove(note);
    }
}
