using CadernoApp.Application.Abstractions;
using CadernoApp.Application.DTOs;
using CadernoApp.Domain.Entities;

namespace CadernoApp.Application.Services;

public sealed class SubjectService
{
    private readonly ISubjectRepository _subjectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SubjectService(ISubjectRepository subjectRepository, IUnitOfWork unitOfWork)
    {
        _subjectRepository = subjectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<SubjectDto> CreateAsync(
        string name,
        string? description = null,
        string? color = null,
        CancellationToken cancellationToken = default)
    {
        var subject = new Subject(name, description, color);

        await _subjectRepository.AddAsync(subject, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapSubject(subject);
    }

    public async Task<IReadOnlyList<SubjectDto>> ListAsync(CancellationToken cancellationToken = default)
    {
        var subjects = await _subjectRepository.ListAsync(cancellationToken);

        return subjects.Select(MapSubject).ToList();
    }

    public async Task<SubjectDto> GetByIdAsync(Guid subjectId, CancellationToken cancellationToken = default)
    {
        var subject = await GetSubjectOrThrowAsync(subjectId, includeModules: true, cancellationToken);

        return MapSubject(subject);
    }

    public async Task<SubjectDto> UpdateAsync(
        Guid subjectId,
        string name,
        string? description = null,
        string? color = null,
        CancellationToken cancellationToken = default)
    {
        var subject = await GetSubjectOrThrowAsync(subjectId, includeModules: true, cancellationToken);

        subject.Update(name, description, color);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapSubject(subject);
    }

    public async Task DeleteAsync(Guid subjectId, CancellationToken cancellationToken = default)
    {
        var subject = await GetSubjectOrThrowAsync(subjectId, includeModules: false, cancellationToken);

        _subjectRepository.Remove(subject);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<Subject> GetSubjectOrThrowAsync(
        Guid subjectId,
        bool includeModules,
        CancellationToken cancellationToken)
    {
        var subject = await _subjectRepository.GetByIdAsync(subjectId, includeModules, cancellationToken);

        return subject ?? throw new KeyNotFoundException($"Subject '{subjectId}' was not found.");
    }

    private static SubjectDto MapSubject(Subject subject)
    {
        return new SubjectDto(
            subject.Id,
            subject.Name,
            subject.Description,
            subject.Color,
            subject.CreatedAt,
            subject.UpdatedAt,
            subject.Modules
                .OrderBy(module => module.OrderIndex)
                .Select(MapModule)
                .ToList());
    }

    private static StudyModuleDto MapModule(StudyModule module)
    {
        return new StudyModuleDto(
            module.Id,
            module.SubjectId,
            module.Title,
            module.Description,
            module.OrderIndex,
            module.CreatedAt,
            module.UpdatedAt);
    }
}
