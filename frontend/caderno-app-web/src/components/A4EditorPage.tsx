import type { Editor } from '@tiptap/react'
import type { NotebookPage, NotePageContent } from '../types/notebook'
import { RichTextEditor } from './RichTextEditor'

interface A4EditorPageProps {
  page: NotebookPage
  onEditorReady?: (editor: Editor | null) => void
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

export function A4EditorPage({ page, onEditorReady }: A4EditorPageProps) {
  const { content } = page
  const pageTitleId = `page-title-${page.id}`
  const initialContent = createEditorHtml(content)

  return (
    <article className="a4-page a4-editor-page" aria-labelledby={pageTitleId}>
      <div className="editor-page-meta">
        <span>Página {page.pageNumber}</span>
        <span>A4 · {page.widthMm} × {page.heightMm} mm</span>
      </div>

      <h2 className="sr-only" id={pageTitleId}>
        {content.title}
      </h2>

      <RichTextEditor
        initialContent={initialContent}
        labelledBy={pageTitleId}
        pageNumber={page.pageNumber}
        onEditorReady={onEditorReady}
      />

      <footer className="paper-footer">
        <span>CADERNO APP · {content.eyebrow.toUpperCase()}</span>
        <span>{page.pageNumber.toString().padStart(2, '0')}</span>
      </footer>
    </article>
  )
}
