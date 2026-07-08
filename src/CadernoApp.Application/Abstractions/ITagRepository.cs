using CadernoApp.Domain.Entities;

namespace CadernoApp.Application.Abstractions;

public interface ITagRepository
{
    Task AddAsync(Tag tag, CancellationToken cancellationToken = default);

    Task<Tag?> GetByIdAsync(Guid tagId, CancellationToken cancellationToken = default);

    Task<Tag?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
}
