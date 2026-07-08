using CadernoApp.Application.Abstractions;

namespace CadernoApp.Infrastructure.Persistence.Repositories;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly CadernoAppDbContext _context;

    public UnitOfWork(CadernoAppDbContext context)
    {
        _context = context;
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}
