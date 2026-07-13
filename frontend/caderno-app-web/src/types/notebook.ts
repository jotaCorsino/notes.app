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

export interface NotebookPage {
  id: string
  pageNumber: number
  widthMm: number
  heightMm: number
  contentFormat: 'html'
  content: NotePageContent
  contentHtml?: string
}

export interface NotebookNote {
  id: string
  title: string
  tags: string[]
  isFavorite: boolean
  saveStatus: string
  activePageNumber: number
  pages: NotebookPage[]
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
