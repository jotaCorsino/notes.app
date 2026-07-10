export interface NotePageContent {
  eyebrow: string
  title: string
  subtitle: string
  introduction: string
  highlight: string
  sectionTitle: string
  sectionBody: string
  layers: Array<{
    number: number
    name: string
    description: string
  }>
  takeawayTitle: string
  takeawayBody: string
  nextStudy: string
}

export interface NotebookNote {
  id: string
  title: string
  tags: string[]
  isFavorite: boolean
  saveStatus: string
  page: NotePageContent
}

export interface StudyModule {
  id: string
  title: string
  notes: NotebookNote[]
}

export interface Subject {
  id: string
  title: string
  shortLabel: string
  color: 'sage' | 'coral' | 'blue'
  modules: StudyModule[]
}

export interface Notebook {
  ownerName: string
  workspaceName: string
  selectedSubjectId: string
  selectedModuleId: string
  selectedNoteId: string
  subjects: Subject[]
}
