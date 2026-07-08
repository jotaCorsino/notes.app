namespace CadernoApp.Domain.Entities;

public sealed class StudyModule
{
    private readonly List<Note> _notes = [];

    public StudyModule(Guid subjectId, string title, int orderIndex = 0, string? description = null)
    {
        if (subjectId == Guid.Empty)
        {
            throw new ArgumentException("Subject id is required.", nameof(subjectId));
        }

        if (orderIndex < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(orderIndex), "Order index cannot be negative.");
        }

        Id = Guid.NewGuid();
        SubjectId = subjectId;
        Title = EnsureRequired(title, nameof(title));
        Description = NormalizeOptional(description);
        OrderIndex = orderIndex;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid Id { get; }

    public Guid SubjectId { get; }

    public string Title { get; private set; }

    public string? Description { get; private set; }

    public int OrderIndex { get; private set; }

    public DateTimeOffset CreatedAt { get; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public IReadOnlyCollection<Note> Notes => _notes;

    private static string EnsureRequired(string value, string parameterName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value cannot be empty.", parameterName);
        }

        return value.Trim();
    }

    private static string? NormalizeOptional(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
