import type { Subject } from '../types/notebook'

export type SidebarApiStatus = 'loading' | 'connected' | 'unavailable'
export type SidebarModuleApiStatus = SidebarApiStatus | 'idle'
export type SidebarNoteApiStatus = SidebarApiStatus | 'idle'

interface SidebarProps {
  apiError: string | null
  apiStatus: SidebarApiStatus
  moduleApiError: string | null
  moduleApiStatus: SidebarModuleApiStatus
  noteApiError: string | null
  noteApiStatus: SidebarNoteApiStatus
  canSelectModules: boolean
  canSelectNotes: boolean
  canSelectSubjects: boolean
  onSelectModule: (moduleId: string) => void
  onSelectNote: (noteId: string) => void
  onSelectSubject: (subjectId: string) => void
  ownerName: string
  workspaceName: string
  subjects: Subject[]
  selectedSubject: Subject
  selectedModuleId: string
  selectedNoteId: string
  showPagesLocalNotice: boolean
}

const apiStatusLabel: Record<SidebarApiStatus, string> = {
  connected: 'Matérias: API conectada',
  loading: 'Matérias: carregando',
  unavailable: 'Matérias: API indisponível',
}

const moduleApiStatusLabel: Record<SidebarModuleApiStatus, string> = {
  connected: 'Módulos: API conectada',
  idle: 'Módulos: aguardando matéria',
  loading: 'Módulos: carregando',
  unavailable: 'Módulos: API indisponível',
}

const noteApiStatusLabel: Record<SidebarNoteApiStatus, string> = {
  connected: 'Anotações: API conectada',
  idle: 'Anotações: aguardando módulo',
  loading: 'Anotações: carregando',
  unavailable: 'Anotações: API indisponível',
}

export function Sidebar({
  apiError,
  apiStatus,
  moduleApiError,
  moduleApiStatus,
  noteApiError,
  noteApiStatus,
  canSelectModules,
  canSelectNotes,
  canSelectSubjects,
  onSelectModule,
  onSelectNote,
  onSelectSubject,
  ownerName,
  workspaceName,
  subjects,
  selectedSubject,
  selectedModuleId,
  selectedNoteId,
  showPagesLocalNotice,
}: SidebarProps) {
  const ownerInitials = ownerName
    .split(' ')
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
  const isApiUnavailable = apiStatus === 'unavailable'
  const isApiConnected = apiStatus === 'connected'
  const areModulesUnavailable = moduleApiStatus === 'unavailable'
  const areModulesConnected = moduleApiStatus === 'connected'
  const areNotesUnavailable = noteApiStatus === 'unavailable'
  const areNotesConnected = noteApiStatus === 'connected'
  const hasSubjects = subjects.length > 0
  const hasModules = selectedSubject.modules.length > 0

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
                <li key={subject.id}>
                  <button
                    className={subject.id === selectedSubject.id ? 'subject-item subject-item--active' : 'subject-item'}
                    type="button"
                    disabled={!canSelectSubjects}
                    onClick={() => onSelectSubject(subject.id)}
                    aria-current={subject.id === selectedSubject.id ? 'true' : undefined}
                  >
                    <span className={`subject-badge subject-badge--${subject.color}`} aria-hidden="true">
                      {subject.shortLabel}
                    </span>
                    <span>{subject.title}</span>
                    <span className="subject-item__count">{subject.modules.length}</span>
                  </button>
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
          <div className={`sidebar-api-status sidebar-api-status--${moduleApiStatus}`} role="status">
            <span className="sidebar-api-status__dot" aria-hidden="true" />
            <span>{moduleApiStatusLabel[moduleApiStatus]}</span>
          </div>
          <div className={`sidebar-api-status sidebar-api-status--${noteApiStatus}`} role="status">
            <span className="sidebar-api-status__dot" aria-hidden="true" />
            <span>{noteApiStatusLabel[noteApiStatus]}</span>
          </div>
          <p className="sidebar-api-message">Páginas/editor: local</p>
          {areModulesUnavailable && (
            <p className="sidebar-api-message" title={moduleApiError ?? undefined}>
              Não foi possível carregar módulos da API.
            </p>
          )}
          {areNotesUnavailable && (
            <p className="sidebar-api-message" title={noteApiError ?? undefined}>
              Não foi possível carregar anotações da API.
            </p>
          )}
          <ul className="module-list">
            {hasModules ? (
              selectedSubject.modules.map((module) => {
                const isSelectedModule = module.id === selectedModuleId
                const shouldShowEmptyNotes =
                  isSelectedModule && areNotesConnected && module.notes.length === 0

                return (
                  <li className="module-item" key={module.id}>
                    <button
                      className={isSelectedModule ? 'module-row module-row--active' : 'module-row'}
                      type="button"
                      disabled={!canSelectModules}
                      onClick={() => onSelectModule(module.id)}
                      aria-current={isSelectedModule ? 'true' : undefined}
                    >
                      <span className="module-row__chevron" aria-hidden="true">
                        ⌄
                      </span>
                      <span>{module.title}</span>
                    </button>
                    {module.notes.length > 0 && (
                      <ul className="note-list">
                        {module.notes.map((note) => (
                          <li key={note.id}>
                            <button
                              className={note.id === selectedNoteId ? 'note-item note-item--active' : 'note-item'}
                              type="button"
                              disabled={!canSelectNotes}
                              onClick={() => onSelectNote(note.id)}
                              aria-current={note.id === selectedNoteId ? 'page' : undefined}
                            >
                              <span className="note-item__page" aria-hidden="true" />
                              <span>{note.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {shouldShowEmptyNotes && (
                      <p className="module-notes-placeholder">
                        Nenhuma anotação cadastrada ainda
                      </p>
                    )}
                    {showPagesLocalNotice && isSelectedModule && (
                      <p className="module-notes-placeholder">
                        Páginas/editor: local — conteúdo real fica para etapa futura.
                      </p>
                    )}
                  </li>
                )
              })
            ) : (
              areModulesConnected && (
                <li className="subject-list__empty">Nenhum módulo cadastrado ainda</li>
              )
            )}
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
