using CadernoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CadernoApp.Infrastructure.Persistence.Configurations;

public sealed class StudyModuleConfiguration : IEntityTypeConfiguration<StudyModule>
{
    public void Configure(EntityTypeBuilder<StudyModule> builder)
    {
        builder.ToTable("StudyModules");

        builder.HasKey(module => module.Id);

        builder.Property(module => module.SubjectId)
            .IsRequired();

        builder.Property(module => module.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(module => module.Description)
            .HasMaxLength(1000);

        builder.Property(module => module.OrderIndex)
            .IsRequired();

        builder.Property(module => module.CreatedAt)
            .IsRequired();

        builder.Property(module => module.UpdatedAt)
            .IsRequired();

        builder.HasMany(module => module.Notes)
            .WithOne()
            .HasForeignKey(note => note.StudyModuleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(module => module.Notes)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
