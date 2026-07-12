import type { Subject } from '../types/notebook'

export type SidebarApiStatus = 'loading' | 'connected' | 'unavailable'
export type SidebarModuleApiStatus = SidebarApiStatus | 'idle'

interface SidebarProps {
  apiError: string | null
  apiStatus: SidebarApiStatus
  moduleApiError: string | null
  moduleApiStatus: SidebarModuleApiStatus
  canSelectModules: boolean
  canSelectSubjects: boolean
  onSelectModule: (moduleId: string) => void
  onSelectSubject: (subjectId: string) => void
  ownerName: string
  workspaceName: string
  subjects: Subject[]
  selectedSubject: Subject
  selectedModuleId: string
  selectedNoteId: string
  showNotesMockNotice: boolean
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

export function Sidebar({
  apiError,
  apiStatus,
  moduleApiError,
  moduleApiStatus,
  canSelectModules,
  canSelectSubjects,
  onSelectModule,
  onSelectSubject,
  ownerName,
  workspaceName,
  subjects,
  selectedSubject,
  selectedModuleId,
  selectedNoteId,
  showNotesMockNotice,
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
          {areModulesUnavailable && (
            <p className="sidebar-api-message" title={moduleApiError ?? undefined}>
              Não foi possível carregar módulos da API.
            </p>
          )}
          <ul className="module-list">
            {hasModules ? (
              selectedSubject.modules.map((module) => {
                const isSelectedModule = module.id === selectedModuleId

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
                    )}
                    {showNotesMockNotice && isSelectedModule && (
                      <p className="module-notes-placeholder">
                        Anotações: mock — integração na próxima etapa.
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
          {showNotesMockNotice && hasModules && (
            <p className="sidebar-api-message">Anotações reais serão integradas na próxima etapa.</p>
          )}
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
