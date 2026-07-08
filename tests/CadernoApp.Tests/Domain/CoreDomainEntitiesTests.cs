using CadernoApp.Domain.Entities;

namespace CadernoApp.Tests.Domain;

public sealed class CoreDomainEntitiesTests
{
    [Fact]
    public void Subject_WithValidName_IsCreated()
    {
        var subject = new Subject("Mathematics", "Study notes", "#3366ff");

        Assert.NotEqual(Guid.Empty, subject.Id);
        Assert.Equal("Mathematics", subject.Name);
        Assert.Equal("Study notes", subject.Description);
        Assert.Equal("#3366ff", subject.Color);
        Assert.Empty(subject.Modules);
        Assert.Equal(subject.CreatedAt, subject.UpdatedAt);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Subject_WithEmptyName_ThrowsArgumentException(string? name)
    {
        var exception = Assert.Throws<ArgumentException>(() => new Subject(name!));

        Assert.Equal("name", exception.ParamName);
    }

    [Fact]
    public void StudyModule_WithSubjectId_IsCreated()
    {
        var subjectId = Guid.NewGuid();

        var module = new StudyModule(subjectId, "Algebra", orderIndex: 1, description: "Core topics");

        Assert.NotEqual(Guid.Empty, module.Id);
        Assert.Equal(subjectId, module.SubjectId);
        Assert.Equal("Algebra", module.Title);
        Assert.Equal("Core topics", module.Description);
        Assert.Equal(1, module.OrderIndex);
        Assert.Empty(module.Notes);
    }

    [Fact]
    public void Note_WithStudyModuleId_IsCreatedNotFavorite()
    {
        var studyModuleId = Guid.NewGuid();

        var note = new Note(studyModuleId, "Linear equations");

        Assert.NotEqual(Guid.Empty, note.Id);
        Assert.Equal(studyModuleId, note.StudyModuleId);
        Assert.Equal("Linear equations", note.Title);
        Assert.False(note.IsFavorite);
        Assert.Empty(note.Pages);
        Assert.Empty(note.Tags);
    }

    [Fact]
    public void Note_CanBeMarkedAsFavoriteAndUnmarked()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");

        note.MarkAsFavorite();

        Assert.True(note.IsFavorite);

        note.UnmarkAsFavorite();

        Assert.False(note.IsFavorite);
    }

    [Fact]
    public void NotePage_UsesDefaultA4Size()
    {
        var noteId = Guid.NewGuid();

        var page = new NotePage(noteId, pageNumber: 1, content: "<p>Hello</p>");

        Assert.NotEqual(Guid.Empty, page.Id);
        Assert.Equal(noteId, page.NoteId);
        Assert.Equal(1, page.PageNumber);
        Assert.Equal("<p>Hello</p>", page.Content);
        Assert.Equal("html", page.ContentFormat);
        Assert.Equal(210m, page.WidthMm);
        Assert.Equal(297m, page.HeightMm);
        Assert.Equal(0, page.OrderIndex);
    }

    [Fact]
    public void Tag_WithValidName_IsCreated()
    {
        var tag = new Tag("Important", "#ffcc00");

        Assert.NotEqual(Guid.Empty, tag.Id);
        Assert.Equal("Important", tag.Name);
        Assert.Equal("#ffcc00", tag.Color);
        Assert.Equal(tag.CreatedAt, tag.UpdatedAt);
    }
}
