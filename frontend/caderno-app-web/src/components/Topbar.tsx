import { SaveStatus } from './SaveStatus'

interface TopbarProps {
  noteTitle: string
  subjectTitle: string
  saveStatus: string
}

export function Topbar({ noteTitle, subjectTitle, saveStatus }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar__context">
        <span className="topbar__product">Caderno App.</span>
        <span className="topbar__separator" aria-hidden="true">
          /
        </span>
        <div className="topbar__note">
          <span>{subjectTitle}</span>
          <strong>{noteTitle}</strong>
        </div>
      </div>

      <div className="topbar__actions">
        <SaveStatus label={saveStatus} />
        <button className="primary-button" type="button" aria-label="Nova anotação" disabled>
          <span aria-hidden="true">＋</span>
          Nova anotação
        </button>
      </div>
    </header>
  )
}
