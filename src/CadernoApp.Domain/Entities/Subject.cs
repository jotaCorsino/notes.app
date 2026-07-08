namespace CadernoApp.Domain.Entities;

public sealed class Subject
{
    private readonly List<StudyModule> _modules = [];

    private Subject()
    {
        Name = string.Empty;
    }

    public Subject(string name, string? description = null, string? color = null)
    {
        Id = Guid.NewGuid();
        Name = EnsureRequired(name, nameof(name));
        Description = NormalizeOptional(description);
        Color = NormalizeOptional(color);
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; }

    public string? Description { get; private set; }

    public string? Color { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public IReadOnlyCollection<StudyModule> Modules => _modules;

    public StudyModule AddModule(string title, string? description = null, int? orderIndex = null)
    {
        var normalizedTitle = EnsureRequired(title, nameof(title));

        if (_modules.Any(module => string.Equals(module.Title, normalizedTitle, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("A module with the same title already exists in this subject.");
        }

        var module = new StudyModule(Id, normalizedTitle, orderIndex ?? GetNextModuleOrderIndex(), description);

        _modules.Add(module);
        Touch();

        return module;
    }

    private int GetNextModuleOrderIndex()
    {
        return _modules.Count == 0 ? 0 : _modules.Max(module => module.OrderIndex) + 1;
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
