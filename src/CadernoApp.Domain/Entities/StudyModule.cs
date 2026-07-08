namespace CadernoApp.Domain.Entities;

public sealed class StudyModule
{
    private readonly List<Note> _notes = [];

    private StudyModule()
    {
        Title = string.Empty;
    }

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

    public Guid Id { get; private set; }

    public Guid SubjectId { get; private set; }

    public string Title { get; private set; }

    public string? Description { get; private set; }

    public int OrderIndex { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public IReadOnlyCollection<Note> Notes => _notes;

    public Note AddNote(string title)
    {
        var normalizedTitle = EnsureRequired(title, nameof(title));

        if (_notes.Any(note => string.Equals(note.Title, normalizedTitle, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("A note with the same title already exists in this module.");
        }

        var note = new Note(Id, normalizedTitle);

        _notes.Add(note);
        Touch();

        return note;
    }

    private void Touch()
    {
        var now = DateTimeOffset.UtcNow;
        UpdatedAt = now > UpdatedAt ? now : UpdatedAt.AddTicks(1);
    }

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
