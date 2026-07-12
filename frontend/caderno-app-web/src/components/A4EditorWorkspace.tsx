import { useCallback, useState } from 'react'
import type { Editor } from '@tiptap/react'
import type { NotebookPage, NotePageContent } from '../types/notebook'
import { A4EditorPage } from './A4EditorPage'
import { EditorToolbar } from './EditorToolbar'
import { PageNavigator } from './PageNavigator'

interface LocalNotebookPage extends NotebookPage {
  contentHtml: string
}

interface A4EditorWorkspaceProps {
  pages: NotebookPage[]
  activePage: NotebookPage
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

const createLocalPage = (page: NotebookPage): LocalNotebookPage => ({
  ...page,
  contentHtml: createEditorHtml(page.content),
})

const createBlankPageContent = (pageNumber: number): NotePageContent => ({
  eyebrow: 'Rascunho local',
  title: `Nova página ${pageNumber}`,
  subtitle: 'Página A4 criada nesta sessão',
  introduction: 'Comece suas anotações aqui.',
  highlight: 'Esta página existe apenas localmente enquanto a sessão estiver aberta.',
  sectionTitle: 'Primeiro tópico',
  sectionBody: 'Adicione definições, exemplos e lembretes importantes.',
  layers: [],
  takeawayTitle: 'Para lembrar',
  takeawayBody: 'O conteúdo ainda não é salvo no backend.',
  nextStudy: 'Próximo passo: organizar esta página antes de sair da sessão.',
})

const createBlankLocalPage = (pageNumber: number): LocalNotebookPage => {
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

export function A4EditorWorkspace({ pages, activePage }: A4EditorWorkspaceProps) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const [localPages, setLocalPages] = useState<LocalNotebookPage[]>(() => pages.map(createLocalPage))
  const [activePageId, setActivePageId] = useState(activePage.id)
  const activeLocalPage =
    localPages.find((page) => page.id === activePageId) ?? localPages[0] ?? createLocalPage(activePage)

  const handleContentChange = useCallback(
    (contentHtml: string) => {
      setLocalPages((currentPages) =>
        currentPages.map((page) =>
          page.id === activePageId
            ? {
                ...page,
                contentHtml,
              }
            : page,
        ),
      )
    },
    [activePageId],
  )

  const handleAddPage = useCallback(() => {
    const nextPageNumber = Math.max(...localPages.map((page) => page.pageNumber), 0) + 1
    const nextPage = createBlankLocalPage(nextPageNumber)

    setLocalPages((currentPages) => [...currentPages, nextPage])
    setActivePageId(nextPage.id)
  }, [localPages])

  return (
    <section className="editor-workspace" aria-label="Protótipo local do editor A4">
      <div className="editor-chrome">
        <EditorToolbar editor={editor} />
        <div className="prototype-banner" role="note">
          <div>
            <span className="prototype-banner__badge">Protótipo local</span>
            <strong>Ainda sem salvamento real</strong>
          </div>
          <div className="prototype-banner__details">
            <span>Alterações mantidas apenas nesta sessão</span>
            <span aria-hidden="true">·</span>
            <span>Sem integração com API</span>
            <span aria-hidden="true">·</span>
            <span>{activeLocalPage.contentFormat.toUpperCase()} controlado</span>
          </div>
        </div>
      </div>

      <div className="editor-canvas">
        <PageNavigator
          pages={localPages}
          activePageId={activeLocalPage.id}
          onAddPage={handleAddPage}
          onSelectPage={setActivePageId}
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
            onContentChange={handleContentChange}
            onEditorReady={setEditor}
          />
        </div>
      </div>
    </section>
  )
}
