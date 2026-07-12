import { useCallback, useState } from 'react'
import type { Editor } from '@tiptap/react'
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

interface A4EditorWorkspaceProps {
  pages: NotebookPage[]
  activePage: NotebookPage
}

type DraftStatus = 'cleared' | 'loaded' | 'memory' | 'saved' | 'unavailable'

interface DraftEditorState {
  activePageId: string
  localPages: LocalDraftPage[]
  status: DraftStatus
}

const draftStatusLabel: Record<DraftStatus, string> = {
  cleared: 'Mocks restaurados',
  loaded: 'Rascunho no navegador',
  memory: 'Rascunho em memória',
  saved: 'Salvo localmente',
  unavailable: 'LocalStorage indisponível',
}

const draftStatusDetail: Record<DraftStatus, string> = {
  cleared: 'Mocks restaurados nesta sessão',
  loaded: 'Rascunho carregado do navegador',
  memory: 'Aguardando primeira alteração',
  saved: 'Rascunho salvo neste navegador',
  unavailable: 'Usando memória da sessão',
}

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
  contentHtml: createEditorHtml(page.content),
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

const createBlankLocalPage = (pageNumber: number): LocalDraftPage => {
  const content = createBlankPageContent(pageNumber)

  return {
    id: `local-page-${pageNumber}-${Date.now()}`,
    pageNumber,
    widthMm: 210,
    heightMm: 297,
    contentFormat: 'html',
    content,
    contentHtml: '<h1>Nova página</h1><p>Comece suas anotações aqui.</p>',
  }
}

const createInitialDraftState = (pages: NotebookPage[], activePage: NotebookPage): DraftEditorState => {
  const localDraft = loadLocalDraft()

  if (localDraft) {
    const activeDraftPage = localDraft.pages.some((page) => page.id === localDraft.activePageId)
      ? localDraft.activePageId
      : localDraft.pages[0].id

    return {
      activePageId: activeDraftPage,
      localPages: localDraft.pages,
      status: 'loaded',
    }
  }

  return {
    activePageId: activePage.id,
    localPages: pages.map(createLocalPage),
    status: 'memory',
  }
}

const persistDraft = (pages: LocalDraftPage[], activePageId: string): DraftStatus =>
  saveLocalDraft(pages, activePageId) ? 'saved' : 'unavailable'

export function A4EditorWorkspace({ pages, activePage }: A4EditorWorkspaceProps) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const [draftState, setDraftState] = useState<DraftEditorState>(() =>
    createInitialDraftState(pages, activePage),
  )
  const { activePageId, localPages, status } = draftState
  const activeLocalPage =
    localPages.find((page) => page.id === activePageId) ?? localPages[0] ?? createLocalPage(activePage)

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
        status: persistDraft(nextPages, currentState.activePageId),
      }
    })
  }, [])

  const handleAddPage = useCallback(() => {
    setDraftState((currentState) => {
      const nextPageNumber = Math.max(...currentState.localPages.map((page) => page.pageNumber), 0) + 1
      const nextPage = createBlankLocalPage(nextPageNumber)
      const nextPages = [...currentState.localPages, nextPage]

      return {
        activePageId: nextPage.id,
        localPages: nextPages,
        status: persistDraft(nextPages, nextPage.id),
      }
    })
  }, [])

  const handleSelectPage = useCallback((pageId: string) => {
    setDraftState((currentState) => ({
      ...currentState,
      activePageId: pageId,
      status: persistDraft(currentState.localPages, pageId),
    }))
  }, [])

  const handleClearDraft = useCallback(() => {
    const cleared = clearLocalDraft()
    const resetPages = pages.map(createLocalPage)
    const nextActivePageId = resetPages[0]?.id ?? activePage.id

    setDraftState({
      activePageId: nextActivePageId,
      localPages: resetPages,
      status: cleared ? 'cleared' : 'memory',
    })
  }, [activePage.id, pages])

  return (
    <section className="editor-workspace" aria-label="Protótipo local do editor A4">
      <div className="editor-chrome">
        <EditorToolbar editor={editor} />
        <div className="prototype-banner" role="note">
          <div>
            <span className="prototype-banner__badge">Protótipo local</span>
            <strong>{draftStatusLabel[status]}</strong>
          </div>
          <div className="prototype-banner__details">
            <span>{draftStatusDetail[status]}</span>
            <span aria-hidden="true">·</span>
            <span>Sem sincronização com API</span>
            <span aria-hidden="true">·</span>
            <span>{activeLocalPage.contentFormat.toUpperCase()} controlado</span>
          </div>
          <button className="clear-local-draft-button" type="button" onClick={handleClearDraft}>
            Limpar rascunho local
          </button>
        </div>
      </div>

      <div className="editor-canvas">
        <PageNavigator
          pages={localPages}
          activePageId={activeLocalPage.id}
          onAddPage={handleAddPage}
          onSelectPage={handleSelectPage}
        />
        <div className="editor-page-area">
          <div className="editor-page-area__status">
            <span>
              Página {activeLocalPage.pageNumber} de {localPages.length}
            </span>
            <span>Edição local · sem salvamento no backend</span>
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
