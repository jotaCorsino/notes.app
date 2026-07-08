namespace CadernoApp.Application.DTOs;

public sealed record TagDto(
    Guid Id,
    string Name,
    string? Color,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
