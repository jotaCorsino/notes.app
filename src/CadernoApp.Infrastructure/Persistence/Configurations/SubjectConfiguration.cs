using CadernoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CadernoApp.Infrastructure.Persistence.Configurations;

public sealed class SubjectConfiguration : IEntityTypeConfiguration<Subject>
{
    public void Configure(EntityTypeBuilder<Subject> builder)
    {
        builder.ToTable("Subjects");

        builder.HasKey(subject => subject.Id);

        builder.Property(subject => subject.Name)
            .IsRequired()
            .HasMaxLength(160);

        builder.Property(subject => subject.Description)
            .HasMaxLength(1000);

        builder.Property(subject => subject.Color)
            .HasMaxLength(32);

        builder.Property(subject => subject.CreatedAt)
            .IsRequired();

        builder.Property(subject => subject.UpdatedAt)
            .IsRequired();

        builder.HasMany(subject => subject.Modules)
            .WithOne()
            .HasForeignKey(module => module.SubjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(subject => subject.Modules)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
