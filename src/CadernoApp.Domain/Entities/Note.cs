namespace CadernoApp.Domain.Entities;

public sealed class Note
{
    private readonly List<NotePage> _pages = [];
    private readonly List<Tag> _tags = [];

    private Note()
    {
        Title = string.Empty;
    }

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

    public Guid Id { get; private set; }

    public Guid StudyModuleId { get; private set; }

    public string Title { get; private set; }

    public bool IsFavorite { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public IReadOnlyCollection<NotePage> Pages => _pages;

    public IReadOnlyCollection<Tag> Tags => _tags;

    public NotePage AddPage(
        string? content = null,
        string contentFormat = NotePage.DefaultContentFormat,
        decimal widthMm = NotePage.DefaultA4WidthMm,
        decimal heightMm = NotePage.DefaultA4HeightMm)
    {
        var pageNumber = GetNextPageNumber();

        if (_pages.Any(page => page.PageNumber == pageNumber))
        {
            throw new InvalidOperationException("A page with the same number already exists in this note.");
        }

        var page = new NotePage(
            Id,
            pageNumber,
            content,
            GetNextPageOrderIndex(),
            contentFormat,
            widthMm,
            heightMm);

        _pages.Add(page);
        Touch();

        return page;
    }

    public Tag AddTag(string name, string? color = null)
    {
        var normalizedName = EnsureRequired(name, nameof(name));

        if (_tags.Any(tag => string.Equals(tag.Name, normalizedName, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("A tag with the same name already exists in this note.");
        }

        var tag = new Tag(normalizedName, color);

        _tags.Add(tag);
        Touch();

        return tag;
    }

    public bool RemoveTag(Guid tagId)
    {
        var tag = _tags.SingleOrDefault(tag => tag.Id == tagId);

        if (tag is null)
        {
            return false;
        }

        _tags.Remove(tag);
        Touch();

        return true;
    }

    public bool RemoveTag(string name)
    {
        var normalizedName = EnsureRequired(name, nameof(name));
        var tag = _tags.SingleOrDefault(tag => string.Equals(tag.Name, normalizedName, StringComparison.OrdinalIgnoreCase));

        if (tag is null)
        {
            return false;
        }

        _tags.Remove(tag);
        Touch();

        return true;
    }

    public void MarkAsFavorite()
    {
        if (IsFavorite)
        {
            return;
        }

        IsFavorite = true;
        Touch();
    }

    public void UnmarkAsFavorite()
    {
        if (!IsFavorite)
        {
            return;
        }

        IsFavorite = false;
        Touch();
    }

    private int GetNextPageNumber()
    {
        return _pages.Count == 0 ? 1 : _pages.Max(page => page.PageNumber) + 1;
    }

    private int GetNextPageOrderIndex()
    {
        return _pages.Count == 0 ? 0 : _pages.Max(page => page.OrderIndex) + 1;
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
