import type { Editor } from '@tiptap/react'
import type { NotebookPage } from '../types/notebook'
import { RichTextEditor } from './RichTextEditor'

interface A4EditorPageProps {
  page: NotebookPage
  contentHtml: string
  onContentChange?: (content: string) => void
  onEditorReady?: (editor: Editor | null) => void
}

export function A4EditorPage({ contentHtml, page, onContentChange, onEditorReady }: A4EditorPageProps) {
  const { content } = page
  const pageTitleId = `page-title-${page.id}`

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
        initialContent={contentHtml}
        labelledBy={pageTitleId}
        pageNumber={page.pageNumber}
        onContentChange={onContentChange}
        onEditorReady={onEditorReady}
      />

      <footer className="paper-footer">
        <span>CADERNO APP · {content.eyebrow.toUpperCase()}</span>
        <span>{page.pageNumber.toString().padStart(2, '0')}</span>
      </footer>
    </article>
  )
}
