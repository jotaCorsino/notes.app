using CadernoApp.Domain.Entities;

namespace CadernoApp.Application.Abstractions;

public interface INoteRepository
{
    Task AddAsync(Note note, CancellationToken cancellationToken = default);

    Task AddPageAsync(NotePage page, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Note>> ListByStudyModuleIdAsync(
        Guid studyModuleId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Note>> ListFavoritesAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Note>> SearchAsync(
        string searchTerm,
        CancellationToken cancellationToken = default);

    Task<Note?> GetByIdAsync(
        Guid noteId,
        bool includePages = false,
        bool includeTags = false,
        CancellationToken cancellationToken = default);

    void Remove(Note note);
}
