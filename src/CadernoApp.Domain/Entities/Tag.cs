namespace CadernoApp.Domain.Entities;

public sealed class Tag
{
    private Tag()
    {
        Name = string.Empty;
    }

    public Tag(string name, string? color = null)
    {
        Id = Guid.NewGuid();
        Name = EnsureRequired(name, nameof(name));
        Color = NormalizeOptional(color);
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid Id { get; private set; }

    public string Name { get; private set; }

    public string? Color { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public void Update(string name, string? color = null)
    {
        Name = EnsureRequired(name, nameof(name));
        Color = NormalizeOptional(color);
        Touch();
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
