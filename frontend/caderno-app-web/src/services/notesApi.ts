export interface ApiNoteSummary {
  id: string
  studyModuleId: string
  title: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  pageCount: number
  tags: string[]
}

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

export interface ApiNoteDetails {
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
): Promise<ApiNoteSummary[]> {
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

  return notes as ApiNoteSummary[]
}

export async function getNoteById(
  noteId: string,
  signal?: AbortSignal,
): Promise<ApiNoteDetails> {
  const response = await fetch(`/api/notes/${encodeURIComponent(noteId)}`, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`GET /api/notes/${noteId} failed with status ${response.status}`)
  }

  const note = (await response.json()) as Partial<ApiNoteDetails>

  if (
    typeof note.id !== 'string' ||
    typeof note.title !== 'string' ||
    !Array.isArray(note.pages)
  ) {
    throw new Error('GET /api/notes/{id} returned an unexpected payload')
  }

  return note as ApiNoteDetails
}

export async function updateNotePageContent(
  noteId: string,
  pageId: string,
  content: string,
  contentFormat = 'html',
  signal?: AbortSignal,
): Promise<ApiNotePage> {
  const response = await fetch(
    `/api/notes/${encodeURIComponent(noteId)}/pages/${encodeURIComponent(pageId)}/content`,
    {
      body: JSON.stringify({
        content,
        contentFormat,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      signal,
    },
  )

  if (!response.ok) {
    throw new Error(
      `PUT /api/notes/${noteId}/pages/${pageId}/content failed with status ${response.status}`,
    )
  }

  const page = (await response.json()) as Partial<ApiNotePage>

  if (
    typeof page.id !== 'string' ||
    typeof page.noteId !== 'string' ||
    typeof page.content !== 'string' ||
    typeof page.contentFormat !== 'string'
  ) {
    throw new Error('PUT /api/notes/{noteId}/pages/{pageId}/content returned an unexpected payload')
  }

  return page as ApiNotePage
}
