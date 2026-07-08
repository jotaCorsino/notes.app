namespace CadernoApp.Domain.Entities;

public sealed class NotePage
{
    public const decimal DefaultA4WidthMm = 210m;
    public const decimal DefaultA4HeightMm = 297m;
    public const string DefaultContentFormat = "html";

    public NotePage(
        Guid noteId,
        int pageNumber,
        string? content = null,
        int orderIndex = 0,
        string contentFormat = DefaultContentFormat,
        decimal widthMm = DefaultA4WidthMm,
        decimal heightMm = DefaultA4HeightMm)
    {
        if (noteId == Guid.Empty)
        {
            throw new ArgumentException("Note id is required.", nameof(noteId));
        }

        if (pageNumber <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(pageNumber), "Page number must be greater than zero.");
        }

        if (orderIndex < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(orderIndex), "Order index cannot be negative.");
        }

        if (widthMm <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(widthMm), "Width must be greater than zero.");
        }

        if (heightMm <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(heightMm), "Height must be greater than zero.");
        }

        Id = Guid.NewGuid();
        NoteId = noteId;
        PageNumber = pageNumber;
        Content = content ?? string.Empty;
        ContentFormat = EnsureRequired(contentFormat, nameof(contentFormat));
        WidthMm = widthMm;
        HeightMm = heightMm;
        OrderIndex = orderIndex;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid Id { get; }

    public Guid NoteId { get; }

    public int PageNumber { get; private set; }

    public string Content { get; private set; }

    public string ContentFormat { get; private set; }

    public decimal WidthMm { get; private set; }

    public decimal HeightMm { get; private set; }

    public int OrderIndex { get; private set; }

    public DateTimeOffset CreatedAt { get; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public void UpdateContent(string? content, string contentFormat = DefaultContentFormat)
    {
        Content = content ?? string.Empty;
        ContentFormat = EnsureRequired(contentFormat, nameof(contentFormat));
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
}
