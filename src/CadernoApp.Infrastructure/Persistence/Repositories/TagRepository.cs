using CadernoApp.Application.Abstractions;
using CadernoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CadernoApp.Infrastructure.Persistence.Repositories;

public sealed class TagRepository : ITagRepository
{
    private readonly CadernoAppDbContext _context;

    public TagRepository(CadernoAppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Tag tag, CancellationToken cancellationToken = default)
    {
        await _context.Tags.AddAsync(tag, cancellationToken);
    }

    public async Task<Tag?> GetByIdAsync(Guid tagId, CancellationToken cancellationToken = default)
    {
        return await _context.Tags.SingleOrDefaultAsync(tag => tag.Id == tagId, cancellationToken);
    }

    public async Task<Tag?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        var normalizedName = name.Trim().ToLowerInvariant();

        return await _context.Tags
            .SingleOrDefaultAsync(tag => tag.Name.ToLower() == normalizedName, cancellationToken);
    }
}
