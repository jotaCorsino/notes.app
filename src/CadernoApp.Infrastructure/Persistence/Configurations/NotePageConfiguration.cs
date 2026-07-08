using CadernoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CadernoApp.Infrastructure.Persistence.Configurations;

public sealed class NotePageConfiguration : IEntityTypeConfiguration<NotePage>
{
    public void Configure(EntityTypeBuilder<NotePage> builder)
    {
        builder.ToTable("NotePages");

        builder.HasKey(page => page.Id);

        builder.Property(page => page.NoteId)
            .IsRequired();

        builder.Property(page => page.PageNumber)
            .IsRequired();

        builder.Property(page => page.Content)
            .IsRequired()
            .HasColumnType("TEXT");

        builder.Property(page => page.ContentFormat)
            .IsRequired()
            .HasMaxLength(32);

        builder.Property(page => page.WidthMm)
            .HasConversion<double>()
            .HasColumnType("REAL")
            .IsRequired();

        builder.Property(page => page.HeightMm)
            .HasConversion<double>()
            .HasColumnType("REAL")
            .IsRequired();

        builder.Property(page => page.OrderIndex)
            .IsRequired();

        builder.Property(page => page.CreatedAt)
            .IsRequired();

        builder.Property(page => page.UpdatedAt)
            .IsRequired();
    }
}
