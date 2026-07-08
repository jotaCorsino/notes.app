using CadernoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CadernoApp.Infrastructure.Persistence.Configurations;

public sealed class NoteConfiguration : IEntityTypeConfiguration<Note>
{
    public void Configure(EntityTypeBuilder<Note> builder)
    {
        builder.ToTable("Notes");

        builder.HasKey(note => note.Id);

        builder.Property(note => note.StudyModuleId)
            .IsRequired();

        builder.Property(note => note.Title)
            .IsRequired()
            .HasMaxLength(240);

        builder.Property(note => note.IsFavorite)
            .IsRequired();

        builder.Property(note => note.CreatedAt)
            .IsRequired();

        builder.Property(note => note.UpdatedAt)
            .IsRequired();

        builder.HasMany(note => note.Pages)
            .WithOne()
            .HasForeignKey(page => page.NoteId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(note => note.Pages)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasMany(note => note.Tags)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "NoteTags",
                right => right
                    .HasOne<Tag>()
                    .WithMany()
                    .HasForeignKey("TagId")
                    .OnDelete(DeleteBehavior.Cascade),
                left => left
                    .HasOne<Note>()
                    .WithMany()
                    .HasForeignKey("NoteId")
                    .OnDelete(DeleteBehavior.Cascade),
                join =>
                {
                    join.ToTable("NoteTags");
                    join.HasKey("NoteId", "TagId");
                });

        builder.Navigation(note => note.Tags)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
