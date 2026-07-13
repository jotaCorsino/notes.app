export interface TagListItem {
  color?: string | null
  name: string
}

interface TagListProps {
  canEdit?: boolean
  colorValue?: string
  errorMessage?: string | null
  helperText?: string
  isAdding?: boolean
  nameValue?: string
  onAddTag?: () => void | Promise<void>
  onColorChange?: (value: string) => void
  onNameChange?: (value: string) => void
  onRemoveTag?: (tagName: string) => void | Promise<void>
  removingTagName?: string | null
  statusMessage?: string
  tags: TagListItem[]
}

const defaultTagColor = '#eef2ff'

export function TagList({
  canEdit = false,
  colorValue = '',
  errorMessage = null,
  helperText,
  isAdding = false,
  nameValue = '',
  onAddTag,
  onColorChange,
  onNameChange,
  onRemoveTag,
  removingTagName = null,
  statusMessage,
  tags,
}: TagListProps) {
  return (
    <section className="tag-panel" aria-label="Tags da anotação">
      <div className="tag-panel__header">
        <span>{statusMessage}</span>
        {errorMessage && <strong>{errorMessage}</strong>}
      </div>

      <ul className="tag-list">
        {tags.length > 0 ? (
          tags.map((tag) => {
            const tagColor = tag.color || defaultTagColor
            const isRemoving = removingTagName === tag.name

            return (
              <li className="tag-list__item" key={tag.name}>
                <span
                  className="tag-list__swatch"
                  style={{ background: tagColor }}
                  aria-hidden="true"
                />
                <span>#{tag.name}</span>
                {canEdit && onRemoveTag && (
                  <button
                    className="tag-list__remove"
                    type="button"
                    aria-label={`Remover tag ${tag.name}`}
                    disabled={isAdding || Boolean(removingTagName)}
                    onClick={() => {
                      void onRemoveTag(tag.name)
                    }}
                  >
                    {isRemoving ? '...' : 'x'}
                  </button>
                )}
              </li>
            )
          })
        ) : (
          <li className="tag-list__empty">Sem tags</li>
        )}
      </ul>

      {canEdit && onAddTag && (
        <form
          className="tag-form"
          onSubmit={(event) => {
            event.preventDefault()
            void onAddTag()
          }}
        >
          <label>
            <span>Tag</span>
            <input
              type="text"
              value={nameValue}
              placeholder="ex.: revisão"
              disabled={isAdding}
              onChange={(event) => onNameChange?.(event.target.value)}
            />
          </label>
          <label>
            <span>Cor</span>
            <input
              type="text"
              value={colorValue}
              placeholder={defaultTagColor}
              disabled={isAdding}
              onChange={(event) => onColorChange?.(event.target.value)}
            />
          </label>
          <button type="submit" disabled={isAdding || !nameValue.trim()}>
            {isAdding ? 'Adicionando...' : 'Adicionar tag'}
          </button>
        </form>
      )}

      {helperText && <p className="tag-panel__helper">{helperText}</p>}
    </section>
  )
}
