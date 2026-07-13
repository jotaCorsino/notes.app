import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { createNotePage, updateNotePageContent, type ApiNotePage } from '../services/notesApi'
import type { NotebookPage, NotePageContent } from '../types/notebook'
import {
  clearLocalDraft,
  loadLocalDraft,
  saveLocalDraft,
  type LocalDraftPage,
} from '../utils/localDraftStorage'
import { A4EditorPage } from './A4EditorPage'
import { EditorToolbar } from './EditorToolbar'
import { PageNavigator } from './PageNavigator'

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
  | 'cleared'
  | 'creatingPage'
  | 'empty'
  | 'error'
  | 'loaded'
  | 'loading'
  | 'localPageCreated'
  | 'mock'
  | 'pageCreateError'
  | 'saved'
  | 'unavailable'

type BackendSaveStatus = 'error' | 'localChanges' | 'localOnly' | 'saved' | 'saving'

interface DraftEditorState {
  activePageId: string
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
  cleared: 'Rascunho limpo',
  creatingPage: 'Criando página...',
  empty: 'Sem páginas reais',
  error: 'Erro ao carregar páginas',
  loaded: 'Rascunho local carregado',
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
  cleared: 'Rascunho da anotação ativa foi removido',
  creatingPage: 'Enviando POST /api/notes/{noteId}/pages',
  empty: 'Usando página local inicial',
  error: 'Usando fallback local para manter o editor disponível',
  loaded: 'Rascunho local desta anotação foi encontrado',
  loading: 'Aguardando detalhes da anotação',
  localPageCreated: 'Sem chamada de API para mock ou fallback',
  mock: 'Usando dados mockados do protótipo',
  pageCreateError: 'Fallback local criado; conteúdo atual preservado',
  saved: 'Rascunho salvo neste navegador para esta anotação',
  unavailable: 'Usando memória da sessão',
}

const backendSaveStatusLabel: Record<BackendSaveStatus, string> = {
  error: 'Erro ao salvar',
  localChanges: 'Alterações locais',
  localOnly: 'Página local — não salva no backend',
  saved: 'Salvo no backend',
  saving: 'Salvando no backend...',
}

const backendSaveStatusDetail: Record<BackendSaveStatus, string> = {
  error: 'Conteúdo local preservado',
  localChanges: 'Use o botão para salvar esta página real',
  localOnly: 'Criação no backend será feita em etapa futura',
  saved: 'A página real foi criada ou atualizada pela API',
  saving: 'Enviando PUT /api/notes/{noteId}/pages/{pageId}/content',
}

const blankPageHtml = '<h1>Nova página</h1><p>Comece suas anotações aqui.</p>'

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

const createLocalPage = (page: NotebookPage): LocalDraftPage => ({
  ...page,
  contentHtml: page.contentHtml ?? createEditorHtml(page.content),
  source: page.source ?? 'local',
})

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

  return {
    id: page.id,
    pageNumber,
    widthMm: Number(page.widthMm) || 210,
    heightMm: Number(page.heightMm) || 297,
    contentFormat: 'html',
    content: createApiPageContent(pageNumber),
    contentHtml: getApiPageContentHtml(page),
    source: 'api',
  }
}

const hydrateDraftPagesWithSources = (
  draftPages: LocalDraftPage[],
  sourcePages: NotebookPage[],
): LocalDraftPage[] =>
  draftPages.map((draftPage) => {
    const sourcePage = sourcePages.find((page) => page.id === draftPage.id)

    return {
      ...draftPage,
      source: sourcePage?.source ?? draftPage.source ?? 'local',
    }
  })

const getActivePageFromState = (state: DraftEditorState) =>
  state.localPages.find((page) => page.id === state.activePageId) ?? state.localPages[0]

const getBackendSaveStatusForPage = (page: LocalDraftPage | undefined): BackendSaveStatus =>
  page?.source === 'api' ? 'localChanges' : 'localOnly'

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
      localPages: hydratedPages,
      status: 'loaded',
    }
  }

  return {
    activePageId: activePage.id,
    localPages: pages.map(createLocalPage),
    status: sourceStatusToDraftStatus[pageSourceStatus],
  }
}

const persistDraft = (
  draftNoteId: string,
  pages: LocalDraftPage[],
  activePageId: string,
): DraftStatus => (saveLocalDraft(draftNoteId, pages, activePageId) ? 'saved' : 'unavailable')

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
  const pagesSignature = useMemo(() => createPagesSignature(pages), [pages])
  const { activePageId, localPages, status } = draftState
  const activeLocalPage =
    localPages.find((page) => page.id === activePageId) ?? localPages[0] ?? createLocalPage(activePage)
  const canSaveActivePage = activeLocalPage.source === 'api' && backendSaveStatus !== 'saving'
  const canCreateBackendPage = pageSourceStatus === 'api' ||
    pageSourceStatus === 'empty' ||
    pageSourceStatus === 'error'
  const isCreatingPage = status === 'creatingPage'

  useEffect(() => {
    const nextState = createInitialDraftState(draftNoteId, pages, activePage, pageSourceStatus)

    setDraftState(nextState)
    setBackendSaveStatus(getBackendSaveStatusForPage(getActivePageFromState(nextState)))
    setBackendSaveError(null)
  }, [activePage, draftNoteId, pageSourceStatus, pages, pagesSignature])

  const handleContentChange = useCallback((pageId: string, contentHtml: string) => {
    setDraftState((currentState) => {
      const nextPages = currentState.localPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              contentHtml,
            }
          : page,
      )

      return {
        ...currentState,
        localPages: nextPages,
        status: persistDraft(draftNoteId, nextPages, currentState.activePageId),
      }
    })
    setBackendSaveStatus((currentStatus) =>
      currentStatus === 'saving' ? currentStatus : getBackendSaveStatusForPage(activeLocalPage),
    )
    setBackendSaveError(null)
  }, [activeLocalPage, draftNoteId])

  const handleAddPage = useCallback(async () => {
    if (canCreateBackendPage) {
      setDraftState((currentState) => ({
        ...currentState,
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
          const persisted = saveLocalDraft(draftNoteId, nextPages, nextPage.id)

          return {
            activePageId: nextPage.id,
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
          const persisted = saveLocalDraft(draftNoteId, nextPages, nextPage.id)

          return {
            activePageId: nextPage.id,
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
        localPages: nextPages,
        status: persistDraft(draftNoteId, nextPages, nextPage.id) === 'saved'
          ? 'localPageCreated'
          : 'unavailable',
      }
    })
    setBackendSaveStatus('localOnly')
    setBackendSaveError(null)
  }, [canCreateBackendPage, draftNoteId])

  const handleSelectPage = useCallback((pageId: string) => {
    const selectedPage = localPages.find((page) => page.id === pageId)

    setBackendSaveStatus(getBackendSaveStatusForPage(selectedPage))
    setBackendSaveError(null)
    setDraftState((currentState) => ({
      ...currentState,
      activePageId: pageId,
      status: persistDraft(draftNoteId, currentState.localPages, pageId),
    }))
  }, [draftNoteId, localPages])

  const handleClearDraft = useCallback(() => {
    const cleared = clearLocalDraft(draftNoteId)
    const resetPages = pages.map(createLocalPage)
    const nextActivePageId = resetPages[0]?.id ?? activePage.id

    setDraftState({
      activePageId: nextActivePageId,
      localPages: resetPages,
      status: cleared ? 'cleared' : sourceStatusToDraftStatus[pageSourceStatus],
    })
    setBackendSaveStatus(getBackendSaveStatusForPage(resetPages[0]))
    setBackendSaveError(null)
  }, [activePage.id, draftNoteId, pageSourceStatus, pages])

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
                heightMm: Number(updatedPage.heightMm) || page.heightMm,
                pageNumber: Number(updatedPage.pageNumber) || page.pageNumber,
                source: 'api' as const,
                widthMm: Number(updatedPage.widthMm) || page.widthMm,
              }
            : page,
        )
        const persisted = saveLocalDraft(draftNoteId, nextPages, currentState.activePageId)

        return {
          ...currentState,
          localPages: nextPages,
          status: persisted ? 'saved' : 'unavailable',
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
            <span>Sem salvamento no backend</span>
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
            <button
              className="save-page-button"
              type="button"
              disabled={!canSaveActivePage}
              onClick={handleSaveActivePage}
            >
              {saveButtonLabel}
            </button>
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
          onAddPage={handleAddPage}
          onSelectPage={handleSelectPage}
        />
        <div className="editor-page-area">
          <div className="editor-page-area__status">
            <span>
              Página {activeLocalPage.pageNumber} de {localPages.length}
            </span>
            <span>
              {activeLocalPage.source === 'api'
                ? 'Página real · salvar no backend por botão'
                : 'Página local · criação no backend futura'}
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
