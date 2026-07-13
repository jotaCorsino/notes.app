import type { NotebookPage } from '../types/notebook'

export const LOCAL_DRAFT_STORAGE_PREFIX = 'caderno-app:note-draft:'
export const MOCK_DRAFT_NOTE_ID = 'mock-active-note'
export const LOCAL_DRAFT_SCHEMA_VERSION = 2

export type LocalDraftBaseSource = 'api' | 'fallback' | 'local' | 'mock'

export interface LocalDraftPage extends NotebookPage {
  apiUpdatedAt?: string | null
  contentHtml: string
}

export interface LocalDraft {
  activePageId: string
  apiUpdatedAt?: string | null
  baseSource: LocalDraftBaseSource
  noteId: string
  pages: LocalDraftPage[]
  savedAt: string
  schemaVersion: number
  updatedAt: string
}

export interface SaveLocalDraftOptions {
  apiUpdatedAt?: string | null
  baseSource?: LocalDraftBaseSource
}

const canUseLocalStorage = () => {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    return Boolean(window.localStorage)
  } catch {
    return false
  }
}

export const getLocalDraftStorageKey = (noteId: string) =>
  `${LOCAL_DRAFT_STORAGE_PREFIX}${noteId || MOCK_DRAFT_NOTE_ID}`

const isLocalDraftBaseSource = (value: unknown): value is LocalDraftBaseSource =>
  value === 'api' || value === 'fallback' || value === 'local' || value === 'mock'

const isLocalDraftPage = (value: unknown): value is LocalDraftPage => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const page = value as Partial<LocalDraftPage>

  return (
    typeof page.id === 'string' &&
    typeof page.pageNumber === 'number' &&
    typeof page.widthMm === 'number' &&
    typeof page.heightMm === 'number' &&
    page.contentFormat === 'html' &&
    typeof page.contentHtml === 'string' &&
    Boolean(page.content)
  )
}

const getLatestApiUpdatedAt = (pages: LocalDraftPage[]) =>
  pages
    .map((page) => page.apiUpdatedAt)
    .filter((updatedAt): updatedAt is string => typeof updatedAt === 'string' && updatedAt.length > 0)
    .sort()
    .at(-1) ?? null

const inferBaseSource = (pages: LocalDraftPage[]): LocalDraftBaseSource =>
  pages.some((page) => page.source === 'api') ? 'api' : 'local'

export function loadLocalDraft(noteId: string): LocalDraft | null {
  if (!canUseLocalStorage()) {
    return null
  }

  try {
    const rawDraft = window.localStorage.getItem(getLocalDraftStorageKey(noteId))

    if (!rawDraft) {
      return null
    }

    const parsedDraft = JSON.parse(rawDraft) as Partial<LocalDraft>

    if (
      typeof parsedDraft.activePageId !== 'string' ||
      typeof parsedDraft.updatedAt !== 'string' ||
      !Array.isArray(parsedDraft.pages) ||
      parsedDraft.pages.length === 0 ||
      !parsedDraft.pages.every(isLocalDraftPage)
    ) {
      return null
    }

    const updatedAt = typeof parsedDraft.updatedAt === 'string'
      ? parsedDraft.updatedAt
      : new Date().toISOString()
    const pages = parsedDraft.pages

    return {
      activePageId: parsedDraft.activePageId,
      apiUpdatedAt: typeof parsedDraft.apiUpdatedAt === 'string'
        ? parsedDraft.apiUpdatedAt
        : getLatestApiUpdatedAt(pages),
      baseSource: isLocalDraftBaseSource(parsedDraft.baseSource)
        ? parsedDraft.baseSource
        : inferBaseSource(pages),
      noteId: typeof parsedDraft.noteId === 'string' ? parsedDraft.noteId : noteId,
      pages,
      savedAt: typeof parsedDraft.savedAt === 'string' ? parsedDraft.savedAt : updatedAt,
      schemaVersion: typeof parsedDraft.schemaVersion === 'number'
        ? parsedDraft.schemaVersion
        : 1,
      updatedAt,
    }
  } catch {
    return null
  }
}

export function saveLocalDraft(
  noteId: string,
  pages: LocalDraftPage[],
  activePageId: string,
  options: SaveLocalDraftOptions = {},
): boolean {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    const savedAt = new Date().toISOString()
    const draft: LocalDraft = {
      activePageId,
      apiUpdatedAt: options.apiUpdatedAt ?? getLatestApiUpdatedAt(pages),
      baseSource: options.baseSource ?? inferBaseSource(pages),
      noteId: noteId || MOCK_DRAFT_NOTE_ID,
      pages,
      savedAt,
      schemaVersion: LOCAL_DRAFT_SCHEMA_VERSION,
      updatedAt: savedAt,
    }

    window.localStorage.setItem(getLocalDraftStorageKey(noteId), JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

export function clearLocalDraft(noteId: string): boolean {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    window.localStorage.removeItem(getLocalDraftStorageKey(noteId))
    return true
  } catch {
    return false
  }
}
