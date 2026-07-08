using CadernoApp.Application.Abstractions;
using CadernoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CadernoApp.Infrastructure.Persistence.Repositories;

public sealed class SubjectRepository : ISubjectRepository
{
    private readonly CadernoAppDbContext _context;

    public SubjectRepository(CadernoAppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Subject subject, CancellationToken cancellationToken = default)
    {
        await _context.Subjects.AddAsync(subject, cancellationToken);
    }

    public async Task<IReadOnlyList<Subject>> ListAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Subjects
            .Include(subject => subject.Modules)
            .AsNoTracking()
            .OrderBy(subject => subject.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Subject?> GetByIdAsync(
        Guid subjectId,
        bool includeModules = false,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Subjects.AsQueryable();

        if (includeModules)
        {
            query = query.Include(subject => subject.Modules);
        }

        return await query.SingleOrDefaultAsync(subject => subject.Id == subjectId, cancellationToken);
    }

    public void Remove(Subject subject)
    {
        _context.Subjects.Remove(subject);
    }
}
