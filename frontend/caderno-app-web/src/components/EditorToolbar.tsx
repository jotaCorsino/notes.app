export function EditorToolbar() {
  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Ferramentas de formatação visual">
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
          className="toolbar-button"
          type="button"
          title="Negrito"
          aria-label="Negrito"
          disabled
        >
          <strong>B</strong>
        </button>
        <button
          className="toolbar-button"
          type="button"
          title="Itálico"
          aria-label="Itálico"
          disabled
        >
          <em>I</em>
        </button>
        <button
          className="toolbar-button"
          type="button"
          title="Sublinhado"
          aria-label="Sublinhado"
          disabled
        >
          <span className="toolbar-underline">U</span>
        </button>
      </div>

      <span className="toolbar-divider" aria-hidden="true" />

      <div className="editor-toolbar__group" aria-label="Parágrafo">
        <button
          className="toolbar-button"
          type="button"
          title="Alinhamento"
          aria-label="Alinhamento"
          disabled
        >
          <span className="toolbar-align" aria-hidden="true">
            ≡
          </span>
        </button>
        <button
          className="toolbar-button toolbar-button--wide"
          type="button"
          title="Lista com marcadores"
          aria-label="Lista com marcadores"
          disabled
        >
          <span aria-hidden="true">• ≡</span>
        </button>
        <button
          className="toolbar-button toolbar-button--wide"
          type="button"
          title="Lista numerada"
          aria-label="Lista numerada"
          disabled
        >
          <span aria-hidden="true">1. ≡</span>
        </button>
      </div>

      <span className="toolbar-divider" aria-hidden="true" />

      <div className="editor-toolbar__group">
        <button
          className="toolbar-button toolbar-button--highlight"
          type="button"
          title="Marca-texto"
          aria-label="Marca-texto"
          disabled
        >
          <span aria-hidden="true">A</span>
        </button>
      </div>

      <span className="editor-toolbar__zoom">100%</span>
    </div>
  )
}
