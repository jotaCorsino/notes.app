import type { NotebookPage } from '../types/notebook'
import { A4EditorPage } from './A4EditorPage'
import { EditorToolbar } from './EditorToolbar'
import { PageNavigator } from './PageNavigator'

interface A4EditorWorkspaceProps {
  pages: NotebookPage[]
  activePage: NotebookPage
}

export function A4EditorWorkspace({ pages, activePage }: A4EditorWorkspaceProps) {
  return (
    <section className="editor-workspace" aria-label="Protótipo visual do editor A4">
      <div className="editor-chrome">
        <EditorToolbar />
        <div className="prototype-banner" role="note">
          <div>
            <span className="prototype-banner__badge">Protótipo visual</span>
            <strong>Ainda sem salvamento real</strong>
          </div>
          <div className="prototype-banner__details">
            <span>Rascunho local</span>
            <span aria-hidden="true">·</span>
            <span>Sem integração com API</span>
            <span aria-hidden="true">·</span>
            <span>{activePage.contentFormat.toUpperCase()} controlado</span>
          </div>
        </div>
      </div>

      <div className="editor-canvas">
        <PageNavigator pages={pages} activePageNumber={activePage.pageNumber} />
        <div className="editor-page-area">
          <div className="editor-page-area__status">
            <span>Página {activePage.pageNumber} de {pages.length}</span>
            <span>Área de edição · 100%</span>
          </div>
          <A4EditorPage page={activePage} />
        </div>
      </div>
    </section>
  )
}
