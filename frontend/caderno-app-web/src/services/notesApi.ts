export interface ApiNotePage {
  id: string
  noteId: string
  pageNumber: number
  content: string
  contentFormat: string
  widthMm: number
  heightMm: number
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export interface ApiTag {
  id: string
  name: string
  color: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiNote {
  id: string
  studyModuleId: string
  title: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  pages: ApiNotePage[]
  tags: ApiTag[]
}

export async function getNotesByModule(
  moduleId: string,
  signal?: AbortSignal,
): Promise<ApiNote[]> {
  const response = await fetch(`/api/modules/${encodeURIComponent(moduleId)}/notes`, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`GET /api/modules/${moduleId}/notes failed with status ${response.status}`)
  }

  const notes = (await response.json()) as unknown

  if (!Array.isArray(notes)) {
    throw new Error('GET /api/modules/{moduleId}/notes returned an unexpected payload')
  }

  return notes as ApiNote[]
}
