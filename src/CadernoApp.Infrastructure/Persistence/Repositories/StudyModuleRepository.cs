using CadernoApp.Application.Abstractions;
using CadernoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CadernoApp.Infrastructure.Persistence.Repositories;

public sealed class StudyModuleRepository : IStudyModuleRepository
{
    private readonly CadernoAppDbContext _context;

    public StudyModuleRepository(CadernoAppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(StudyModule studyModule, CancellationToken cancellationToken = default)
    {
        await _context.StudyModules.AddAsync(studyModule, cancellationToken);
    }

    public async Task<IReadOnlyList<StudyModule>> ListBySubjectIdAsync(
        Guid subjectId,
        CancellationToken cancellationToken = default)
    {
        return await _context.StudyModules
            .AsNoTracking()
            .Where(module => module.SubjectId == subjectId)
            .OrderBy(module => module.OrderIndex)
            .ToListAsync(cancellationToken);
    }

    public async Task<StudyModule?> GetByIdAsync(
        Guid studyModuleId,
        bool includeNotes = false,
        CancellationToken cancellationToken = default)
    {
        var query = _context.StudyModules.AsQueryable();

        if (includeNotes)
        {
            query = query.Include(module => module.Notes);
        }

        return await query.SingleOrDefaultAsync(module => module.Id == studyModuleId, cancellationToken);
    }

    public void Remove(StudyModule studyModule)
    {
        _context.StudyModules.Remove(studyModule);
    }
}
