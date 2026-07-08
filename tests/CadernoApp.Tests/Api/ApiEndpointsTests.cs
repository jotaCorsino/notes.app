using System.Net;
using System.Net.Http.Json;
using CadernoApp.Api.Contracts.Notes;
using CadernoApp.Api.Contracts.StudyModules;
using CadernoApp.Api.Contracts.Subjects;
using CadernoApp.Application.DTOs;
using CadernoApp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace CadernoApp.Tests.Api;

public sealed class ApiEndpointsTests
{
    [Fact]
    public async Task PostSubject_CreatesSubject()
    {
        await using var factory = await CadernoAppApiFactory.CreateAsync();
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync(
            "/api/subjects",
            new CreateSubjectRequest
            {
                Name = "Mathematics",
                Description = "Study notes",
                Color = "#3366ff"
            });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var subject = await response.Content.ReadFromJsonAsync<SubjectDto>();

        Assert.NotNull(subject);
        Assert.NotEqual(Guid.Empty, subject.Id);
        Assert.Equal("Mathematics", subject.Name);
        Assert.Equal("Study notes", subject.Description);
        Assert.Equal("#3366ff", subject.Color);
    }

    [Fact]
    public async Task GetSubjects_ListsSubjects()
    {
        await using var factory = await CadernoAppApiFactory.CreateAsync();
        using var client = factory.CreateClient();

        await CreateSubjectAsync(client, "Mathematics");
        await CreateSubjectAsync(client, "Physics");

        var subjects = await client.GetFromJsonAsync<IReadOnlyList<SubjectDto>>("/api/subjects");

        Assert.NotNull(subjects);
        Assert.Equal(["Mathematics", "Physics"], subjects.Select(subject => subject.Name));
    }

    [Fact]
    public async Task PostModule_CreatesStudyModuleInsideSubject()
    {
        await using var factory = await CadernoAppApiFactory.CreateAsync();
        using var client = factory.CreateClient();
        var subject = await CreateSubjectAsync(client);

        var module = await CreateModuleAsync(client, subject.Id, "Algebra");

        Assert.NotEqual(Guid.Empty, module.Id);
        Assert.Equal(subject.Id, module.SubjectId);
        Assert.Equal("Algebra", module.Title);
    }

    [Fact]
    public async Task PostNote_CreatesNoteInsideModule()
    {
        await using var factory = await CadernoAppApiFactory.CreateAsync();
        using var client = factory.CreateClient();
        var module = await CreateModuleAsync(client);

        var note = await CreateNoteAsync(client, module.Id, "Linear equations");

        Assert.NotEqual(Guid.Empty, note.Id);
        Assert.Equal(module.Id, note.StudyModuleId);
        Assert.Equal("Linear equations", note.Title);
        Assert.False(note.IsFavorite);
    }

    [Fact]
    public async Task PostPage_AddsPageToNote()
    {
        await using var factory = await CadernoAppApiFactory.CreateAsync();
        using var client = factory.CreateClient();
        var note = await CreateNoteAsync(client);

        var response = await client.PostAsJsonAsync(
            $"/api/notes/{note.Id}/pages",
            new AddNotePageRequest
            {
                Content = "<p>First page</p>"
            });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var page = await response.Content.ReadFromJsonAsync<NotePageDto>();

        Assert.NotNull(page);
        Assert.Equal(note.Id, page.NoteId);
        Assert.Equal(1, page.PageNumber);
        Assert.Equal("<p>First page</p>", page.Content);
        Assert.Equal("html", page.ContentFormat);
        Assert.Equal(210m, page.WidthMm);
        Assert.Equal(297m, page.HeightMm);
    }

    [Fact]
    public async Task PostTag_AddsTagToNote()
    {
        await using var factory = await CadernoAppApiFactory.CreateAsync();
        using var client = factory.CreateClient();
        var note = await CreateNoteAsync(client);

        var response = await client.PostAsJsonAsync(
            $"/api/notes/{note.Id}/tags",
            new AddTagToNoteRequest
            {
                Name = "Important",
                Color = "#ffcc00"
            });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var tag = await response.Content.ReadFromJsonAsync<TagDto>();

        Assert.NotNull(tag);
        Assert.Equal("Important", tag.Name);
        Assert.Equal("#ffcc00", tag.Color);
    }

    [Fact]
    public async Task PutFavorite_MarksNoteAsFavorite()
    {
        await using var factory = await CadernoAppApiFactory.CreateAsync();
        using var client = factory.CreateClient();
        var note = await CreateNoteAsync(client);

        var response = await client.PutAsync($"/api/notes/{note.Id}/favorite", content: null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var favoriteNote = await response.Content.ReadFromJsonAsync<NoteSummaryDto>();

        Assert.NotNull(favoriteNote);
        Assert.Equal(note.Id, favoriteNote.Id);
        Assert.True(favoriteNote.IsFavorite);
    }

    [Fact]
    public async Task GetFavorites_ReturnsFavoriteNotes()
    {
        await using var factory = await CadernoAppApiFactory.CreateAsync();
        using var client = factory.CreateClient();
        var firstNote = await CreateNoteAsync(client, title: "Linear equations");
        await CreateNoteAsync(client, title: "Geometry basics");
        await client.PutAsync($"/api/notes/{firstNote.Id}/favorite", content: null);

        var favorites = await client.GetFromJsonAsync<IReadOnlyList<NoteSummaryDto>>("/api/notes/favorites");

        Assert.NotNull(favorites);

        var favorite = Assert.Single(favorites);
        Assert.Equal(firstNote.Id, favorite.Id);
        Assert.True(favorite.IsFavorite);
    }

    [Fact]
    public async Task GetSubject_ReturnsNotFound_WhenSubjectDoesNotExist()
    {
        await using var factory = await CadernoAppApiFactory.CreateAsync();
        using var client = factory.CreateClient();

        var response = await client.GetAsync($"/api/subjects/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private static async Task<SubjectDto> CreateSubjectAsync(
        HttpClient client,
        string name = "Mathematics")
    {
        var response = await client.PostAsJsonAsync(
            "/api/subjects",
            new CreateSubjectRequest { Name = name });

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<SubjectDto>()
            ?? throw new InvalidOperationException("The API did not return a subject.");
    }

    private static async Task<StudyModuleDto> CreateModuleAsync(
        HttpClient client,
        Guid? subjectId = null,
        string title = "Algebra")
    {
        var subject = subjectId.HasValue ? null : await CreateSubjectAsync(client);
        var ownerSubjectId = subjectId ?? subject!.Id;
        var response = await client.PostAsJsonAsync(
            $"/api/subjects/{ownerSubjectId}/modules",
            new CreateStudyModuleRequest { Title = title });

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<StudyModuleDto>()
            ?? throw new InvalidOperationException("The API did not return a study module.");
    }

    private static async Task<NoteSummaryDto> CreateNoteAsync(
        HttpClient client,
        Guid? moduleId = null,
        string title = "Linear equations")
    {
        var module = moduleId.HasValue ? null : await CreateModuleAsync(client);
        var ownerModuleId = moduleId ?? module!.Id;
        var response = await client.PostAsJsonAsync(
            $"/api/modules/{ownerModuleId}/notes",
            new CreateNoteRequest { Title = title });

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<NoteSummaryDto>()
            ?? throw new InvalidOperationException("The API did not return a note.");
    }

    private sealed class CadernoAppApiFactory : WebApplicationFactory<Program>, IAsyncDisposable
    {
        private readonly SqliteConnection _connection = new("Data Source=:memory:");

        private CadernoAppApiFactory()
        {
        }

        public static async Task<CadernoAppApiFactory> CreateAsync()
        {
            var factory = new CadernoAppApiFactory();
            await factory._connection.OpenAsync();

            return factory;
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll<DbContextOptions<CadernoAppDbContext>>();
                services.AddDbContext<CadernoAppDbContext>(options => options.UseSqlite(_connection));

                using var provider = services.BuildServiceProvider();
                using var scope = provider.CreateScope();

                var context = scope.ServiceProvider.GetRequiredService<CadernoAppDbContext>();
                context.Database.EnsureCreated();
            });
        }

        public override async ValueTask DisposeAsync()
        {
            await _connection.DisposeAsync();
            await base.DisposeAsync();
        }
    }
}
