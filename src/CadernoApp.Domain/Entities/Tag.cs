namespace CadernoApp.Domain.Entities;

public sealed class Tag
{
    public Tag(string name, string? color = null)
    {
        Id = Guid.NewGuid();
        Name = EnsureRequired(name, nameof(name));
        Color = NormalizeOptional(color);
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid Id { get; }

    public string Name { get; private set; }

    public string? Color { get; private set; }

    public DateTimeOffset CreatedAt { get; }

    public DateTimeOffset UpdatedAt { get; private set; }

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
