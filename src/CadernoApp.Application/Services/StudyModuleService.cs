using CadernoApp.Application.Abstractions;
using CadernoApp.Application.DTOs;
using CadernoApp.Domain.Entities;

namespace CadernoApp.Application.Services;

public sealed class StudyModuleService
{
    private readonly ISubjectRepository _subjectRepository;
    private readonly IStudyModuleRepository _studyModuleRepository;
    private readonly IUnitOfWork _unitOfWork;

    public StudyModuleService(
        ISubjectRepository subjectRepository,
        IStudyModuleRepository studyModuleRepository,
        IUnitOfWork unitOfWork)
    {
        _subjectRepository = subjectRepository;
        _studyModuleRepository = studyModuleRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<StudyModuleDto> CreateAsync(
        Guid subjectId,
        string title,
        string? description = null,
        int? orderIndex = null,
        CancellationToken cancellationToken = default)
    {
        var subject = await _subjectRepository.GetByIdAsync(subjectId, includeModules: true, cancellationToken)
            ?? throw new KeyNotFoundException($"Subject '{subjectId}' was not found.");

        var module = subject.AddModule(title, description, orderIndex);

        await _studyModuleRepository.AddAsync(module, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapModule(module);
    }

    public async Task<IReadOnlyList<StudyModuleDto>> ListBySubjectIdAsync(
        Guid subjectId,
        CancellationToken cancellationToken = default)
    {
        var modules = await _studyModuleRepository.ListBySubjectIdAsync(subjectId, cancellationToken);

        return modules.Select(MapModule).ToList();
    }

    public async Task<StudyModuleDto> GetByIdAsync(
        Guid studyModuleId,
        CancellationToken cancellationToken = default)
    {
        var module = await GetStudyModuleOrThrowAsync(studyModuleId, includeNotes: false, cancellationToken);

        return MapModule(module);
    }

    public async Task DeleteAsync(Guid studyModuleId, CancellationToken cancellationToken = default)
    {
        var module = await GetStudyModuleOrThrowAsync(studyModuleId, includeNotes: false, cancellationToken);

        _studyModuleRepository.Remove(module);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<StudyModule> GetStudyModuleOrThrowAsync(
        Guid studyModuleId,
        bool includeNotes,
        CancellationToken cancellationToken)
    {
        var module = await _studyModuleRepository.GetByIdAsync(studyModuleId, includeNotes, cancellationToken);

        return module ?? throw new KeyNotFoundException($"Study module '{studyModuleId}' was not found.");
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
