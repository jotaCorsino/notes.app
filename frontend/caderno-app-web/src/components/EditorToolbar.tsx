import { useEditorState, type Editor } from '@tiptap/react'

interface EditorToolbarProps {
  editor: Editor | null
}

const getButtonClassName = (isActive: boolean) =>
  isActive ? 'toolbar-button toolbar-button--active' : 'toolbar-button'

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const isEditorReady = Boolean(editor)
  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      bold: currentEditor?.isActive('bold') ?? false,
      italic: currentEditor?.isActive('italic') ?? false,
      underline: currentEditor?.isActive('underline') ?? false,
      bulletList: currentEditor?.isActive('bulletList') ?? false,
      orderedList: currentEditor?.isActive('orderedList') ?? false,
      highlight: currentEditor?.isActive('highlight') ?? false,
      alignLeft: currentEditor?.isActive({ textAlign: 'left' }) ?? false,
      alignCenter: currentEditor?.isActive({ textAlign: 'center' }) ?? false,
      alignRight: currentEditor?.isActive({ textAlign: 'right' }) ?? false,
    }),
  }) ?? {
    alignCenter: false,
    alignLeft: false,
    alignRight: false,
    bold: false,
    bulletList: false,
    highlight: false,
    italic: false,
    orderedList: false,
    underline: false,
  }

  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Ferramentas de formatação">
      <div className="editor-toolbar__group editor-toolbar__group--selects">
        <label className="toolbar-select">
          <span>Fonte</span>
          <select aria-label="Fonte" defaultValue="Georgia" disabled>
            <option>Georgia</option>
          </select>
        </label>
        <label className="toolbar-select toolbar-select--size">
          <span>Tamanho</span>
          <select aria-label="Tamanho da fonte" defaultValue="16" disabled>
            <option>16</option>
          </select>
        </label>
      </div>

      <span className="toolbar-divider" aria-hidden="true" />

      <div className="editor-toolbar__group" aria-label="Estilo do texto">
        <button
          className={getButtonClassName(editorState.bold)}
          type="button"
          title="Negrito"
          aria-label="Negrito"
          aria-pressed={editorState.bold}
          disabled={!isEditorReady}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </button>
        <button
          className={getButtonClassName(editorState.italic)}
          type="button"
          title="Itálico"
          aria-label="Itálico"
          aria-pressed={editorState.italic}
          disabled={!isEditorReady}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </button>
        <button
          className={getButtonClassName(editorState.underline)}
          type="button"
          title="Sublinhado"
          aria-label="Sublinhado"
          aria-pressed={editorState.underline}
          disabled={!isEditorReady}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <span className="toolbar-underline">U</span>
        </button>
      </div>

      <span className="toolbar-divider" aria-hidden="true" />

      <div className="editor-toolbar__group" aria-label="Parágrafo">
        <button
          className={getButtonClassName(editorState.alignLeft)}
          type="button"
          title="Alinhar à esquerda"
          aria-label="Alinhar à esquerda"
          aria-pressed={editorState.alignLeft}
          disabled={!isEditorReady}
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
        >
          <span className="toolbar-align" aria-hidden="true">
            ≡
          </span>
        </button>
        <button
          className={getButtonClassName(editorState.alignCenter)}
          type="button"
          title="Centralizar"
          aria-label="Centralizar"
          aria-pressed={editorState.alignCenter}
          disabled={!isEditorReady}
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
        >
          <span className="toolbar-align toolbar-align--center" aria-hidden="true">
            ≡
          </span>
        </button>
        <button
          className={getButtonClassName(editorState.alignRight)}
          type="button"
          title="Alinhar à direita"
          aria-label="Alinhar à direita"
          aria-pressed={editorState.alignRight}
          disabled={!isEditorReady}
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
        >
          <span className="toolbar-align toolbar-align--right" aria-hidden="true">
            ≡
          </span>
        </button>
        <button
          className={
            editorState.bulletList
              ? 'toolbar-button toolbar-button--wide toolbar-button--active'
              : 'toolbar-button toolbar-button--wide'
          }
          type="button"
          title="Lista com marcadores"
          aria-label="Lista com marcadores"
          aria-pressed={editorState.bulletList}
          disabled={!isEditorReady}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <span aria-hidden="true">• ≡</span>
        </button>
        <button
          className={
            editorState.orderedList
              ? 'toolbar-button toolbar-button--wide toolbar-button--active'
              : 'toolbar-button toolbar-button--wide'
          }
          type="button"
          title="Lista numerada"
          aria-label="Lista numerada"
          aria-pressed={editorState.orderedList}
          disabled={!isEditorReady}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <span aria-hidden="true">1. ≡</span>
        </button>
      </div>

      <span className="toolbar-divider" aria-hidden="true" />

      <div className="editor-toolbar__group">
        <button
          className={
            editorState.highlight
              ? 'toolbar-button toolbar-button--highlight toolbar-button--active'
              : 'toolbar-button toolbar-button--highlight'
          }
          type="button"
          title="Marca-texto"
          aria-label="Marca-texto"
          aria-pressed={editorState.highlight}
          disabled={!isEditorReady}
          onClick={() => editor?.chain().focus().toggleHighlight().run()}
        >
          <span aria-hidden="true">A</span>
        </button>
      </div>

      <span className="editor-toolbar__zoom">100%</span>
    </div>
  )
}
