import './App.css'
import { useEffect, useState } from 'react'
import { A4EditorWorkspace } from './components/A4EditorWorkspace'
import {
  Sidebar,
  type SidebarApiStatus,
  type SidebarModuleApiStatus,
  type SidebarNoteApiStatus,
} from './components/Sidebar'
import { TagList } from './components/TagList'
import { Topbar } from './components/Topbar'
import { mockNotebook } from './data/mockNotebook'
import { useNotes, type NotesStatus } from './hooks/useNotes'
import { useStudyModules, type StudyModulesStatus } from './hooks/useStudyModules'
import { useSubjects, type SubjectsStatus } from './hooks/useSubjects'
import type { ApiNote } from './services/notesApi'
import type { ApiStudyModule, ApiSubject } from './services/subjectsApi'
import type { NotebookNote, StudyModule, Subject } from './types/notebook'

type SubjectColor = Subject['color']

const subjectColors: SubjectColor[] = ['sage', 'coral', 'blue']

const createShortLabel = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join('')

  return initials || 'MT'
}

const normalizeSubjectColor = (color: string | null, index: number): SubjectColor => {
  const normalizedColor = color?.toLowerCase() as SubjectColor | undefined

  return normalizedColor && subjectColors.includes(normalizedColor)
    ? normalizedColor
    : subjectColors[index % subjectColors.length]
}

const mapApiNoteToSidebarNote = (note: ApiNote): NotebookNote => ({
  id: note.id,
  title: note.title,
  tags: [],
  isFavorite: false,
  saveStatus: 'Páginas/editor: local',
  activePageNumber: 1,
  pages: [],
})

const mapApiModuleToSidebarModule = (
  module: ApiStudyModule,
  notes: NotebookNote[] = [],
): StudyModule => ({
  id: module.id,
  title: module.title,
  notes,
})

const mapApiSubjectToSidebarSubject = (
  subject: ApiSubject,
  index: number,
  modules: StudyModule[] = [],
): Subject => ({
  id: subject.id,
  title: subject.name,
  shortLabel: createShortLabel(subject.name),
  color: normalizeSubjectColor(subject.color, index),
  modules,
})

const getSidebarApiStatus = (status: SubjectsStatus): SidebarApiStatus => {
  if (status === 'loading' || status === 'idle') {
    return 'loading'
  }

  if (status === 'success') {
    return 'connected'
  }

  return 'unavailable'
}

const getModulesApiStatus = (
  status: StudyModulesStatus,
  hasSelectedSubject: boolean,
): SidebarModuleApiStatus => {
  if (!hasSelectedSubject || status === 'idle') {
    return 'idle'
  }

  if (status === 'loading') {
    return 'loading'
  }

  if (status === 'success') {
    return 'connected'
  }

  return 'unavailable'
}

const getNotesApiStatus = (
  status: NotesStatus,
  hasSelectedModule: boolean,
): SidebarNoteApiStatus => {
  if (!hasSelectedModule || status === 'idle') {
    return 'idle'
  }

  if (status === 'loading') {
    return 'loading'
  }

  if (status === 'success') {
    return 'connected'
  }

  return 'unavailable'
}

function App() {
  const [selectedApiSubjectId, setSelectedApiSubjectId] = useState<string | null>(null)
  const [selectedApiModuleId, setSelectedApiModuleId] = useState<string | null>(null)
  const [selectedApiNoteId, setSelectedApiNoteId] = useState<string | null>(null)
  const {
    subjects: apiSubjects,
    status: subjectsStatus,
    error: subjectsError,
  } = useSubjects()
  const hasApiSubjects = subjectsStatus === 'success' && apiSubjects.length > 0
  const selectedApiSubject = hasApiSubjects
    ? apiSubjects.find((subject) => subject.id === selectedApiSubjectId) ?? apiSubjects[0]
    : null
  const {
    modules: apiModules,
    status: modulesStatus,
    error: modulesError,
  } = useStudyModules(selectedApiSubject?.id ?? null)
  const hasApiModules = modulesStatus === 'success' && apiModules.length > 0
  const selectedApiModule = hasApiModules
    ? apiModules.find((module) => module.id === selectedApiModuleId) ?? apiModules[0]
    : null
  const {
    notes: apiNotes,
    status: notesStatus,
    error: notesError,
  } = useNotes(selectedApiModule?.id ?? null)
  const sidebarNotes =
    notesStatus === 'success'
      ? apiNotes.map(mapApiNoteToSidebarNote)
      : []
  const sidebarModules =
    modulesStatus === 'success'
      ? apiModules.map((module) =>
          mapApiModuleToSidebarModule(
            module,
            module.id === selectedApiModule?.id ? sidebarNotes : [],
          ),
        )
      : []
  const selectedApiNote =
    notesStatus === 'success' && apiNotes.length > 0
      ? apiNotes.find((note) => note.id === selectedApiNoteId) ?? apiNotes[0]
      : null
  const selectedMockSubject = mockNotebook.subjects.find(
    (subject) => subject.id === mockNotebook.selectedSubjectId,
  ) ?? mockNotebook.subjects[0]
  const selectedSidebarSubject = selectedApiSubject
    ? mapApiSubjectToSidebarSubject(
        selectedApiSubject,
        apiSubjects.findIndex((subject) => subject.id === selectedApiSubject.id),
        sidebarModules,
      )
    : selectedMockSubject
  const selectedModule = selectedMockSubject.modules.find(
    (module) => module.id === mockNotebook.selectedModuleId,
  ) ?? selectedMockSubject.modules[0]
  const selectedNote =
    selectedModule.notes.find((note) => note.id === mockNotebook.selectedNoteId) ??
    selectedModule.notes[0]
  const selectedPage =
    selectedNote.pages.find((page) => page.pageNumber === selectedNote.activePageNumber) ??
    selectedNote.pages[0]
  const displaySubjectTitle = selectedApiSubject?.name ?? selectedMockSubject.title
  const displayModuleTitle = selectedApiModule?.title ?? selectedModule.title
  const displayNoteTitle = selectedApiNote?.title ?? selectedNote.title
  const displaySaveStatus = selectedApiNote ? 'Páginas/editor: local' : selectedNote.saveStatus
  const sidebarSubjects =
    subjectsStatus === 'success'
      ? apiSubjects.map((subject, index) =>
          mapApiSubjectToSidebarSubject(
            subject,
            index,
            subject.id === selectedApiSubject?.id ? sidebarModules : [],
          ),
        )
      : mockNotebook.subjects
  const selectedSidebarModuleId = selectedApiSubject
    ? selectedApiModule?.id ?? ''
    : mockNotebook.selectedModuleId
  const selectedSidebarNoteId = selectedApiNote
    ? selectedApiNote.id
    : mockNotebook.selectedNoteId

  useEffect(() => {
    if (subjectsStatus !== 'success') {
      return
    }

    if (apiSubjects.length === 0) {
      setSelectedApiSubjectId(null)
      setSelectedApiModuleId(null)
      setSelectedApiNoteId(null)
      return
    }

    setSelectedApiSubjectId((currentSubjectId) =>
      apiSubjects.some((subject) => subject.id === currentSubjectId)
        ? currentSubjectId
        : apiSubjects[0].id,
    )
  }, [apiSubjects, subjectsStatus])

  useEffect(() => {
    if (modulesStatus !== 'success') {
      return
    }

    if (apiModules.length === 0) {
      setSelectedApiModuleId(null)
      setSelectedApiNoteId(null)
      return
    }

    setSelectedApiModuleId((currentModuleId) =>
      apiModules.some((module) => module.id === currentModuleId)
        ? currentModuleId
        : apiModules[0].id,
    )
  }, [apiModules, modulesStatus])

  useEffect(() => {
    if (notesStatus !== 'success') {
      return
    }

    if (apiNotes.length === 0) {
      setSelectedApiNoteId(null)
      return
    }

    setSelectedApiNoteId((currentNoteId) =>
      apiNotes.some((note) => note.id === currentNoteId)
        ? currentNoteId
        : apiNotes[0].id,
    )
  }, [apiNotes, notesStatus])

  const handleSelectSubject = (subjectId: string) => {
    if (!hasApiSubjects) {
      return
    }

    setSelectedApiSubjectId(subjectId)
    setSelectedApiModuleId(null)
    setSelectedApiNoteId(null)
  }

  const handleSelectModule = (moduleId: string) => {
    if (!selectedApiSubject) {
      return
    }

    setSelectedApiModuleId(moduleId)
    setSelectedApiNoteId(null)
  }

  const handleSelectNote = (noteId: string) => {
    if (!selectedApiModule) {
      return
    }

    setSelectedApiNoteId(noteId)
  }

  return (
    <div className="app-layout">
      <a className="skip-link" href="#note-content">
        Ir para a anotação
      </a>

      <Sidebar
        ownerName={mockNotebook.ownerName}
        workspaceName={mockNotebook.workspaceName}
        apiError={subjectsError}
        apiStatus={getSidebarApiStatus(subjectsStatus)}
        canSelectModules={Boolean(selectedApiSubject)}
        canSelectNotes={Boolean(selectedApiModule)}
        canSelectSubjects={hasApiSubjects}
        moduleApiError={modulesError}
        moduleApiStatus={getModulesApiStatus(modulesStatus, Boolean(selectedApiSubject))}
        noteApiError={notesError}
        noteApiStatus={getNotesApiStatus(notesStatus, Boolean(selectedApiModule))}
        onSelectModule={handleSelectModule}
        onSelectNote={handleSelectNote}
        onSelectSubject={handleSelectSubject}
        selectedSubject={selectedSidebarSubject}
        selectedModuleId={selectedSidebarModuleId}
        selectedNoteId={selectedSidebarNoteId}
        showPagesLocalNotice={Boolean(selectedApiNote)}
        subjects={sidebarSubjects}
      />

      <div className="app-workspace">
        <Topbar
          noteTitle={displayNoteTitle}
          subjectTitle={displaySubjectTitle}
          saveStatus={displaySaveStatus}
        />

        <main className="note-workspace" id="note-content">
          <header className="note-heading">
            <div>
              <p className="note-path">
                {displaySubjectTitle}
                <span aria-hidden="true">/</span>
                {displayModuleTitle}
              </p>
              <h1>{displayNoteTitle}</h1>
              {selectedApiNote && (
                <p className="local-pages-notice">
                  Páginas ainda locais — integração de conteúdo será feita em etapa futura.
                </p>
              )}
              <TagList tags={selectedNote.tags} />
            </div>
            {!selectedApiNote && selectedNote.isFavorite && (
              <span className="favorite-badge" aria-label="Anotação favorita">
                <span aria-hidden="true">★</span>
                Favorita
              </span>
            )}
          </header>

          <A4EditorWorkspace pages={selectedNote.pages} activePage={selectedPage} />
        </main>
      </div>
    </div>
  )
}

export default App
