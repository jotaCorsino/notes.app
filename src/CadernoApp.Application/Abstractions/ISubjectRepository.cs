using CadernoApp.Domain.Entities;

namespace CadernoApp.Application.Abstractions;

public interface ISubjectRepository
{
    Task AddAsync(Subject subject, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Subject>> ListAsync(CancellationToken cancellationToken = default);

    Task<Subject?> GetByIdAsync(
        Guid subjectId,
        bool includeModules = false,
        CancellationToken cancellationToken = default);

    void Remove(Subject subject);
}
