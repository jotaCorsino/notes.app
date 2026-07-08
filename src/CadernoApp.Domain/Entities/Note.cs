namespace CadernoApp.Domain.Entities;

public sealed class Note
{
    private readonly List<NotePage> _pages = [];
    private readonly List<Tag> _tags = [];

    public Note(Guid studyModuleId, string title)
    {
        if (studyModuleId == Guid.Empty)
        {
            throw new ArgumentException("Study module id is required.", nameof(studyModuleId));
        }

        Id = Guid.NewGuid();
        StudyModuleId = studyModuleId;
        Title = EnsureRequired(title, nameof(title));
        IsFavorite = false;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid Id { get; }

    public Guid StudyModuleId { get; }

    public string Title { get; private set; }

    public bool IsFavorite { get; private set; }

    public DateTimeOffset CreatedAt { get; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public IReadOnlyCollection<NotePage> Pages => _pages;

    public IReadOnlyCollection<Tag> Tags => _tags;

    public void MarkAsFavorite()
    {
        if (IsFavorite)
        {
            return;
        }

        IsFavorite = true;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void UnmarkAsFavorite()
    {
        if (!IsFavorite)
        {
            return;
        }

        IsFavorite = false;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    private static string EnsureRequired(string value, string parameterName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value cannot be empty.", parameterName);
        }

        return value.Trim();
    }
}
