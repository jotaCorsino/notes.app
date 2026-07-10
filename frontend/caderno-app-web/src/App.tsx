import './App.css'
import { A4PreviewPage } from './components/A4PreviewPage'
import { Sidebar } from './components/Sidebar'
import { TagList } from './components/TagList'
import { Topbar } from './components/Topbar'
import { mockNotebook } from './data/mockNotebook'

function App() {
  const selectedSubject = mockNotebook.subjects.find(
    (subject) => subject.id === mockNotebook.selectedSubjectId,
  ) ?? mockNotebook.subjects[0]
  const selectedModule = selectedSubject.modules.find(
    (module) => module.id === mockNotebook.selectedModuleId,
  ) ?? selectedSubject.modules[0]
  const selectedNote =
    selectedModule.notes.find((note) => note.id === mockNotebook.selectedNoteId) ??
    selectedModule.notes[0]

  return (
    <div className="app-layout">
      <a className="skip-link" href="#note-content">
        Ir para a anotação
      </a>

      <Sidebar
        ownerName={mockNotebook.ownerName}
        workspaceName={mockNotebook.workspaceName}
        subjects={mockNotebook.subjects}
        selectedSubject={selectedSubject}
        selectedModuleId={mockNotebook.selectedModuleId}
        selectedNoteId={mockNotebook.selectedNoteId}
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

          <section className="page-stage" aria-label="Pré-visualização da página A4">
            <div className="page-stage__label">
              <span>Página 1 de 1</span>
              <span>A4 · visualização</span>
            </div>
            <A4PreviewPage content={selectedNote.page} />
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
