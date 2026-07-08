using CadernoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CadernoApp.Infrastructure.Persistence;

public sealed class CadernoAppDbContext : DbContext
{
    public CadernoAppDbContext(DbContextOptions<CadernoAppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Subject> Subjects => Set<Subject>();

    public DbSet<StudyModule> StudyModules => Set<StudyModule>();

    public DbSet<Note> Notes => Set<Note>();

    public DbSet<NotePage> NotePages => Set<NotePage>();

    public DbSet<Tag> Tags => Set<Tag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CadernoAppDbContext).Assembly);
    }
}
