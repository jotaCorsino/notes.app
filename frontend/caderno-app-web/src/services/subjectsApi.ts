export interface ApiStudyModule {
  id: string
  subjectId: string
  title: string
  description: string | null
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export interface ApiSubject {
  id: string
  name: string
  description: string | null
  color: string | null
  createdAt: string
  updatedAt: string
  modules: ApiStudyModule[]
}

export async function getSubjects(signal?: AbortSignal): Promise<ApiSubject[]> {
  const response = await fetch('/api/subjects', {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`GET /api/subjects failed with status ${response.status}`)
  }

  const subjects = (await response.json()) as unknown

  if (!Array.isArray(subjects)) {
    throw new Error('GET /api/subjects returned an unexpected payload')
  }

  return subjects as ApiSubject[]
}
