import type { ApiStudyModule } from './subjectsApi'

export async function getModulesBySubject(
  subjectId: string,
  signal?: AbortSignal,
): Promise<ApiStudyModule[]> {
  const response = await fetch(`/api/subjects/${encodeURIComponent(subjectId)}/modules`, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`GET /api/subjects/${subjectId}/modules failed with status ${response.status}`)
  }

  const modules = (await response.json()) as unknown

  if (!Array.isArray(modules)) {
    throw new Error('GET /api/subjects/{subjectId}/modules returned an unexpected payload')
  }

  return modules as ApiStudyModule[]
}
