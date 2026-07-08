using CadernoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CadernoApp.Infrastructure.Persistence.Configurations;

public sealed class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.ToTable("Tags");

        builder.HasKey(tag => tag.Id);

        builder.Property(tag => tag.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(tag => tag.Color)
            .HasMaxLength(32);

        builder.Property(tag => tag.CreatedAt)
            .IsRequired();

        builder.Property(tag => tag.UpdatedAt)
            .IsRequired();
    }
}
