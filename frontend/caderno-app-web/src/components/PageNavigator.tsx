import type { NotebookPage } from '../types/notebook'

interface PageNavigatorProps {
  pages: NotebookPage[]
  activePageNumber: number
}

export function PageNavigator({ pages, activePageNumber }: PageNavigatorProps) {
  return (
    <aside className="page-navigator" aria-label="Navegação visual de páginas">
      <header className="page-navigator__header">
        <div>
          <span>Páginas</span>
          <strong>Página {activePageNumber} de {pages.length}</strong>
        </div>
        <span className="page-navigator__count">{pages.length}</span>
      </header>

      <ol className="page-thumbnail-list">
        {pages.map((page) => {
          const isActive = page.pageNumber === activePageNumber

          return (
            <li
              className={isActive ? 'page-thumbnail page-thumbnail--active' : 'page-thumbnail'}
              key={page.id}
              aria-current={isActive ? 'page' : undefined}
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
            </li>
          )
        })}
      </ol>

      <button className="add-page-button" type="button" disabled>
        <span aria-hidden="true">＋</span>
        Página
      </button>
    </aside>
  )
}
