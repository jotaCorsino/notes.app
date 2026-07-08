using CadernoApp.Domain.Entities;

namespace CadernoApp.Application.Abstractions;

public interface IStudyModuleRepository
{
    Task AddAsync(StudyModule studyModule, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<StudyModule>> ListBySubjectIdAsync(
        Guid subjectId,
        CancellationToken cancellationToken = default);

    Task<StudyModule?> GetByIdAsync(
        Guid studyModuleId,
        bool includeNotes = false,
        CancellationToken cancellationToken = default);

    void Remove(StudyModule studyModule);
}
