import './App.css'
import { A4EditorWorkspace } from './components/A4EditorWorkspace'
import { Sidebar, type SidebarApiStatus } from './components/Sidebar'
import { TagList } from './components/TagList'
import { Topbar } from './components/Topbar'
import { mockNotebook } from './data/mockNotebook'
import { useSubjects, type SubjectsStatus } from './hooks/useSubjects'
import type { ApiSubject } from './services/subjectsApi'
import type { Subject } from './types/notebook'

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

const mapApiSubjectToSidebarSubject = (subject: ApiSubject, index: number): Subject => ({
  id: subject.id,
  title: subject.name,
  shortLabel: createShortLabel(subject.name),
  color: normalizeSubjectColor(subject.color, index),
  modules: [],
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

function App() {
  const {
    subjects: apiSubjects,
    status: subjectsStatus,
    error: subjectsError,
  } = useSubjects()
  const selectedSubject = mockNotebook.subjects.find(
    (subject) => subject.id === mockNotebook.selectedSubjectId,
  ) ?? mockNotebook.subjects[0]
  const selectedModule = selectedSubject.modules.find(
    (module) => module.id === mockNotebook.selectedModuleId,
  ) ?? selectedSubject.modules[0]
  const selectedNote =
    selectedModule.notes.find((note) => note.id === mockNotebook.selectedNoteId) ??
    selectedModule.notes[0]
  const selectedPage =
    selectedNote.pages.find((page) => page.pageNumber === selectedNote.activePageNumber) ??
    selectedNote.pages[0]
  const sidebarSubjects =
    subjectsStatus === 'success'
      ? apiSubjects.map(mapApiSubjectToSidebarSubject)
      : mockNotebook.subjects

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
        selectedSubject={selectedSubject}
        selectedModuleId={mockNotebook.selectedModuleId}
        selectedNoteId={mockNotebook.selectedNoteId}
        subjects={sidebarSubjects}
      />

      <div className="app-workspace">
        <Topbar
          noteTitle={selectedNote.title}
          subjectTitle={selectedSubject.title}
          saveStatus={selectedNote.saveStatus}
        />

        <main className="note-workspace" id="note-content">
          <header className="note-heading">
            <div>
              <p className="note-path">
                {selectedSubject.title}
                <span aria-hidden="true">/</span>
                {selectedModule.title}
              </p>
              <h1>{selectedNote.title}</h1>
              <TagList tags={selectedNote.tags} />
            </div>
            {selectedNote.isFavorite && (
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
