import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { createNotePage, updateNotePageContent, type ApiNotePage } from '../services/notesApi'
import type { NotebookPage, NotePageContent } from '../types/notebook'
import {
  clearLocalDraft,
  loadLocalDraft,
  saveLocalDraft,
  type LocalDraft,
  type LocalDraftBaseSource,
  type LocalDraftPage,
} from '../utils/localDraftStorage'
import { A4EditorPage } from './A4EditorPage'
import { EditorToolbar } from './EditorToolbar'
import { PageNavigator, type PageNavigatorPageStatus } from './PageNavigator'

export type EditorPageSourceStatus = 'api' | 'empty' | 'error' | 'loading' | 'mock'

interface A4EditorWorkspaceProps {
  activePage: NotebookPage
  draftNoteId: string
  pageSourceStatus: EditorPageSourceStatus
  pages: NotebookPage[]
}

type DraftStatus =
  | 'api'
  | 'backendPageCreated'
  | 'backendAndLocalSaved'
  | 'cleared'
  | 'creatingPage'
  | 'draftReloadedFromApi'
  | 'empty'
  | 'error'
  | 'loaded'
  | 'localDraftNewer'
  | 'localDraftPossiblyStale'
  | 'loading'
  | 'localPageCreated'
  | 'mock'
  | 'pageCreateError'
  | 'saved'
  | 'unavailable'

type BackendSaveStatus = 'error' | 'localChanges' | 'localOnly' | 'saved' | 'saving'
type LocalPageSyncStatus = 'error' | 'idle' | 'synced' | 'syncing' | 'unavailable'

interface DraftEditorState {
  activePageId: string
  draftMetadata: LocalDraft | null
  isLocalDraftActive: boolean
  localPages: LocalDraftPage[]
  status: DraftStatus
}

const sourceStatusToDraftStatus: Record<EditorPageSourceStatus, DraftStatus> = {
  api: 'api',
  empty: 'empty',
  error: 'error',
  loading: 'loading',
  mock: 'mock',
}

const draftStatusLabel: Record<DraftStatus, string> = {
  api: 'Páginas carregadas da API',
  backendPageCreated: 'Página criada no backend',
  backendAndLocalSaved: 'Salvo no backend e no rascunho local',
  cleared: 'Rascunho limpo',
  creatingPage: 'Criando página...',
  draftReloadedFromApi: 'Páginas recarregadas da API',
  empty: 'Sem páginas reais',
  error: 'Erro ao carregar páginas',
  loaded: 'Rascunho local carregado',
  localDraftNewer: 'Rascunho local mais recente que a API',
  localDraftPossiblyStale: 'Rascunho local possivelmente desatualizado',
  loading: 'Carregando páginas',
  localPageCreated: 'Página local criada',
  mock: 'Páginas mockadas',
  pageCreateError: 'Erro ao criar página',
  saved: 'Salvo localmente',
  unavailable: 'LocalStorage indisponível',
}

const draftStatusDetail: Record<DraftStatus, string> = {
  api: 'Base carregada de GET /api/notes/{id}',
  backendPageCreated: 'A nova página real foi adicionada ao editor',
  backendAndLocalSaved: 'Conteúdo confirmado no backend e preservado localmente',
  cleared: 'Rascunho da anotação ativa foi removido',
  creatingPage: 'Enviando POST /api/notes/{noteId}/pages',
  draftReloadedFromApi: 'Rascunho descartado; base atual veio da API ou fallback',
  empty: 'Usando página local inicial',
  error: 'Usando fallback local para manter o editor disponível',
  loaded: 'Rascunho local desta anotação foi encontrado',
  localDraftNewer: 'O rascunho local tem alteração posterior à referência salva',
  localDraftPossiblyStale: 'Sem referência suficiente para comparar com a API',
  loading: 'Aguardando detalhes da anotação',
  localPageCreated: 'Sem chamada de API para mock ou fallback',
  mock: 'Usando dados mockados do protótipo',
  pageCreateError: 'Fallback local criado; conteúdo atual preservado',
  saved: 'Rascunho salvo neste navegador para esta anotação',
  unavailable: 'Usando memória da sessão',
}

const backendSaveStatusLabel: Record<BackendSaveStatus, string> = {
  error: 'Erro ao salvar',
  localChanges: 'Alterações locais não salvas',
  localOnly: 'Página local — não enviada',
  saved: 'Página salva no backend',
  saving: 'Salvando no backend...',
}

const backendSaveStatusDetail: Record<BackendSaveStatus, string> = {
  error: 'Conteúdo local preservado',
  localChanges: 'Use o botão para salvar esta página real',
  localOnly: 'Esta página ainda não existe no backend',
  saved: 'A página ativa não tem alterações locais pendentes',
  saving: 'Enviando PUT /api/notes/{noteId}/pages/{pageId}/content',
}

const activePageSyncLabel: Record<PageNavigatorPageStatus, string> = {
  local: 'Página local — ainda não existe no backend',
  saved: 'Página salva no backend',
  unsaved: 'Alterações locais não salvas',
}

const localPageSyncStatusLabel: Record<LocalPageSyncStatus, string> = {
  error: 'Erro ao sincronizar páginas locais',
  idle: 'Sincronização manual',
  synced: 'Páginas locais enviadas ao backend',
  syncing: 'Sincronizando páginas locais...',
  unavailable: 'Rascunho local não atualizado',
}

const blankPageHtml = `<h1>Nova página</h1><p>Comece suas anotações aqui.</p>`

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const createEditorHtml = (content: NotePageContent) => {
  const layerItems = content.layers
    .map(
      (layer) =>
        `<li><strong>${layer.number}. ${escapeHtml(layer.name)}</strong>: ${escapeHtml(layer.description)}</li>`,
    )
    .join('')

  const layersHtml = layerItems ? `<ul>${layerItems}</ul>` : ''

  return `
    <p><strong>${escapeHtml(content.eyebrow)}</strong></p>
    <h1>${escapeHtml(content.title)}</h1>
    <p><em>${escapeHtml(content.subtitle)}</em></p>
    <p>${escapeHtml(content.introduction)}</p>
    <blockquote><p><mark>${escapeHtml(content.highlight)}</mark></p></blockquote>
    <h2>${escapeHtml(content.sectionTitle)}</h2>
    <p>${escapeHtml(content.sectionBody)}</p>
    ${layersHtml}
    <h3>${escapeHtml(content.takeawayTitle)}</h3>
    <p>${escapeHtml(content.takeawayBody)}</p>
    <p>${escapeHtml(content.nextStudy)}</p>
  `
}

const getPageContentHtml = (page: NotebookPage) => page.contentHtml ?? createEditorHtml(page.content)

const createLocalPage = (page: NotebookPage): LocalDraftPage => {
  const contentHtml = getPageContentHtml(page)
  const source = page.source ?? 'local'

  return {
    ...page,
    contentHtml,
    hasUnsavedChanges: false,
    lastSavedContentHtml: source === 'api' ? contentHtml : undefined,
    source,
  }
}

const createBlankPageContent = (pageNumber: number): NotePageContent => ({
  eyebrow: 'Rascunho local',
  title: `Nova página ${pageNumber}`,
  subtitle: 'Página A4 criada neste navegador',
  introduction: 'Comece suas anotações aqui.',
  highlight: 'Esta página existe apenas localmente neste navegador.',
  sectionTitle: 'Primeiro tópico',
  sectionBody: 'Adicione definições, exemplos e lembretes importantes.',
  layers: [],
  takeawayTitle: 'Para lembrar',
  takeawayBody: 'O conteúdo ainda não é salvo no backend.',
  nextStudy: 'Próximo passo: organizar esta página antes da integração com o backend.',
})

const createApiPageContent = (pageNumber: number): NotePageContent => ({
  eyebrow: 'Página real',
  title: `Página ${pageNumber}`,
  subtitle: 'Página A4 criada no backend',
  introduction: 'Esta página já possui identificador real e pode ser salva no backend.',
  highlight: 'Edite localmente e use o botão Salvar página para persistir alterações.',
  sectionTitle: 'Conteúdo',
  sectionBody: 'Use o editor para organizar esta página.',
  layers: [],
  takeawayTitle: 'Persistência',
  takeawayBody: 'A criação já ocorreu no backend; as edições continuam manuais.',
  nextStudy: 'Próximo passo: salvar alterações pelo botão da página.',
})

const createBlankLocalPage = (pageNumber: number): LocalDraftPage => {
  const content = createBlankPageContent(pageNumber)

  return {
    id: `local-page-${pageNumber}-${Date.now()}`,
    pageNumber,
    widthMm: 210,
    heightMm: 297,
    contentFormat: 'html',
    content,
    contentHtml: blankPageHtml,
    hasUnsavedChanges: false,
    source: 'local',
  }
}

const getApiPageContentHtml = (page: ApiNotePage) => {
  const content = page.content.trim()

  if (!content) {
    return '<p></p>'
  }

  return page.contentFormat.toLowerCase() === 'html'
    ? content
    : `<p>${escapeHtml(content)}</p>`
}

const createApiLocalPage = (page: ApiNotePage): LocalDraftPage => {
  const pageNumber = Number(page.pageNumber) || 1
  const contentHtml = getApiPageContentHtml(page)

  return {
    apiUpdatedAt: page.updatedAt,
    id: page.id,
    pageNumber,
    widthMm: Number(page.widthMm) || 210,
    heightMm: Number(page.heightMm) || 297,
    contentFormat: 'html',
    content: createApiPageContent(pageNumber),
    contentHtml,
    hasUnsavedChanges: false,
    lastSavedContentHtml: contentHtml,
    source: 'api',
  }
}

const createSyncedApiPage = (
  localPage: LocalDraftPage,
  page: ApiNotePage,
): LocalDraftPage => {
  const returnedContentHtml = getApiPageContentHtml(page)
  const contentHtml = page.content.trim()
    ? returnedContentHtml
    : localPage.contentHtml

  return {
    ...localPage,
    apiUpdatedAt: page.updatedAt,
    id: page.id,
    pageNumber: Number(page.pageNumber) || localPage.pageNumber,
    widthMm: Number(page.widthMm) || localPage.widthMm,
    heightMm: Number(page.heightMm) || localPage.heightMm,
    contentFormat: 'html',
    contentHtml,
    hasUnsavedChanges: false,
    lastSavedContentHtml: contentHtml,
    source: 'api',
  }
}

const getLatestPageApiUpdatedAt = (pages: LocalDraftPage[]) =>
  pages
    .map((page) => page.apiUpdatedAt)
    .filter((updatedAt): updatedAt is string => typeof updatedAt === 'string' && updatedAt.length > 0)
    .sort()
    .at(-1) ?? null

const getDraftBaseSource = (
  pageSourceStatus: EditorPageSourceStatus,
  pages: LocalDraftPage[],
): LocalDraftBaseSource => {
  if (pageSourceStatus === 'mock') {
    return 'mock'
  }

  if (pageSourceStatus === 'api' || pages.some((page) => page.source === 'api')) {
    return 'api'
  }

  return pageSourceStatus === 'empty' || pageSourceStatus === 'error'
    ? 'fallback'
    : 'local'
}

const getLocalDraftStatus = (draft: LocalDraft): DraftStatus => {
  if (draft.baseSource !== 'api') {
    return 'loaded'
  }

  if (!draft.apiUpdatedAt) {
    return 'localDraftPossiblyStale'
  }

  return Date.parse(draft.updatedAt) >= Date.parse(draft.apiUpdatedAt)
    ? 'localDraftNewer'
    : 'loaded'
}

const getPageSyncStatus = (page: LocalDraftPage | undefined): PageNavigatorPageStatus => {
  if (!page || page.source !== 'api') {
    return 'local'
  }

  return page.hasUnsavedChanges ? 'unsaved' : 'saved'
}

const hydrateDraftPagesWithSources = (
  draftPages: LocalDraftPage[],
  sourcePages: NotebookPage[],
): LocalDraftPage[] =>
  draftPages.map((draftPage) => {
    const sourcePage = sourcePages.find((page) => page.id === draftPage.id)
    const source = sourcePage?.source ?? draftPage.source ?? 'local'
    const sourceContentHtml = sourcePage ? getPageContentHtml(sourcePage) : undefined
    const lastSavedContentHtml = source === 'api'
      ? draftPage.lastSavedContentHtml ?? sourceContentHtml
      : undefined
    const hasUnsavedChanges = source === 'api'
      ? typeof draftPage.hasUnsavedChanges === 'boolean'
        ? draftPage.hasUnsavedChanges
        : lastSavedContentHtml
          ? draftPage.contentHtml !== lastSavedContentHtml
          : true
      : false

    return {
      ...draftPage,
      hasUnsavedChanges,
      lastSavedContentHtml,
      source,
    }
  })

const getActivePageFromState = (state: DraftEditorState) =>
  state.localPages.find((page) => page.id === state.activePageId) ?? state.localPages[0]

const getBackendSaveStatusForPage = (page: LocalDraftPage | undefined): BackendSaveStatus => {
  const pageSyncStatus = getPageSyncStatus(page)

  if (pageSyncStatus === 'local') {
    return 'localOnly'
  }

  return pageSyncStatus === 'unsaved' ? 'localChanges' : 'saved'
}

const createInitialDraftState = (
  draftNoteId: string,
  pages: NotebookPage[],
  activePage: NotebookPage,
  pageSourceStatus: EditorPageSourceStatus,
): DraftEditorState => {
  const localDraft = loadLocalDraft(draftNoteId)

  if (localDraft) {
    const hydratedPages = hydrateDraftPagesWithSources(localDraft.pages, pages)
    const activeDraftPage = hydratedPages.some((page) => page.id === localDraft.activePageId)
      ? localDraft.activePageId
      : hydratedPages[0].id

    return {
      activePageId: activeDraftPage,
      draftMetadata: localDraft,
      isLocalDraftActive: true,
      localPages: hydratedPages,
      status: getLocalDraftStatus(localDraft),
    }
  }

  return {
    activePageId: activePage.id,
    draftMetadata: null,
    isLocalDraftActive: false,
    localPages: pages.map(createLocalPage),
    status: sourceStatusToDraftStatus[pageSourceStatus],
  }
}

const persistDraft = (
  draftNoteId: string,
  pages: LocalDraftPage[],
  activePageId: string,
  baseSource: LocalDraftBaseSource,
): DraftStatus =>
  saveLocalDraft(draftNoteId, pages, activePageId, {
    apiUpdatedAt: getLatestPageApiUpdatedAt(pages),
    baseSource,
  })
    ? 'saved'
    : 'unavailable'

const createPagesSignature = (pages: NotebookPage[]) =>
  pages
    .map((page) => [
      page.id,
      page.pageNumber,
      page.widthMm,
      page.heightMm,
      page.contentFormat,
      page.contentHtml ?? '',
      page.source ?? 'local',
      page.content.title,
    ].join(':'))
    .join('|')

export function A4EditorWorkspace({
  activePage,
  draftNoteId,
  pageSourceStatus,
  pages,
}: A4EditorWorkspaceProps) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const [draftState, setDraftState] = useState<DraftEditorState>(() =>
    createInitialDraftState(draftNoteId, pages, activePage, pageSourceStatus),
  )
  const [backendSaveStatus, setBackendSaveStatus] = useState<BackendSaveStatus>('localOnly')
  const [backendSaveError, setBackendSaveError] = useState<string | null>(null)
  const [localPageSyncError, setLocalPageSyncError] = useState<string | null>(null)
  const [localPageSyncStatus, setLocalPageSyncStatus] = useState<LocalPageSyncStatus>('idle')
  const pagesSignature = useMemo(() => createPagesSignature(pages), [pages])
  const { activePageId, localPages, status } = draftState
  const activeLocalPage =
    localPages.find((page) => page.id === activePageId) ?? localPages[0] ?? createLocalPage(activePage)
  const activePageSyncStatus = getPageSyncStatus(activeLocalPage)
  const canSaveActivePage = activePageSyncStatus === 'unsaved' && backendSaveStatus !== 'saving'
  const pageStatusById = useMemo<Record<string, PageNavigatorPageStatus>>(
    () =>
      Object.fromEntries(
        localPages.map((page) => [page.id, getPageSyncStatus(page)]),
      ),
    [localPages],
  )
  const canCreateBackendPage =
    pageSourceStatus === 'api' ||
    pageSourceStatus === 'empty' ||
    pageSourceStatus === 'error'
  const isCreatingPage = status === 'creatingPage'
  const localOnlyPageCount = localPages.filter((page) => page.source !== 'api').length
  const hasLocalOnlyPages = localOnlyPageCount > 0
  const isRealNoteContext =
    pageSourceStatus === 'api' ||
    pageSourceStatus === 'empty' ||
    pageSourceStatus === 'error'
  const canSyncLocalPages =
    isRealNoteContext &&
    hasLocalOnlyPages &&
    localPageSyncStatus !== 'syncing'
  const canReloadFromApi =
    draftState.isLocalDraftActive &&
    pageSourceStatus !== 'loading' &&
    pageSourceStatus !== 'mock'

  useEffect(() => {
    const nextState = createInitialDraftState(draftNoteId, pages, activePage, pageSourceStatus)

    setDraftState(nextState)
    setBackendSaveStatus(getBackendSaveStatusForPage(getActivePageFromState(nextState)))
    setBackendSaveError(null)
    setLocalPageSyncError(null)
    setLocalPageSyncStatus('idle')
  }, [activePage, draftNoteId, pageSourceStatus, pages, pagesSignature])

  const handleContentChange = useCallback((pageId: string, contentHtml: string) => {
    setDraftState((currentState) => {
      const nextPages = currentState.localPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              contentHtml,
              hasUnsavedChanges: page.source === 'api'
                ? contentHtml !== (page.lastSavedContentHtml ?? page.contentHtml)
                : false,
            }
          : page,
      )

      return {
        ...currentState,
        draftMetadata: null,
        isLocalDraftActive: true,
        localPages: nextPages,
        status: persistDraft(
          draftNoteId,
          nextPages,
          currentState.activePageId,
          getDraftBaseSource(pageSourceStatus, nextPages),
        ),
      }
    })
    setBackendSaveStatus((currentStatus) => {
      if (currentStatus === 'saving') {
        return currentStatus
      }

      if (activeLocalPage.source !== 'api') {
        return 'localOnly'
      }

      return contentHtml !== (activeLocalPage.lastSavedContentHtml ?? activeLocalPage.contentHtml)
        ? 'localChanges'
        : 'saved'
    })
    setBackendSaveError(null)
  }, [activeLocalPage, draftNoteId, pageSourceStatus])

  const handleAddPage = useCallback(async () => {
    if (canCreateBackendPage) {
      setDraftState((currentState) => ({
        ...currentState,
        draftMetadata: null,
        isLocalDraftActive: true,
        status: 'creatingPage',
      }))
      setBackendSaveError(null)

      try {
        const createdPage = await createNotePage(draftNoteId, blankPageHtml, 'html')
        const nextPage = createApiLocalPage(createdPage)

        setDraftState((currentState) => {
          const hasCreatedPage = currentState.localPages.some((page) => page.id === nextPage.id)
          const nextPages = hasCreatedPage
            ? currentState.localPages.map((page) => (page.id === nextPage.id ? nextPage : page))
            : [...currentState.localPages, nextPage]
          const persisted = saveLocalDraft(draftNoteId, nextPages, nextPage.id, {
            apiUpdatedAt: getLatestPageApiUpdatedAt(nextPages),
            baseSource: 'api',
          })

          return {
            activePageId: nextPage.id,
            draftMetadata: null,
            isLocalDraftActive: true,
            localPages: nextPages,
            status: persisted ? 'backendPageCreated' : 'unavailable',
          }
        })
        setBackendSaveStatus('saved')
        return
      } catch (createError) {
        setBackendSaveError(
          createError instanceof Error ? createError.message : 'Falha ao criar página',
        )
        setBackendSaveStatus('localOnly')
        setDraftState((currentState) => {
          const nextPageNumber =
            Math.max(...currentState.localPages.map((page) => page.pageNumber), 0) + 1
          const nextPage = createBlankLocalPage(nextPageNumber)
          const nextPages = [...currentState.localPages, nextPage]
          const persisted = saveLocalDraft(draftNoteId, nextPages, nextPage.id, {
            apiUpdatedAt: getLatestPageApiUpdatedAt(nextPages),
            baseSource: getDraftBaseSource(pageSourceStatus, nextPages),
          })

          return {
            activePageId: nextPage.id,
            draftMetadata: null,
            isLocalDraftActive: true,
            localPages: nextPages,
            status: persisted ? 'pageCreateError' : 'unavailable',
          }
        })
        return
      }
    }

    setDraftState((currentState) => {
      const nextPageNumber = Math.max(...currentState.localPages.map((page) => page.pageNumber), 0) + 1
      const nextPage = createBlankLocalPage(nextPageNumber)
      const nextPages = [...currentState.localPages, nextPage]

      return {
        activePageId: nextPage.id,
        draftMetadata: null,
        isLocalDraftActive: true,
        localPages: nextPages,
        status: persistDraft(
          draftNoteId,
          nextPages,
          nextPage.id,
          getDraftBaseSource(pageSourceStatus, nextPages),
        ) === 'saved'
          ? 'localPageCreated'
          : 'unavailable',
      }
    })
    setBackendSaveStatus('localOnly')
    setBackendSaveError(null)
  }, [canCreateBackendPage, draftNoteId, pageSourceStatus])

  const handleSelectPage = useCallback((pageId: string) => {
    const selectedPage = localPages.find((page) => page.id === pageId)

    setBackendSaveStatus(getBackendSaveStatusForPage(selectedPage))
    setBackendSaveError(null)
    setDraftState((currentState) => ({
      ...currentState,
      draftMetadata: null,
      activePageId: pageId,
      isLocalDraftActive: true,
      status: persistDraft(
        draftNoteId,
        currentState.localPages,
        pageId,
        getDraftBaseSource(pageSourceStatus, currentState.localPages),
      ),
    }))
  }, [draftNoteId, localPages, pageSourceStatus])

  const handleClearDraft = useCallback(() => {
    const cleared = clearLocalDraft(draftNoteId)
    const resetPages = pages.map(createLocalPage)
    const nextActivePageId = resetPages[0]?.id ?? activePage.id

    setDraftState({
      activePageId: nextActivePageId,
      draftMetadata: null,
      isLocalDraftActive: false,
      localPages: resetPages,
      status: cleared ? 'cleared' : sourceStatusToDraftStatus[pageSourceStatus],
    })
    setBackendSaveStatus(getBackendSaveStatusForPage(resetPages[0]))
    setBackendSaveError(null)
  }, [activePage.id, draftNoteId, pageSourceStatus, pages])

  const handleReloadFromApi = useCallback(() => {
    clearLocalDraft(draftNoteId)

    const resetPages = pages.map(createLocalPage)
    const nextActivePageId = resetPages[0]?.id ?? activePage.id

    setDraftState({
      activePageId: nextActivePageId,
      draftMetadata: null,
      isLocalDraftActive: false,
      localPages: resetPages,
      status: pageSourceStatus === 'api'
        ? 'draftReloadedFromApi'
        : sourceStatusToDraftStatus[pageSourceStatus],
    })
    setBackendSaveStatus(getBackendSaveStatusForPage(resetPages[0]))
    setBackendSaveError(null)
  }, [activePage.id, draftNoteId, pageSourceStatus, pages])

  const handleSyncLocalPages = useCallback(async () => {
    if (!isRealNoteContext) {
      setLocalPageSyncError('Disponível apenas para anotação real da API.')
      setLocalPageSyncStatus('error')
      return
    }

    const pendingLocalPages = localPages.filter((page) => page.source !== 'api')

    if (pendingLocalPages.length === 0) {
      setLocalPageSyncError(null)
      setLocalPageSyncStatus('idle')
      return
    }

    setLocalPageSyncError(null)
    setLocalPageSyncStatus('syncing')

    let nextPages = localPages
    let nextActivePageId = activePageId
    let syncError: string | null = null

    for (const localPage of pendingLocalPages) {
      try {
        const createdPage = await createNotePage(
          draftNoteId,
          localPage.contentHtml,
          localPage.contentFormat || 'html',
        )
        const syncedPage = createSyncedApiPage(localPage, createdPage)

        nextPages = nextPages.map((page) => (page.id === localPage.id ? syncedPage : page))

        if (nextActivePageId === localPage.id) {
          nextActivePageId = syncedPage.id
        }
      } catch (createError) {
        syncError = createError instanceof Error
          ? createError.message
          : 'Falha ao sincronizar página local'
        break
      }
    }

    const persisted = saveLocalDraft(draftNoteId, nextPages, nextActivePageId, {
      apiUpdatedAt: getLatestPageApiUpdatedAt(nextPages),
      baseSource: getDraftBaseSource(pageSourceStatus, nextPages),
    })

    setDraftState((currentState) => ({
      ...currentState,
      activePageId: nextActivePageId,
      draftMetadata: null,
      isLocalDraftActive: true,
      localPages: nextPages,
      status: persisted
        ? syncError
          ? 'pageCreateError'
          : 'backendPageCreated'
        : 'unavailable',
    }))
    setBackendSaveStatus(
      getBackendSaveStatusForPage(
        nextPages.find((page) => page.id === nextActivePageId) ?? nextPages[0],
      ),
    )

    if (!persisted) {
      setLocalPageSyncError('As páginas foram processadas, mas o rascunho local não foi atualizado.')
      setLocalPageSyncStatus('unavailable')
      return
    }

    if (syncError) {
      setLocalPageSyncError(syncError)
      setLocalPageSyncStatus('error')
      return
    }

    setLocalPageSyncError(null)
    setLocalPageSyncStatus('synced')
  }, [activePageId, draftNoteId, isRealNoteContext, localPages, pageSourceStatus])

  const handleSaveActivePage = useCallback(async () => {
    const pageToSave = activeLocalPage

    if (pageToSave.source !== 'api') {
      setBackendSaveStatus('localOnly')
      setBackendSaveError(null)
      return
    }

    setBackendSaveStatus('saving')
    setBackendSaveError(null)

    try {
      const updatedPage = await updateNotePageContent(
        draftNoteId,
        pageToSave.id,
        pageToSave.contentHtml,
        pageToSave.contentFormat,
      )
      const updatedContentHtml = getApiPageContentHtml(updatedPage)

      setDraftState((currentState) => {
        const nextPages = currentState.localPages.map((page) =>
          page.id === updatedPage.id
            ? {
                ...page,
                contentFormat: 'html' as const,
                contentHtml: updatedContentHtml,
                hasUnsavedChanges: false,
                heightMm: Number(updatedPage.heightMm) || page.heightMm,
                lastSavedContentHtml: updatedContentHtml,
                pageNumber: Number(updatedPage.pageNumber) || page.pageNumber,
                source: 'api' as const,
                apiUpdatedAt: updatedPage.updatedAt,
                widthMm: Number(updatedPage.widthMm) || page.widthMm,
              }
            : page,
        )
        const persisted = saveLocalDraft(draftNoteId, nextPages, currentState.activePageId, {
          apiUpdatedAt: getLatestPageApiUpdatedAt(nextPages),
          baseSource: 'api',
        })

        return {
          ...currentState,
          draftMetadata: null,
          isLocalDraftActive: true,
          localPages: nextPages,
          status: persisted ? 'backendAndLocalSaved' : 'unavailable',
        }
      })
      setBackendSaveStatus('saved')
    } catch (saveError) {
      setBackendSaveError(saveError instanceof Error ? saveError.message : 'Falha ao salvar página')
      setBackendSaveStatus('error')
    }
  }, [activeLocalPage, draftNoteId])

  const backendSaveDescription = backendSaveError ?? backendSaveStatusDetail[backendSaveStatus]
  const saveButtonLabel = backendSaveStatus === 'saving' ? 'Salvando...' : 'Salvar página'
  const localPageSummary = hasLocalOnlyPages
    ? `${localOnlyPageCount} página${localOnlyPageCount === 1 ? '' : 's'} local${localOnlyPageCount === 1 ? '' : 'is'} pendente${localOnlyPageCount === 1 ? '' : 's'}`
    : 'Sem páginas locais pendentes'
  const draftMetadataSummary = draftState.draftMetadata
    ? `Rascunho salvo em ${new Date(draftState.draftMetadata.savedAt).toLocaleString()}`
    : 'Rascunho monitorado por anotação'
  const localPageSyncDescription = localPageSyncError
    ?? (!isRealNoteContext
      ? 'Disponível apenas para anotação real'
      : localPageSyncStatus === 'syncing'
        ? 'Enviando páginas locais via POST'
        : localPageSyncStatus === 'synced'
          ? 'Rascunho atualizado com ids reais'
          : hasLocalOnlyPages
            ? `${localOnlyPageCount} página${localOnlyPageCount === 1 ? '' : 's'} pronta${localOnlyPageCount === 1 ? '' : 's'} para envio`
            : 'Nenhuma página local pendente')
  const syncLocalPagesButtonLabel = localPageSyncStatus === 'syncing'
    ? 'Sincronizando...'
    : 'Sincronizar páginas locais'

  return (
    <section className="editor-workspace" aria-label="Editor A4 local">
      <div className="editor-chrome">
        <EditorToolbar editor={editor} />
        <div className="prototype-banner" role="note">
          <div>
            <span className="prototype-banner__badge">Edição local</span>
            <strong>{draftStatusLabel[status]}</strong>
          </div>
          <div className="prototype-banner__details">
            <span>{draftStatusDetail[status]}</span>
            <span aria-hidden="true">·</span>
            <span>{draftMetadataSummary}</span>
            <span aria-hidden="true">·</span>
            <span>{localPageSummary}</span>
            <span aria-hidden="true">·</span>
            <span className={`active-page-sync active-page-sync--${activePageSyncStatus}`}>
              {activePageSyncLabel[activePageSyncStatus]}
            </span>
            <span aria-hidden="true">·</span>
            <span>{activeLocalPage.contentFormat.toUpperCase()} controlado</span>
          </div>
          <div className="prototype-banner__actions">
            <div
              className={`backend-save-status backend-save-status--${backendSaveStatus}`}
              role="status"
            >
              <strong>{backendSaveStatusLabel[backendSaveStatus]}</strong>
              <span>{backendSaveDescription}</span>
            </div>
            <div
              className={`local-page-sync-status local-page-sync-status--${localPageSyncStatus}`}
              role="status"
            >
              <strong>{localPageSyncStatusLabel[localPageSyncStatus]}</strong>
              <span>{localPageSyncDescription}</span>
            </div>
            <button
              className="sync-local-pages-button"
              type="button"
              disabled={!canSyncLocalPages}
              onClick={() => {
                void handleSyncLocalPages()
              }}
            >
              {syncLocalPagesButtonLabel}
            </button>
            <button
              className="save-page-button"
              type="button"
              disabled={!canSaveActivePage}
              onClick={handleSaveActivePage}
            >
              {saveButtonLabel}
            </button>
            {canReloadFromApi && (
              <button
                className="reload-api-button"
                type="button"
                onClick={handleReloadFromApi}
              >
                Recarregar da API
              </button>
            )}
            <button className="clear-local-draft-button" type="button" onClick={handleClearDraft}>
              Limpar rascunho local
            </button>
          </div>
        </div>
      </div>

      <div className="editor-canvas">
        <PageNavigator
          pages={localPages}
          activePageId={activeLocalPage.id}
          isAddingPage={isCreatingPage}
          pageStatusById={pageStatusById}
          onAddPage={handleAddPage}
          onSelectPage={handleSelectPage}
        />
        <div className="editor-page-area">
          <div className="editor-page-area__status">
            <span>
              Página {activeLocalPage.pageNumber} de {localPages.length}
            </span>
            <span>
              {activePageSyncLabel[activePageSyncStatus]}
            </span>
          </div>
          <A4EditorPage
            contentHtml={activeLocalPage.contentHtml}
            page={activeLocalPage}
            onContentChange={(contentHtml) => handleContentChange(activeLocalPage.id, contentHtml)}
            onEditorReady={setEditor}
          />
        </div>
      </div>
    </section>
  )
}
