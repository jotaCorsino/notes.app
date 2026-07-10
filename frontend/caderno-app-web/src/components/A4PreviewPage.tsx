import type { NotePageContent } from '../types/notebook'

interface A4PreviewPageProps {
  content: NotePageContent
}

export function A4PreviewPage({ content }: A4PreviewPageProps) {
  return (
    <article className="a4-page" aria-labelledby="page-title">
      <header className="paper-header">
        <div>
          <p className="paper-eyebrow">{content.eyebrow}</p>
          <h2 id="page-title">{content.title}</h2>
        </div>
        <span className="paper-date">18 MAR · 2026</span>
      </header>

      <p className="paper-subtitle">{content.subtitle}</p>
      <p className="paper-introduction">{content.introduction}</p>

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

      <ol className="osi-layers" aria-label="As sete camadas do modelo OSI">
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

      <footer className="paper-footer">
        <span>CADERNO APP · REDES</span>
        <span>01</span>
      </footer>
    </article>
  )
}
