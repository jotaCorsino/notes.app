import type { NotebookPage } from '../types/notebook'

interface PageNavigatorProps {
  pages: NotebookPage[]
  activePageId: string
  isAddingPage?: boolean
  onAddPage: () => void | Promise<void>
  onSelectPage: (pageId: string) => void
}

export function PageNavigator({
  pages,
  activePageId,
  isAddingPage = false,
  onAddPage,
  onSelectPage,
}: PageNavigatorProps) {
  const activePage = pages.find((page) => page.id === activePageId) ?? pages[0]
  const addPageButtonLabel = isAddingPage ? 'Criando...' : 'Página'

  return (
    <aside className="page-navigator" aria-label="Navegação de páginas do editor">
      <header className="page-navigator__header">
        <div>
          <span>Páginas</span>
          <strong>
            Página {activePage?.pageNumber ?? 1} de {pages.length}
          </strong>
        </div>
        <span className="page-navigator__count">{pages.length}</span>
      </header>

      <ol className="page-thumbnail-list">
        {pages.map((page) => {
          const isActive = page.id === activePageId

          return (
            <li
              className={isActive ? 'page-thumbnail page-thumbnail--active' : 'page-thumbnail'}
              key={page.id}
              aria-current={isActive ? 'page' : undefined}
            >
              <button
                className="page-thumbnail__button"
                type="button"
                aria-label={`Abrir página ${page.pageNumber}: ${page.content.title}`}
                aria-pressed={isActive}
                onClick={() => onSelectPage(page.id)}
              >
                <div className="page-thumbnail__paper" aria-hidden="true">
                  <span className="page-thumbnail__title" />
                  <span />
                  <span />
                  <span />
                  {page.pageNumber === 2 && <span className="page-thumbnail__highlight" />}
                </div>
                <div className="page-thumbnail__caption">
                  <span>{page.pageNumber.toString().padStart(2, '0')}</span>
                  <strong>{page.content.title}</strong>
                </div>
              </button>
            </li>
          )
        })}
      </ol>

      <button
        className="add-page-button"
        type="button"
        disabled={isAddingPage}
        onClick={() => {
          void onAddPage()
        }}
      >
        <span aria-hidden="true">+</span>
        {addPageButtonLabel}
      </button>
    </aside>
  )
}
