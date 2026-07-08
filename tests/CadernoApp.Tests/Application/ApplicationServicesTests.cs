using CadernoApp.Application.Services;
using CadernoApp.Infrastructure.Persistence;
using CadernoApp.Infrastructure.Persistence.Repositories;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace CadernoApp.Tests.Application;

public sealed class ApplicationServicesTests
{
    [Fact]
    public async Task SubjectService_CreatesSubject()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();

        var subject = await fixture.SubjectService.CreateAsync("Mathematics", "Study notes", "#3366ff");

        Assert.NotEqual(Guid.Empty, subject.Id);
        Assert.Equal("Mathematics", subject.Name);
        Assert.Equal("Study notes", subject.Description);
        Assert.Equal("#3366ff", subject.Color);
    }

    [Fact]
    public async Task SubjectService_ListsSubjects()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();
        await fixture.SubjectService.CreateAsync("Mathematics");
        await fixture.SubjectService.CreateAsync("Physics");

        var subjects = await fixture.SubjectService.ListAsync();

        Assert.Equal(["Mathematics", "Physics"], subjects.Select(subject => subject.Name));
    }

    [Fact]
    public async Task SubjectService_UpdatesSubject()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();
        var subject = await fixture.SubjectService.CreateAsync("Mathematics");

        var updatedSubject = await fixture.SubjectService.UpdateAsync(subject.Id, "Physics", "Mechanics", "#00aaee");

        Assert.Equal("Physics", updatedSubject.Name);
        Assert.Equal("Mechanics", updatedSubject.Description);
        Assert.Equal("#00aaee", updatedSubject.Color);
        Assert.True(updatedSubject.UpdatedAt > subject.UpdatedAt);
    }

    [Fact]
    public async Task StudyModuleService_CreatesModuleInsideSubject()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();
        var subject = await fixture.SubjectService.CreateAsync("Mathematics");

        var module = await fixture.StudyModuleService.CreateAsync(subject.Id, "Algebra");

        Assert.NotEqual(Guid.Empty, module.Id);
        Assert.Equal(subject.Id, module.SubjectId);
        Assert.Equal("Algebra", module.Title);
        Assert.Equal(0, module.OrderIndex);
    }

    [Fact]
    public async Task NoteService_CreatesNoteInsideModule()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();
        var module = await CreateModuleAsync(fixture);

        var note = await fixture.NoteService.CreateAsync(module.Id, "Linear equations");

        Assert.NotEqual(Guid.Empty, note.Id);
        Assert.Equal(module.Id, note.StudyModuleId);
        Assert.Equal("Linear equations", note.Title);
        Assert.False(note.IsFavorite);
    }

    [Fact]
    public async Task NoteService_AddsPage()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();
        var note = await CreateNoteAsync(fixture);

        var page = await fixture.NoteService.AddPageAsync(note.Id, "<p>First page</p>");

        Assert.NotEqual(Guid.Empty, page.Id);
        Assert.Equal(note.Id, page.NoteId);
        Assert.Equal(1, page.PageNumber);
        Assert.Equal("<p>First page</p>", page.Content);
    }

    [Fact]
    public async Task NoteService_UpdatesPageContent()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();
        var note = await CreateNoteAsync(fixture);
        var page = await fixture.NoteService.AddPageAsync(note.Id, "<p>Before</p>");

        var updatedPage = await fixture.NoteService.UpdatePageContentAsync(note.Id, page.Id, "<p>After</p>");

        Assert.Equal("<p>After</p>", updatedPage.Content);
        Assert.True(updatedPage.UpdatedAt > page.UpdatedAt);
    }

    [Fact]
    public async Task NoteService_AddsTag()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();
        var note = await CreateNoteAsync(fixture);

        var tag = await fixture.NoteService.AddTagAsync(note.Id, "Important", "#ffcc00");

        Assert.NotEqual(Guid.Empty, tag.Id);
        Assert.Equal("Important", tag.Name);
        Assert.Equal("#ffcc00", tag.Color);
    }

    [Fact]
    public async Task NoteService_RemovesTag()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();
        var note = await CreateNoteAsync(fixture);
        await fixture.NoteService.AddTagAsync(note.Id, "Important");

        var updatedNote = await fixture.NoteService.RemoveTagAsync(note.Id, "important");

        Assert.Empty(updatedNote.Tags);
    }

    [Fact]
    public async Task NoteService_MarksAndUnmarksFavorite()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();
        var note = await CreateNoteAsync(fixture);

        var favoriteNote = await fixture.NoteService.MarkAsFavoriteAsync(note.Id);
        var regularNote = await fixture.NoteService.UnmarkAsFavoriteAsync(note.Id);

        Assert.True(favoriteNote.IsFavorite);
        Assert.False(regularNote.IsFavorite);
    }

    [Fact]
    public async Task NoteService_ListsFavorites()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();
        var firstNote = await CreateNoteAsync(fixture, "Linear equations");
        await CreateNoteAsync(fixture, "Quadratic equations");
        await fixture.NoteService.MarkAsFavoriteAsync(firstNote.Id);

        var favorites = await fixture.NoteService.ListFavoritesAsync();

        var favorite = Assert.Single(favorites);
        Assert.Equal(firstNote.Id, favorite.Id);
        Assert.True(favorite.IsFavorite);
    }

    [Fact]
    public async Task NoteService_SearchesByTitleAndTag()
    {
        await using var fixture = await ApplicationServicesFixture.CreateAsync();
        var firstNote = await CreateNoteAsync(fixture, "Linear equations");
        var secondNote = await CreateNoteAsync(fixture, "Geometry basics");
        await fixture.NoteService.AddTagAsync(secondNote.Id, "Important");

        var byTitle = await fixture.NoteService.SearchAsync("linear");
        var byTag = await fixture.NoteService.SearchAsync("important");

        Assert.Equal(firstNote.Id, Assert.Single(byTitle).Id);
        Assert.Equal(secondNote.Id, Assert.Single(byTag).Id);
    }

    private static async Task<CadernoApp.Application.DTOs.StudyModuleDto> CreateModuleAsync(
        ApplicationServicesFixture fixture)
    {
        var subject = await fixture.SubjectService.CreateAsync("Mathematics");

        return await fixture.StudyModuleService.CreateAsync(subject.Id, "Algebra");
    }

    private static async Task<CadernoApp.Application.DTOs.NoteSummaryDto> CreateNoteAsync(
        ApplicationServicesFixture fixture,
        string title = "Linear equations")
    {
        var module = await CreateModuleAsync(fixture);

        return await fixture.NoteService.CreateAsync(module.Id, title);
    }

    private sealed class ApplicationServicesFixture : IAsyncDisposable
    {
        private ApplicationServicesFixture(SqliteConnection connection, CadernoAppDbContext context)
        {
            Connection = connection;
            Context = context;

            var subjectRepository = new SubjectRepository(Context);
            var studyModuleRepository = new StudyModuleRepository(Context);
            var noteRepository = new NoteRepository(Context);
            var tagRepository = new TagRepository(Context);
            var unitOfWork = new UnitOfWork(Context);

            SubjectService = new SubjectService(subjectRepository, unitOfWork);
            StudyModuleService = new StudyModuleService(subjectRepository, studyModuleRepository, unitOfWork);
            NoteService = new NoteService(studyModuleRepository, noteRepository, tagRepository, unitOfWork);
        }

        public SubjectService SubjectService { get; }

        public StudyModuleService StudyModuleService { get; }

        public NoteService NoteService { get; }

        private SqliteConnection Connection { get; }

        private CadernoAppDbContext Context { get; }

        public static async Task<ApplicationServicesFixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();

            var options = new DbContextOptionsBuilder<CadernoAppDbContext>()
                .UseSqlite(connection)
                .Options;

            var context = new CadernoAppDbContext(options);
            await context.Database.EnsureCreatedAsync();

            return new ApplicationServicesFixture(connection, context);
        }

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await Connection.DisposeAsync();
        }
    }
}
