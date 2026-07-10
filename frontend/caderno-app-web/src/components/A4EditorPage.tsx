import type { NotebookPage } from '../types/notebook'

interface A4EditorPageProps {
  page: NotebookPage
}

export function A4EditorPage({ page }: A4EditorPageProps) {
  const { content } = page
  const pageTitleId = `page-title-${page.id}`

  return (
    <article className="a4-page a4-editor-page" aria-labelledby={pageTitleId}>
      <div className="editor-page-meta">
        <span>Página {page.pageNumber}</span>
        <span>A4 · {page.widthMm} × {page.heightMm} mm</span>
      </div>

      <div
        className="editable-surface"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label={`Área de edição visual da página ${page.pageNumber}`}
        aria-multiline="true"
        spellCheck={false}
      >
        <header className="paper-header">
          <div>
            <p className="paper-eyebrow">{content.eyebrow}</p>
            <h2 id={pageTitleId}>{content.title}</h2>
          </div>
          <span className="paper-date">18 MAR · 2026</span>
        </header>

        <p className="paper-subtitle">{content.subtitle}</p>
        <p className="paper-introduction">
          {content.introduction}
          <span className="editor-caret" aria-hidden="true" />
        </p>

        <aside className="paper-highlight" aria-label="Destaque da anotação">
          <span aria-hidden="true">✦</span>
          <p>{content.highlight}</p>
        </aside>

        <section className="paper-section">
          <p className="paper-section__number">01</p>
          <div>
            <h3>{content.sectionTitle}</h3>
            <p>{content.sectionBody}</p>
          </div>
        </section>

        <ol className="osi-layers" aria-label="Conteúdo estruturado da anotação">
          {content.layers.map((layer) => (
            <li key={layer.number}>
              <span className="layer-number">{layer.number}</span>
              <strong>{layer.name}</strong>
              <span>{layer.description}</span>
            </li>
          ))}
        </ol>

        <div className="paper-notes">
          <section>
            <span className="paper-note-label">{content.takeawayTitle}</span>
            <p>{content.takeawayBody}</p>
          </section>
          <section className="paper-next-step">
            <span aria-hidden="true">↗</span>
            <p>{content.nextStudy}</p>
          </section>
        </div>
      </div>

      <footer className="paper-footer">
        <span>CADERNO APP · {content.eyebrow.toUpperCase()}</span>
        <span>{page.pageNumber.toString().padStart(2, '0')}</span>
      </footer>
    </article>
  )
}
