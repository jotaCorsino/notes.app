import type { ApiStudyModule } from './subjectsApi'

export interface CreateStudyModuleInput {
  title: string
  description?: string
  orderIndex?: number
}

const isApiStudyModule = (
  studyModule: Partial<ApiStudyModule>,
): studyModule is ApiStudyModule =>
  typeof studyModule.id === 'string' &&
  typeof studyModule.subjectId === 'string' &&
  typeof studyModule.title === 'string' &&
  typeof studyModule.orderIndex === 'number'

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

export async function createStudyModule(
  subjectId: string,
  input: CreateStudyModuleInput,
  signal?: AbortSignal,
): Promise<ApiStudyModule> {
  const response = await fetch(`/api/subjects/${encodeURIComponent(subjectId)}/modules`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    signal,
  })

  if (!response.ok) {
    throw new Error(
      `POST /api/subjects/${subjectId}/modules failed with status ${response.status}`,
    )
  }

  const studyModule = (await response.json()) as Partial<ApiStudyModule>

  if (!isApiStudyModule(studyModule)) {
    throw new Error('POST /api/subjects/{subjectId}/modules returned an unexpected payload')
  }

  return studyModule
}
