import { useEffect, useState, type FormEvent } from 'react'
import type { Subject } from '../types/notebook'

export type SidebarApiStatus = 'loading' | 'connected' | 'unavailable'
export type SidebarModuleApiStatus = SidebarApiStatus | 'idle'
export type SidebarNoteApiStatus = SidebarApiStatus | 'idle'
type SidebarCreateStatus = 'idle' | 'creating' | 'created' | 'error'

interface SidebarProps {
  apiError: string | null
  apiStatus: SidebarApiStatus
  canCreateModule: boolean
  canCreateNote: boolean
  canCreateSubject: boolean
  moduleApiError: string | null
  moduleApiStatus: SidebarModuleApiStatus
  noteApiError: string | null
  noteApiStatus: SidebarNoteApiStatus
  canSelectModules: boolean
  canSelectNotes: boolean
  canSelectSubjects: boolean
  onCreateModule: (title: string) => Promise<void>
  onCreateNote: (title: string) => Promise<void>
  onCreateSubject: (name: string) => Promise<void>
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

interface QuickCreateFormProps {
  canCreate: boolean
  createdMessage: string
  error: string | null
  inputId: string
  label: string
  onChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  placeholder: string
  status: SidebarCreateStatus
  unavailableMessage: string
  value: string
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback

function QuickCreateForm({
  canCreate,
  createdMessage,
  error,
  inputId,
  label,
  onChange,
  onSubmit,
  placeholder,
  status,
  unavailableMessage,
  value,
}: QuickCreateFormProps) {
  const isCreating = status === 'creating'
  const displayStatus = canCreate ? status : 'unavailable'
  const statusMessage =
    displayStatus === 'creating'
      ? 'Criando...'
      : displayStatus === 'created'
        ? createdMessage
        : displayStatus === 'error'
          ? error
          : displayStatus === 'unavailable'
            ? unavailableMessage
            : null

  return (
    <form className="sidebar-create-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        autoComplete="off"
        disabled={!canCreate || isCreating}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      <button
        type="submit"
        disabled={!canCreate || isCreating || value.trim().length === 0}
      >
        {isCreating ? 'Criando...' : 'Criar'}
      </button>
      {statusMessage && (
        <p
          className={`sidebar-create-status sidebar-create-status--${displayStatus}`}
          aria-live="polite"
        >
          {statusMessage}
        </p>
      )}
    </form>
  )
}

export function Sidebar({
  apiError,
  apiStatus,
  canCreateModule,
  canCreateNote,
  canCreateSubject,
  moduleApiError,
  moduleApiStatus,
  noteApiError,
  noteApiStatus,
  canSelectModules,
  canSelectNotes,
  canSelectSubjects,
  onCreateModule,
  onCreateNote,
  onCreateSubject,
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
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newSubjectName, setNewSubjectName] = useState('')
  const [moduleCreateError, setModuleCreateError] = useState<string | null>(null)
  const [moduleCreateStatus, setModuleCreateStatus] = useState<SidebarCreateStatus>('idle')
  const [noteCreateError, setNoteCreateError] = useState<string | null>(null)
  const [noteCreateStatus, setNoteCreateStatus] = useState<SidebarCreateStatus>('idle')
  const [subjectCreateError, setSubjectCreateError] = useState<string | null>(null)
  const [subjectCreateStatus, setSubjectCreateStatus] = useState<SidebarCreateStatus>('idle')
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
  const subjectUnavailableMessage =
    apiStatus === 'loading'
      ? 'Aguardando a API para criar matéria.'
      : 'Criação real exige API ligada.'
  const moduleUnavailableMessage =
    moduleApiStatus === 'loading'
      ? 'Aguardando os módulos da API.'
      : moduleApiStatus === 'idle'
        ? 'Crie ou selecione uma matéria real primeiro.'
        : 'Criação real exige API ligada.'
  const noteUnavailableMessage =
    noteApiStatus === 'loading'
      ? 'Aguardando as anotações da API.'
      : noteApiStatus === 'idle'
        ? 'Crie ou selecione um módulo real primeiro.'
        : 'Criação real exige API ligada.'

  useEffect(() => {
    setNewModuleTitle('')
    setModuleCreateError(null)
    setModuleCreateStatus('idle')
  }, [selectedSubject.id])

  useEffect(() => {
    setNewNoteTitle('')
    setNoteCreateError(null)
    setNoteCreateStatus('idle')
  }, [selectedModuleId])

  const handleSubjectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = newSubjectName.trim()

    if (!canCreateSubject || !name) {
      return
    }

    setSubjectCreateError(null)
    setSubjectCreateStatus('creating')

    try {
      await onCreateSubject(name)
      setNewSubjectName('')
      setSubjectCreateStatus('created')
    } catch (createError) {
      setSubjectCreateError(
        getErrorMessage(createError, 'Não foi possível criar a matéria.'),
      )
      setSubjectCreateStatus('error')
    }
  }

  const handleModuleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = newModuleTitle.trim()

    if (!canCreateModule || !title) {
      return
    }

    setModuleCreateError(null)
    setModuleCreateStatus('creating')

    try {
      await onCreateModule(title)
      setNewModuleTitle('')
      setModuleCreateStatus('created')
    } catch (createError) {
      setModuleCreateError(
        getErrorMessage(createError, 'Não foi possível criar o módulo.'),
      )
      setModuleCreateStatus('error')
    }
  }

  const handleNoteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = newNoteTitle.trim()

    if (!canCreateNote || !title) {
      return
    }

    setNoteCreateError(null)
    setNoteCreateStatus('creating')

    try {
      await onCreateNote(title)
      setNewNoteTitle('')
      setNoteCreateStatus('created')
    } catch (createError) {
      setNoteCreateError(
        getErrorMessage(createError, 'Não foi possível criar a anotação.'),
      )
      setNoteCreateStatus('error')
    }
  }

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
          <QuickCreateForm
            canCreate={canCreateSubject}
            createdMessage="Matéria criada."
            error={subjectCreateError}
            inputId="new-subject-name"
            label="Nova matéria"
            onChange={(value) => {
              setNewSubjectName(value)
              setSubjectCreateError(null)
              setSubjectCreateStatus('idle')
            }}
            onSubmit={handleSubjectSubmit}
            placeholder="Nova matéria"
            status={subjectCreateStatus}
            unavailableMessage={subjectUnavailableMessage}
            value={newSubjectName}
          />
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
          <QuickCreateForm
            canCreate={canCreateModule}
            createdMessage="Módulo criado."
            error={moduleCreateError}
            inputId="new-module-title"
            label="Novo módulo"
            onChange={(value) => {
              setNewModuleTitle(value)
              setModuleCreateError(null)
              setModuleCreateStatus('idle')
            }}
            onSubmit={handleModuleSubmit}
            placeholder="Novo módulo"
            status={moduleCreateStatus}
            unavailableMessage={moduleUnavailableMessage}
            value={newModuleTitle}
          />
          <QuickCreateForm
            canCreate={canCreateNote}
            createdMessage="Anotação criada."
            error={noteCreateError}
            inputId="new-note-title"
            label="Nova anotação"
            onChange={(value) => {
              setNewNoteTitle(value)
              setNoteCreateError(null)
              setNoteCreateStatus('idle')
            }}
            onSubmit={handleNoteSubmit}
            placeholder="Nova anotação"
            status={noteCreateStatus}
            unavailableMessage={noteUnavailableMessage}
            value={newNoteTitle}
          />
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
