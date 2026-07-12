import type { NotebookPage } from '../types/notebook'

export const LOCAL_DRAFT_STORAGE_KEY = 'caderno-app:active-note-pages'

export interface LocalDraftPage extends NotebookPage {
  contentHtml: string
}

export interface LocalDraft {
  activePageId: string
  pages: LocalDraftPage[]
  updatedAt: string
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

export function loadLocalDraft(): LocalDraft | null {
  if (!canUseLocalStorage()) {
    return null
  }

  try {
    const rawDraft = window.localStorage.getItem(LOCAL_DRAFT_STORAGE_KEY)

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

    return {
      activePageId: parsedDraft.activePageId,
      pages: parsedDraft.pages,
      updatedAt: parsedDraft.updatedAt,
    }
  } catch {
    return null
  }
}

export function saveLocalDraft(pages: LocalDraftPage[], activePageId: string): boolean {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    const draft: LocalDraft = {
      activePageId,
      pages,
      updatedAt: new Date().toISOString(),
    }

    window.localStorage.setItem(LOCAL_DRAFT_STORAGE_KEY, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

export function clearLocalDraft(): boolean {
  if (!canUseLocalStorage()) {
    return false
  }

  try {
    window.localStorage.removeItem(LOCAL_DRAFT_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
