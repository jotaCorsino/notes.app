using CadernoApp.Domain.Entities;
using CadernoApp.Infrastructure.Persistence;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace CadernoApp.Tests.Infrastructure;

public sealed class CadernoAppDbContextTests
{
    [Fact]
    public async Task CanPersistSubject()
    {
        await using var connection = await OpenConnectionAsync();
        await EnsureDatabaseCreatedAsync(connection);

        var subject = new Subject("Mathematics", "Study notes", "#3366ff");

        await using (var context = CreateContext(connection))
        {
            context.Subjects.Add(subject);
            await context.SaveChangesAsync();
        }

        await using (var context = CreateContext(connection))
        {
            var savedSubject = await context.Subjects.SingleAsync();

            Assert.Equal(subject.Id, savedSubject.Id);
            Assert.Equal("Mathematics", savedSubject.Name);
            Assert.Equal("Study notes", savedSubject.Description);
            Assert.Equal("#3366ff", savedSubject.Color);
        }
    }

    [Fact]
    public async Task CanPersistSubjectWithStudyModule()
    {
        await using var connection = await OpenConnectionAsync();
        await EnsureDatabaseCreatedAsync(connection);

        var subject = new Subject("Mathematics");
        var module = subject.AddModule("Algebra");

        await using (var context = CreateContext(connection))
        {
            context.Subjects.Add(subject);
            await context.SaveChangesAsync();
        }

        await using (var context = CreateContext(connection))
        {
            var savedSubject = await context.Subjects
                .Include(saved => saved.Modules)
                .SingleAsync();

            var savedModule = Assert.Single(savedSubject.Modules);
            Assert.Equal(module.Id, savedModule.Id);
            Assert.Equal(savedSubject.Id, savedModule.SubjectId);
            Assert.Equal("Algebra", savedModule.Title);
        }
    }

    [Fact]
    public async Task CanPersistStudyModuleWithNote()
    {
        await using var connection = await OpenConnectionAsync();
        await EnsureDatabaseCreatedAsync(connection);

        var subject = new Subject("Mathematics");
        var module = subject.AddModule("Algebra");
        var note = module.AddNote("Linear equations");

        await using (var context = CreateContext(connection))
        {
            context.Subjects.Add(subject);
            await context.SaveChangesAsync();
        }

        await using (var context = CreateContext(connection))
        {
            var savedModule = await context.StudyModules
                .Include(saved => saved.Notes)
                .SingleAsync();

            var savedNote = Assert.Single(savedModule.Notes);
            Assert.Equal(note.Id, savedNote.Id);
            Assert.Equal(savedModule.Id, savedNote.StudyModuleId);
            Assert.Equal("Linear equations", savedNote.Title);
        }
    }

    [Fact]
    public async Task CanPersistNoteWithNotePage()
    {
        await using var connection = await OpenConnectionAsync();
        await EnsureDatabaseCreatedAsync(connection);

        var subject = new Subject("Mathematics");
        var module = subject.AddModule("Algebra");
        var note = module.AddNote("Linear equations");
        var page = note.AddPage("<p>First page</p>");

        await using (var context = CreateContext(connection))
        {
            context.Subjects.Add(subject);
            await context.SaveChangesAsync();
        }

        await using (var context = CreateContext(connection))
        {
            var savedNote = await context.Notes
                .Include(saved => saved.Pages)
                .SingleAsync();

            var savedPage = Assert.Single(savedNote.Pages);
            Assert.Equal(page.Id, savedPage.Id);
            Assert.Equal(savedNote.Id, savedPage.NoteId);
            Assert.Equal(1, savedPage.PageNumber);
            Assert.Equal("<p>First page</p>", savedPage.Content);
            Assert.Equal(210m, savedPage.WidthMm);
            Assert.Equal(297m, savedPage.HeightMm);
        }
    }

    [Fact]
    public async Task CanPersistNoteWithTag()
    {
        await using var connection = await OpenConnectionAsync();
        await EnsureDatabaseCreatedAsync(connection);

        var subject = new Subject("Mathematics");
        var module = subject.AddModule("Algebra");
        var note = module.AddNote("Linear equations");
        var tag = note.AddTag("Important", "#ffcc00");

        await using (var context = CreateContext(connection))
        {
            context.Subjects.Add(subject);
            await context.SaveChangesAsync();
        }

        await using (var context = CreateContext(connection))
        {
            var savedNote = await context.Notes
                .Include(saved => saved.Tags)
                .SingleAsync();

            var savedTag = Assert.Single(savedNote.Tags);
            Assert.Equal(tag.Id, savedTag.Id);
            Assert.Equal("Important", savedTag.Name);
            Assert.Equal("#ffcc00", savedTag.Color);
        }
    }

    private static async Task<SqliteConnection> OpenConnectionAsync()
    {
        var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();

        return connection;
    }

    private static CadernoAppDbContext CreateContext(SqliteConnection connection)
    {
        var options = new DbContextOptionsBuilder<CadernoAppDbContext>()
            .UseSqlite(connection)
            .Options;

        return new CadernoAppDbContext(options);
    }

    private static async Task EnsureDatabaseCreatedAsync(SqliteConnection connection)
    {
        await using var context = CreateContext(connection);
        await context.Database.EnsureCreatedAsync();
    }
}
