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

export interface CreateNoteInput {
  title: string
}

const defaultPageContentHtml = `<h1>Nova página</h1><p>Comece suas anotações aqui.</p>`

const isApiNoteSummary = (note: Partial<ApiNoteSummary>): note is ApiNoteSummary =>
  typeof note.id === 'string' &&
  typeof note.studyModuleId === 'string' &&
  typeof note.title === 'string' &&
  typeof note.isFavorite === 'boolean' &&
  typeof note.pageCount === 'number' &&
  Array.isArray(note.tags)

const isApiTag = (tag: Partial<ApiTag>): tag is ApiTag =>
  typeof tag.id === 'string' &&
  typeof tag.name === 'string' &&
  typeof tag.createdAt === 'string' &&
  typeof tag.updatedAt === 'string'

const isApiNoteDetails = (note: Partial<ApiNoteDetails>): note is ApiNoteDetails =>
  typeof note.id === 'string' &&
  typeof note.title === 'string' &&
  typeof note.isFavorite === 'boolean' &&
  Array.isArray(note.pages) &&
  Array.isArray(note.tags)

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

export async function createNote(
  moduleId: string,
  input: CreateNoteInput,
  signal?: AbortSignal,
): Promise<ApiNoteSummary> {
  const response = await fetch(`/api/modules/${encodeURIComponent(moduleId)}/notes`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    signal,
  })

  if (!response.ok) {
    throw new Error(`POST /api/modules/${moduleId}/notes failed with status ${response.status}`)
  }

  const note = (await response.json()) as Partial<ApiNoteSummary>

  if (!isApiNoteSummary(note)) {
    throw new Error('POST /api/modules/{moduleId}/notes returned an unexpected payload')
  }

  return note
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

  if (!isApiNoteDetails(note)) {
    throw new Error('GET /api/notes/{id} returned an unexpected payload')
  }

  return note
}

export async function createNotePage(
  noteId: string,
  content = defaultPageContentHtml,
  contentFormat = 'html',
  signal?: AbortSignal,
): Promise<ApiNotePage> {
  const response = await fetch(`/api/notes/${encodeURIComponent(noteId)}/pages`, {
    body: JSON.stringify({
      content,
      contentFormat,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal,
  })

  if (!response.ok) {
    throw new Error(`POST /api/notes/${noteId}/pages failed with status ${response.status}`)
  }

  const page = (await response.json()) as Partial<ApiNotePage>

  if (
    typeof page.id !== 'string' ||
    typeof page.noteId !== 'string' ||
    typeof page.content !== 'string' ||
    typeof page.contentFormat !== 'string'
  ) {
    throw new Error('POST /api/notes/{noteId}/pages returned an unexpected payload')
  }

  return page as ApiNotePage
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

export async function markNoteAsFavorite(
  noteId: string,
  signal?: AbortSignal,
): Promise<ApiNoteSummary> {
  const response = await fetch(`/api/notes/${encodeURIComponent(noteId)}/favorite`, {
    headers: {
      Accept: 'application/json',
    },
    method: 'PUT',
    signal,
  })

  if (!response.ok) {
    throw new Error(`PUT /api/notes/${noteId}/favorite failed with status ${response.status}`)
  }

  const note = (await response.json()) as Partial<ApiNoteSummary>

  if (!isApiNoteSummary(note)) {
    throw new Error('PUT /api/notes/{noteId}/favorite returned an unexpected payload')
  }

  return note
}

export async function unmarkNoteAsFavorite(
  noteId: string,
  signal?: AbortSignal,
): Promise<ApiNoteSummary> {
  const response = await fetch(`/api/notes/${encodeURIComponent(noteId)}/favorite`, {
    headers: {
      Accept: 'application/json',
    },
    method: 'DELETE',
    signal,
  })

  if (!response.ok) {
    throw new Error(`DELETE /api/notes/${noteId}/favorite failed with status ${response.status}`)
  }

  const note = (await response.json()) as Partial<ApiNoteSummary>

  if (!isApiNoteSummary(note)) {
    throw new Error('DELETE /api/notes/{noteId}/favorite returned an unexpected payload')
  }

  return note
}

export async function addTagToNote(
  noteId: string,
  name: string,
  color: string | null,
  signal?: AbortSignal,
): Promise<ApiTag> {
  const response = await fetch(`/api/notes/${encodeURIComponent(noteId)}/tags`, {
    body: JSON.stringify({
      color,
      name,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal,
  })

  if (!response.ok) {
    throw new Error(`POST /api/notes/${noteId}/tags failed with status ${response.status}`)
  }

  const tag = (await response.json()) as Partial<ApiTag>

  if (!isApiTag(tag)) {
    throw new Error('POST /api/notes/{noteId}/tags returned an unexpected payload')
  }

  return tag
}

export async function removeTagFromNote(
  noteId: string,
  tagName: string,
  signal?: AbortSignal,
): Promise<ApiNoteDetails> {
  const response = await fetch(
    `/api/notes/${encodeURIComponent(noteId)}/tags/${encodeURIComponent(tagName)}`,
    {
      headers: {
        Accept: 'application/json',
      },
      method: 'DELETE',
      signal,
    },
  )

  if (!response.ok) {
    throw new Error(`DELETE /api/notes/${noteId}/tags/${tagName} failed with status ${response.status}`)
  }

  const note = (await response.json()) as Partial<ApiNoteDetails>

  if (!isApiNoteDetails(note)) {
    throw new Error('DELETE /api/notes/{noteId}/tags/{tagName} returned an unexpected payload')
  }

  return note
}
