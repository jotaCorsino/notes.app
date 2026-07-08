namespace CadernoApp.Domain.Entities;

public sealed class Subject
{
    private readonly List<StudyModule> _modules = [];

    public Subject(string name, string? description = null, string? color = null)
    {
        Id = Guid.NewGuid();
        Name = EnsureRequired(name, nameof(name));
        Description = NormalizeOptional(description);
        Color = NormalizeOptional(color);
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid Id { get; }

    public string Name { get; private set; }

    public string? Description { get; private set; }

    public string? Color { get; private set; }

    public DateTimeOffset CreatedAt { get; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public IReadOnlyCollection<StudyModule> Modules => _modules;

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
