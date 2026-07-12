import type { Subject } from '../types/notebook'

export type SidebarApiStatus = 'loading' | 'connected' | 'unavailable'

interface SidebarProps {
  apiError: string | null
  apiStatus: SidebarApiStatus
  ownerName: string
  workspaceName: string
  subjects: Subject[]
  selectedSubject: Subject
  selectedModuleId: string
  selectedNoteId: string
}

const apiStatusLabel: Record<SidebarApiStatus, string> = {
  connected: 'API conectada',
  loading: 'Carregando matérias',
  unavailable: 'API indisponível',
}

export function Sidebar({
  apiError,
  apiStatus,
  ownerName,
  workspaceName,
  subjects,
  selectedSubject,
  selectedModuleId,
  selectedNoteId,
}: SidebarProps) {
  const ownerInitials = ownerName
    .split(' ')
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
  const isApiUnavailable = apiStatus === 'unavailable'
  const isApiConnected = apiStatus === 'connected'
  const hasSubjects = subjects.length > 0

  return (
    <aside className="sidebar" aria-label="Navegação do fichário">
      <div className="sidebar__brand">
        <span className="brand-mark" aria-hidden="true">
          C
        </span>
        <div>
          <strong>Caderno</strong>
          <span>APP</span>
        </div>
      </div>

      <nav className="sidebar__navigation" aria-label="Navegação principal">
        <div className="nav-item nav-item--active" aria-current="page">
          <span aria-hidden="true">⌂</span>
          {workspaceName}
        </div>
        <div className="nav-item">
          <span aria-hidden="true">◇</span>
          Favoritos
        </div>
      </nav>

      <div className="sidebar__library">
        <section className="sidebar__section" aria-labelledby="subjects-title">
          <div className="section-heading">
            <h2 id="subjects-title">Matérias</h2>
            <span>{subjects.length}</span>
          </div>
          <div className={`sidebar-api-status sidebar-api-status--${apiStatus}`} role="status">
            <span className="sidebar-api-status__dot" aria-hidden="true" />
            <span>{apiStatusLabel[apiStatus]}</span>
          </div>
          {isApiUnavailable && (
            <p className="sidebar-api-message" title={apiError ?? undefined}>
              API indisponível — exibindo dados mockados
            </p>
          )}
          <ul className="subject-list">
            {hasSubjects ? (
              subjects.map((subject) => (
                <li
                  className={subject.id === selectedSubject.id ? 'subject-item subject-item--active' : 'subject-item'}
                  key={subject.id}
                  aria-current={subject.id === selectedSubject.id ? 'true' : undefined}
                >
                  <span className={`subject-badge subject-badge--${subject.color}`} aria-hidden="true">
                    {subject.shortLabel}
                  </span>
                  <span>{subject.title}</span>
                  <span className="subject-item__count">{subject.modules.length}</span>
                </li>
              ))
            ) : (
              isApiConnected && (
                <li className="subject-list__empty">Nenhuma matéria cadastrada ainda</li>
              )
            )}
          </ul>
        </section>

        <section className="sidebar__section sidebar__section--modules" aria-labelledby="modules-title">
          <div className="section-heading">
            <h2 id="modules-title">Neste caderno</h2>
            <span>{selectedSubject.modules.length}</span>
          </div>
          <ul className="module-list">
            {selectedSubject.modules.map((module) => {
              const isSelectedModule = module.id === selectedModuleId

              return (
                <li className="module-item" key={module.id}>
                  <div className={isSelectedModule ? 'module-row module-row--active' : 'module-row'}>
                    <span className="module-row__chevron" aria-hidden="true">
                      ⌄
                    </span>
                    <span>{module.title}</span>
                  </div>
                  <ul className="note-list">
                    {module.notes.map((note) => (
                      <li
                        className={note.id === selectedNoteId ? 'note-item note-item--active' : 'note-item'}
                        key={note.id}
                        aria-current={note.id === selectedNoteId ? 'page' : undefined}
                      >
                        <span className="note-item__page" aria-hidden="true" />
                        <span>{note.title}</span>
                        {note.isFavorite && (
                          <span className="note-item__favorite" aria-label="Favorita">
                            ★
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <footer className="sidebar__footer">
        <span className="avatar" aria-hidden="true">
          {ownerInitials}
        </span>
        <div>
          <strong>{ownerName}</strong>
          <span>Estudante</span>
        </div>
        <span className="footer-menu" aria-hidden="true">
          ···
        </span>
      </footer>
    </aside>
  )
}
