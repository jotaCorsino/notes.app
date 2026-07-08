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

    [Fact]
    public void Subject_Update_UpdatesBasicData()
    {
        var subject = new Subject("Mathematics");
        var previousUpdatedAt = subject.UpdatedAt;

        subject.Update("Physics", "Mechanics", "#00aaee");

        Assert.Equal("Physics", subject.Name);
        Assert.Equal("Mechanics", subject.Description);
        Assert.Equal("#00aaee", subject.Color);
        Assert.True(subject.UpdatedAt > previousUpdatedAt);
    }

    [Fact]
    public void Subject_AddModule_AddsModuleToSubject()
    {
        var subject = new Subject("Mathematics");

        var module = subject.AddModule("Algebra", "Core topics");

        Assert.Single(subject.Modules);
        Assert.Same(module, subject.Modules.Single());
        Assert.Equal(subject.Id, module.SubjectId);
        Assert.Equal("Algebra", module.Title);
        Assert.Equal("Core topics", module.Description);
        Assert.Equal(0, module.OrderIndex);
    }

    [Fact]
    public void Subject_AddModule_UsesNextOrderIndexWhenNotProvided()
    {
        var subject = new Subject("Mathematics");

        subject.AddModule("Algebra");
        var secondModule = subject.AddModule("Geometry");

        Assert.Equal(1, secondModule.OrderIndex);
    }

    [Fact]
    public void Subject_AddModule_WithDuplicateTitle_ThrowsInvalidOperationException()
    {
        var subject = new Subject("Mathematics");
        subject.AddModule("Algebra");

        Assert.Throws<InvalidOperationException>(() => subject.AddModule(" algebra "));
    }

    [Fact]
    public void Subject_AddModule_UpdatesUpdatedAt()
    {
        var subject = new Subject("Mathematics");
        var previousUpdatedAt = subject.UpdatedAt;

        subject.AddModule("Algebra");

        Assert.True(subject.UpdatedAt > previousUpdatedAt);
    }

    [Fact]
    public void StudyModule_AddNote_AddsNoteToModule()
    {
        var module = new StudyModule(Guid.NewGuid(), "Algebra");

        var note = module.AddNote("Linear equations");

        Assert.Single(module.Notes);
        Assert.Same(note, module.Notes.Single());
        Assert.Equal(module.Id, note.StudyModuleId);
        Assert.Equal("Linear equations", note.Title);
    }

    [Fact]
    public void StudyModule_AddNote_WithDuplicateTitle_ThrowsInvalidOperationException()
    {
        var module = new StudyModule(Guid.NewGuid(), "Algebra");
        module.AddNote("Linear equations");

        Assert.Throws<InvalidOperationException>(() => module.AddNote(" linear equations "));
    }

    [Fact]
    public void StudyModule_AddNote_UpdatesUpdatedAt()
    {
        var module = new StudyModule(Guid.NewGuid(), "Algebra");
        var previousUpdatedAt = module.UpdatedAt;

        module.AddNote("Linear equations");

        Assert.True(module.UpdatedAt > previousUpdatedAt);
    }

    [Fact]
    public void Note_AddPage_AddsFirstPageWithPageNumberOne()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");

        var page = note.AddPage("<p>First page</p>");

        Assert.Single(note.Pages);
        Assert.Same(page, note.Pages.Single());
        Assert.Equal(1, page.PageNumber);
        Assert.Equal(0, page.OrderIndex);
        Assert.Equal("<p>First page</p>", page.Content);
    }

    [Fact]
    public void Note_AddPage_AddsMultiplePagesWithSequentialNumbers()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");

        var firstPage = note.AddPage();
        var secondPage = note.AddPage();
        var thirdPage = note.AddPage();

        Assert.Equal(1, firstPage.PageNumber);
        Assert.Equal(2, secondPage.PageNumber);
        Assert.Equal(3, thirdPage.PageNumber);
        Assert.Equal(0, firstPage.OrderIndex);
        Assert.Equal(1, secondPage.OrderIndex);
        Assert.Equal(2, thirdPage.OrderIndex);
    }

    [Fact]
    public void Note_AddPage_UpdatesUpdatedAt()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");
        var previousUpdatedAt = note.UpdatedAt;

        note.AddPage();

        Assert.True(note.UpdatedAt > previousUpdatedAt);
    }

    [Fact]
    public void Note_AddTag_AddsTagToNote()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");

        var tag = note.AddTag("Important", "#ffcc00");

        Assert.Single(note.Tags);
        Assert.Same(tag, note.Tags.Single());
        Assert.Equal("Important", tag.Name);
        Assert.Equal("#ffcc00", tag.Color);
    }

    [Fact]
    public void Note_AddTag_WithExistingTag_AddsTagToNote()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");
        var tag = new Tag("Important", "#ffcc00");

        var addedTag = note.AddTag(tag);

        Assert.Same(tag, addedTag);
        Assert.Same(tag, note.Tags.Single());
    }

    [Fact]
    public void Note_AddTag_WithDuplicateName_ThrowsInvalidOperationException()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");
        note.AddTag("Important");

        Assert.Throws<InvalidOperationException>(() => note.AddTag(" important "));
    }

    [Fact]
    public void Note_AddTag_UpdatesUpdatedAt()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");
        var previousUpdatedAt = note.UpdatedAt;

        note.AddTag("Important");

        Assert.True(note.UpdatedAt > previousUpdatedAt);
    }

    [Fact]
    public void Note_RemoveTag_ByName_RemovesTag()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");
        note.AddTag("Important");

        var removed = note.RemoveTag(" important ");

        Assert.True(removed);
        Assert.Empty(note.Tags);
    }

    [Fact]
    public void Note_RemoveTag_ById_RemovesTag()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");
        var tag = note.AddTag("Important");

        var removed = note.RemoveTag(tag.Id);

        Assert.True(removed);
        Assert.Empty(note.Tags);
    }

    [Fact]
    public void Note_MarkAsFavorite_IsIdempotent()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");

        note.MarkAsFavorite();
        var updatedAtAfterFirstCall = note.UpdatedAt;
        note.MarkAsFavorite();

        Assert.True(note.IsFavorite);
        Assert.Equal(updatedAtAfterFirstCall, note.UpdatedAt);
    }

    [Fact]
    public void Note_UnmarkAsFavorite_IsIdempotent()
    {
        var note = new Note(Guid.NewGuid(), "Linear equations");

        note.UnmarkAsFavorite();

        Assert.False(note.IsFavorite);
        Assert.Equal(note.CreatedAt, note.UpdatedAt);
    }

    [Fact]
    public void NotePage_UpdateContent_UpdatesContent()
    {
        var page = new NotePage(Guid.NewGuid(), pageNumber: 1, content: "<p>Before</p>");

        page.UpdateContent("<p>After</p>", "markdown");

        Assert.Equal("<p>After</p>", page.Content);
        Assert.Equal("markdown", page.ContentFormat);
    }

    [Fact]
    public void NotePage_UpdateContent_UpdatesUpdatedAt()
    {
        var page = new NotePage(Guid.NewGuid(), pageNumber: 1);
        var previousUpdatedAt = page.UpdatedAt;

        page.UpdateContent("<p>After</p>");

        Assert.True(page.UpdatedAt > previousUpdatedAt);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void NotePage_WithInvalidPageNumber_ThrowsArgumentOutOfRangeException(int pageNumber)
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => new NotePage(Guid.NewGuid(), pageNumber));

        Assert.Equal("pageNumber", exception.ParamName);
    }

    [Fact]
    public void NotePage_WithNegativeOrderIndex_ThrowsArgumentOutOfRangeException()
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => new NotePage(Guid.NewGuid(), pageNumber: 1, orderIndex: -1));

        Assert.Equal("orderIndex", exception.ParamName);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void NotePage_WithInvalidWidth_ThrowsArgumentOutOfRangeException(decimal widthMm)
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => new NotePage(Guid.NewGuid(), pageNumber: 1, widthMm: widthMm));

        Assert.Equal("widthMm", exception.ParamName);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void NotePage_WithInvalidHeight_ThrowsArgumentOutOfRangeException(decimal heightMm)
    {
        var exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => new NotePage(Guid.NewGuid(), pageNumber: 1, heightMm: heightMm));

        Assert.Equal("heightMm", exception.ParamName);
    }
}
