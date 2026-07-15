import './App.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { A4EditorWorkspace, type EditorPageSourceStatus } from './components/A4EditorWorkspace'
import {
  Sidebar,
  type SidebarApiStatus,
  type SidebarModuleApiStatus,
  type SidebarNoteApiStatus,
  type SidebarOnboardingStep,
} from './components/Sidebar'
import { TagList } from './components/TagList'
import { Topbar } from './components/Topbar'
import { mockNotebook } from './data/mockNotebook'
import { useNoteDetails, type NoteDetailsStatus } from './hooks/useNoteDetails'
import { useNotes, type NotesStatus } from './hooks/useNotes'
import { useStudyModules, type StudyModulesStatus } from './hooks/useStudyModules'
import { useSubjects, type SubjectsStatus } from './hooks/useSubjects'
import { createStudyModule } from './services/modulesApi'
import {
  addTagToNote,
  createNote,
  markNoteAsFavorite,
  removeTagFromNote,
  unmarkNoteAsFavorite,
  type ApiNotePage,
  type ApiNoteSummary,
} from './services/notesApi'
import { createSubject, type ApiStudyModule, type ApiSubject } from './services/subjectsApi'
import type { NotebookNote, NotebookPage, NotePageContent, StudyModule, Subject } from './types/notebook'
import { MOCK_DRAFT_NOTE_ID } from './utils/localDraftStorage'

type SubjectColor = Subject['color']
type FavoriteUpdateStatus = 'idle' | 'saving' | 'saved' | 'removed' | 'error'
type MetadataMode = 'api' | 'error' | 'loading' | 'mock'
type TagUpdateStatus = 'idle' | 'adding' | 'added' | 'removing' | 'removed' | 'error'

const defaultTagColor = '#EEF2FF'
const subjectColors: SubjectColor[] = ['sage', 'coral', 'blue']
const emptyApiSidebarSubject: Subject = {
  id: '',
  title: 'Nenhuma matéria selecionada',
  shortLabel: '--',
  color: 'sage',
  modules: [],
}
const workspaceOnboardingCopy: Record<
  SidebarOnboardingStep,
  { detail: string; eyebrow: string; title: string }
> = {
  demo: {
    eyebrow: 'Modo demonstração',
    title: 'API indisponível — rodando em modo demonstração',
    detail: 'Ligue o backend para criar e salvar dados reais.',
  },
  module: {
    eyebrow: 'Fluxo inicial',
    title: 'Agora crie um módulo',
    detail: 'Use a sidebar para continuar. O conteúdo abaixo permanece como demonstração.',
  },
  note: {
    eyebrow: 'Fluxo inicial',
    title: 'Agora crie uma anotação',
    detail: 'Use a sidebar para continuar. O conteúdo abaixo permanece como demonstração.',
  },
  subject: {
    eyebrow: 'Fluxo inicial',
    title: 'Crie sua primeira matéria',
    detail: 'Use a sidebar para começar. O conteúdo abaixo permanece como demonstração.',
  },
}

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

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback

const getFavoriteStatusMessage = (
  status: FavoriteUpdateStatus,
  mode: MetadataMode,
  isFavorite: boolean,
  error: string | null,
) => {
  if (error) {
    return 'Erro ao atualizar favorito'
  }

  if (status === 'saving') {
    return isFavorite ? 'Removendo favorito...' : 'Favoritando...'
  }

  if (status === 'saved') {
    return 'Favorito salvo'
  }

  if (status === 'removed') {
    return 'Favorito removido'
  }

  if (mode === 'api') {
    return 'Favorito real carregado da API'
  }

  if (mode === 'loading') {
    return 'Carregando favorito real...'
  }

  return 'Favorito mockado em fallback'
}

const getTagStatusMessage = (status: TagUpdateStatus, mode: MetadataMode, error: string | null) => {
  if (error) {
    return 'Erro ao atualizar tags'
  }

  if (status === 'adding') {
    return 'Adicionando tag...'
  }

  if (status === 'added') {
    return 'Tag adicionada'
  }

  if (status === 'removing') {
    return 'Removendo tag...'
  }

  if (status === 'removed') {
    return 'Tag removida'
  }

  if (mode === 'api') {
    return 'Tags reais carregadas da API'
  }

  if (mode === 'loading') {
    return 'Carregando tags reais...'
  }

  return 'Tags mockadas em fallback'
}

const createPageContent = (
  noteTitle: string,
  pageNumber: number,
  title: string,
  introduction: string,
): NotePageContent => ({
  eyebrow: noteTitle,
  title,
  subtitle: `Página ${pageNumber} · editor A4`,
  introduction,
  highlight: 'As alterações desta página ainda são salvas apenas no navegador.',
  sectionTitle: 'Conteúdo',
  sectionBody: 'Use o editor para continuar o rascunho local desta anotação.',
  layers: [],
  takeawayTitle: 'Persistência',
  takeawayBody: 'O backend ainda não recebe alterações de conteúdo nesta etapa.',
  nextStudy: 'Próximo passo: implementar salvamento real do conteúdo da página via API.',
})

const createFallbackEditorPage = (
  noteId: string,
  noteTitle: string,
  status: EditorPageSourceStatus,
  title: string,
  introduction: string,
): NotebookPage => ({
  id: `${noteId}-${status}-local-page`,
  pageNumber: 1,
  widthMm: 210,
  heightMm: 297,
  contentFormat: 'html',
  content: createPageContent(noteTitle, 1, title, introduction),
  contentHtml: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(introduction)}</p>`,
  source: 'local',
})

const mapApiPageToNotebookPage = (noteTitle: string, page: ApiNotePage): NotebookPage => {
  const pageNumber = Number(page.pageNumber) || 1
  const content = page.content?.trim()
  const isHtml = page.contentFormat?.toLowerCase() === 'html'
  const contentHtml = content
    ? isHtml
      ? content
      : `<p>${escapeHtml(content)}</p>`
    : '<p></p>'

  return {
    id: page.id,
    pageNumber,
    widthMm: Number(page.widthMm) || 210,
    heightMm: Number(page.heightMm) || 297,
    contentFormat: 'html',
    content: createPageContent(
      noteTitle,
      pageNumber,
      `${noteTitle} · página ${pageNumber}`,
      'Página carregada da API para edição local no editor A4.',
    ),
    contentHtml,
    source: 'api',
  }
}

const mapApiNoteToSidebarNote = (note: ApiNoteSummary): NotebookNote => ({
  id: note.id,
  title: note.title,
  tags: note.tags,
  isFavorite: note.isFavorite,
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

const getEditorSaveStatus = (
  hasSelectedApiNote: boolean,
  noteDetailsStatus: NoteDetailsStatus,
  hasApiPages: boolean,
  mockSaveStatus: string,
) => {
  if (!hasSelectedApiNote) {
    return mockSaveStatus
  }

  if (noteDetailsStatus === 'loading' || noteDetailsStatus === 'idle') {
    return 'Carregando páginas'
  }

  if (noteDetailsStatus === 'error') {
    return 'Fallback local'
  }

  return hasApiPages ? 'Páginas da API · edição local' : 'Sem páginas reais · local'
}

function App() {
  const [selectedApiSubjectId, setSelectedApiSubjectId] = useState<string | null>(null)
  const [selectedApiModuleId, setSelectedApiModuleId] = useState<string | null>(null)
  const [selectedApiNoteId, setSelectedApiNoteId] = useState<string | null>(null)
  const [favoriteUpdateStatus, setFavoriteUpdateStatus] = useState<FavoriteUpdateStatus>('idle')
  const [favoriteUpdateError, setFavoriteUpdateError] = useState<string | null>(null)
  const [newTagColor, setNewTagColor] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [removingTagName, setRemovingTagName] = useState<string | null>(null)
  const [tagUpdateStatus, setTagUpdateStatus] = useState<TagUpdateStatus>('idle')
  const [tagUpdateError, setTagUpdateError] = useState<string | null>(null)
  const {
    subjects: apiSubjects,
    status: subjectsStatus,
    error: subjectsError,
    refetch: refetchSubjects,
  } = useSubjects()
  const hasApiSubjects = subjectsStatus === 'success' && apiSubjects.length > 0
  const selectedApiSubject = hasApiSubjects
    ? apiSubjects.find((subject) => subject.id === selectedApiSubjectId) ?? apiSubjects[0]
    : null
  const {
    modules: apiModules,
    status: modulesStatus,
    error: modulesError,
    refetch: refetchModules,
  } = useStudyModules(selectedApiSubject?.id ?? null)
  const hasApiModules = modulesStatus === 'success' && apiModules.length > 0
  const selectedApiModule = hasApiModules
    ? apiModules.find((module) => module.id === selectedApiModuleId) ?? apiModules[0]
    : null
  const {
    notes: apiNotes,
    status: notesStatus,
    error: notesError,
    refetch: refetchNotes,
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
  const {
    note: selectedApiNoteDetails,
    status: noteDetailsStatus,
    error: noteDetailsError,
    updateNote,
  } = useNoteDetails(selectedApiNote?.id ?? null)
  const activeApiNoteDetails =
    selectedApiNoteDetails?.id === selectedApiNote?.id ? selectedApiNoteDetails : null
  const activeNoteDetailsStatus: NoteDetailsStatus =
    selectedApiNote && noteDetailsStatus === 'success' && !activeApiNoteDetails
      ? 'loading'
      : noteDetailsStatus
  const activeApiNotePages = activeApiNoteDetails?.pages
  const selectedMockSubject = mockNotebook.subjects.find(
    (subject) => subject.id === mockNotebook.selectedSubjectId,
  ) ?? mockNotebook.subjects[0]
  const selectedSidebarSubject = selectedApiSubject
    ? mapApiSubjectToSidebarSubject(
        selectedApiSubject,
        apiSubjects.findIndex((subject) => subject.id === selectedApiSubject.id),
        sidebarModules,
      )
    : subjectsStatus === 'success'
      ? emptyApiSidebarSubject
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
  const apiNoteTitle = activeApiNoteDetails?.title ?? selectedApiNote?.title
  const hasApiPages = Boolean(activeApiNotePages?.length)
  const displaySubjectTitle = selectedApiSubject?.name ?? selectedMockSubject.title
  const displayModuleTitle = selectedApiModule?.title ?? selectedModule.title
  const displayNoteTitle = apiNoteTitle ?? selectedNote.title
  const displaySaveStatus = getEditorSaveStatus(
    Boolean(selectedApiNote),
    activeNoteDetailsStatus,
    hasApiPages,
    selectedNote.saveStatus,
  )
  const metadataMode: MetadataMode = selectedApiNote
    ? activeNoteDetailsStatus === 'success' && activeApiNoteDetails
      ? 'api'
      : activeNoteDetailsStatus === 'error'
        ? 'error'
        : 'loading'
    : 'mock'
  const canUseRealNoteMetadata = metadataMode === 'api' && Boolean(activeApiNoteDetails)
  const displayIsFavorite = canUseRealNoteMetadata
    ? Boolean(activeApiNoteDetails?.isFavorite)
    : selectedNote.isFavorite
  const displayTags = canUseRealNoteMetadata
    ? activeApiNoteDetails?.tags.map((tag) => ({
        color: tag.color,
        name: tag.name,
      })) ?? []
    : selectedNote.tags.map((tag) => ({
        color: null,
        name: tag,
      }))
  const metadataHelperText = metadataMode === 'api'
    ? 'Tags e favorito reais carregados da API.'
    : metadataMode === 'loading'
      ? 'Aguardando GET /api/notes/{id} para tags e favorito reais.'
      : metadataMode === 'error'
        ? 'Falha ao carregar metadados reais; tags e favorito ficam em fallback visual.'
        : 'Tags e favorito reais disponíveis apenas para anotações da API.'
  const favoriteStatusMessage = getFavoriteStatusMessage(
    favoriteUpdateStatus,
    metadataMode,
    displayIsFavorite,
    favoriteUpdateError,
  )
  const tagStatusMessage = getTagStatusMessage(tagUpdateStatus, metadataMode, tagUpdateError)
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
  const selectedSidebarModuleId =
    subjectsStatus === 'success'
      ? selectedApiModule?.id ?? ''
      : mockNotebook.selectedModuleId
  const selectedSidebarNoteId =
    subjectsStatus === 'success'
      ? selectedApiNote?.id ?? ''
      : mockNotebook.selectedNoteId
  const sidebarOnboardingStep: SidebarOnboardingStep | null =
    subjectsStatus === 'error'
      ? 'demo'
      : subjectsStatus === 'success' && apiSubjects.length === 0
        ? 'subject'
        : modulesStatus === 'success' && apiModules.length === 0
          ? 'module'
          : notesStatus === 'success' && apiNotes.length === 0
            ? 'note'
            : null
  const activeWorkspaceOnboarding = sidebarOnboardingStep
    ? workspaceOnboardingCopy[sidebarOnboardingStep]
    : null
  const editorState = useMemo(() => {
    if (!selectedApiNote) {
      return {
        activePage: selectedPage,
        draftNoteId: MOCK_DRAFT_NOTE_ID,
        pageSourceStatus: 'mock' as EditorPageSourceStatus,
        pages: selectedNote.pages,
      }
    }

    const noteId = selectedApiNote.id
    const noteTitle = apiNoteTitle ?? 'Anotação'

    if (activeNoteDetailsStatus === 'success' && activeApiNotePages?.length) {
      const apiPages = activeApiNotePages
        .slice()
        .sort((firstPage, secondPage) => firstPage.orderIndex - secondPage.orderIndex)
        .map((page) => mapApiPageToNotebookPage(noteTitle, page))

      return {
        activePage: apiPages[0],
        draftNoteId: noteId,
        pageSourceStatus: 'api' as EditorPageSourceStatus,
        pages: apiPages,
      }
    }

    if (activeNoteDetailsStatus === 'error') {
      const fallbackPage = createFallbackEditorPage(
        noteId,
        noteTitle,
        'error',
        'Erro ao carregar páginas',
        'Não foi possível carregar páginas reais agora. O editor continua disponível localmente.',
      )

      return {
        activePage: fallbackPage,
        draftNoteId: noteId,
        pageSourceStatus: 'error' as EditorPageSourceStatus,
        pages: [fallbackPage],
      }
    }

    if (activeNoteDetailsStatus === 'success') {
      const emptyPage = createFallbackEditorPage(
        noteId,
        noteTitle,
        'empty',
        'Sem páginas reais cadastradas',
        'Esta anotação ainda não possui páginas reais na API. Use esta página local inicial para rascunho.',
      )

      return {
        activePage: emptyPage,
        draftNoteId: noteId,
        pageSourceStatus: 'empty' as EditorPageSourceStatus,
        pages: [emptyPage],
      }
    }

    const loadingPage = createFallbackEditorPage(
      noteId,
      noteTitle,
      'loading',
      'Carregando páginas da API',
      'Aguarde enquanto o frontend busca os detalhes desta anotação.',
    )

    return {
      activePage: loadingPage,
      draftNoteId: noteId,
      pageSourceStatus: 'loading' as EditorPageSourceStatus,
      pages: [loadingPage],
    }
  }, [activeApiNotePages, activeNoteDetailsStatus, apiNoteTitle, selectedApiNote, selectedNote.pages, selectedPage])

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

  useEffect(() => {
    setFavoriteUpdateError(null)
    setFavoriteUpdateStatus('idle')
    setNewTagColor('')
    setNewTagName('')
    setRemovingTagName(null)
    setTagUpdateError(null)
    setTagUpdateStatus('idle')
  }, [selectedApiNote?.id])

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

  const handleCreateSubject = useCallback(
    async (name: string) => {
      if (subjectsStatus !== 'success') {
        throw new Error('A criação de matéria exige conexão com a API.')
      }

      const createdSubject = await createSubject({ name: name.trim() })

      setSelectedApiSubjectId(createdSubject.id)
      setSelectedApiModuleId(null)
      setSelectedApiNoteId(null)
      refetchSubjects()
    },
    [refetchSubjects, subjectsStatus],
  )

  const handleCreateModule = useCallback(
    async (title: string) => {
      if (!selectedApiSubject || modulesStatus !== 'success') {
        throw new Error('Selecione uma matéria real antes de criar o módulo.')
      }

      const nextOrderIndex = apiModules.reduce(
        (highestOrderIndex, module) => Math.max(highestOrderIndex, module.orderIndex),
        -1,
      ) + 1
      const createdModule = await createStudyModule(selectedApiSubject.id, {
        title: title.trim(),
        orderIndex: nextOrderIndex,
      })

      setSelectedApiModuleId(createdModule.id)
      setSelectedApiNoteId(null)
      refetchModules()
    },
    [apiModules, modulesStatus, refetchModules, selectedApiSubject],
  )

  const handleCreateNote = useCallback(
    async (title: string) => {
      if (!selectedApiModule || notesStatus !== 'success') {
        throw new Error('Selecione um módulo real antes de criar a anotação.')
      }

      const createdNote = await createNote(selectedApiModule.id, { title: title.trim() })

      setSelectedApiNoteId(createdNote.id)
      refetchNotes()
    },
    [notesStatus, refetchNotes, selectedApiModule],
  )

  const handleToggleFavorite = useCallback(async () => {
    if (!activeApiNoteDetails || metadataMode !== 'api') {
      return
    }

    const shouldMarkAsFavorite = !activeApiNoteDetails.isFavorite

    setFavoriteUpdateError(null)
    setFavoriteUpdateStatus('saving')

    try {
      const updatedNote = shouldMarkAsFavorite
        ? await markNoteAsFavorite(activeApiNoteDetails.id)
        : await unmarkNoteAsFavorite(activeApiNoteDetails.id)

      updateNote((currentNote) =>
        currentNote.id === activeApiNoteDetails.id
          ? {
              ...currentNote,
              isFavorite: updatedNote.isFavorite,
              updatedAt: updatedNote.updatedAt,
            }
          : currentNote,
      )
      setFavoriteUpdateStatus(updatedNote.isFavorite ? 'saved' : 'removed')
    } catch (favoriteError) {
      setFavoriteUpdateError(
        getErrorMessage(favoriteError, 'Não foi possível atualizar o favorito.'),
      )
      setFavoriteUpdateStatus('error')
    }
  }, [activeApiNoteDetails, metadataMode, updateNote])

  const handleAddTag = useCallback(async () => {
    if (!activeApiNoteDetails || metadataMode !== 'api') {
      return
    }

    const trimmedName = newTagName.trim()

    if (!trimmedName) {
      setTagUpdateError('Informe o nome da tag.')
      setTagUpdateStatus('error')
      return
    }

    const trimmedColor = newTagColor.trim()

    setTagUpdateError(null)
    setTagUpdateStatus('adding')

    try {
      const createdTag = await addTagToNote(
        activeApiNoteDetails.id,
        trimmedName,
        trimmedColor || defaultTagColor,
      )

      updateNote((currentNote) =>
        currentNote.id === activeApiNoteDetails.id
          ? {
              ...currentNote,
              tags: [
                ...currentNote.tags.filter(
                  (tag) => tag.name.toLowerCase() !== createdTag.name.toLowerCase(),
                ),
                createdTag,
              ],
              updatedAt: createdTag.updatedAt,
            }
          : currentNote,
      )
      setNewTagColor('')
      setNewTagName('')
      setTagUpdateStatus('added')
    } catch (tagError) {
      setTagUpdateError(getErrorMessage(tagError, 'Não foi possível adicionar a tag.'))
      setTagUpdateStatus('error')
    }
  }, [activeApiNoteDetails, metadataMode, newTagColor, newTagName, updateNote])

  const handleRemoveTag = useCallback(async (tagName: string) => {
    if (!activeApiNoteDetails || metadataMode !== 'api') {
      return
    }

    setRemovingTagName(tagName)
    setTagUpdateError(null)
    setTagUpdateStatus('removing')

    try {
      const updatedNote = await removeTagFromNote(activeApiNoteDetails.id, tagName)

      updateNote((currentNote) =>
        currentNote.id === activeApiNoteDetails.id
          ? {
              ...currentNote,
              isFavorite: updatedNote.isFavorite,
              tags: updatedNote.tags,
              updatedAt: updatedNote.updatedAt,
            }
          : currentNote,
      )
      setTagUpdateStatus('removed')
    } catch (tagError) {
      setTagUpdateError(getErrorMessage(tagError, 'Não foi possível remover a tag.'))
      setTagUpdateStatus('error')
    } finally {
      setRemovingTagName(null)
    }
  }, [activeApiNoteDetails, metadataMode, updateNote])

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
        canCreateModule={Boolean(selectedApiSubject) && modulesStatus === 'success'}
        canCreateNote={Boolean(selectedApiModule) && notesStatus === 'success'}
        canCreateSubject={subjectsStatus === 'success'}
        canSelectModules={Boolean(selectedApiSubject)}
        canSelectNotes={Boolean(selectedApiModule)}
        canSelectSubjects={hasApiSubjects}
        moduleApiError={modulesError}
        moduleApiStatus={getModulesApiStatus(modulesStatus, Boolean(selectedApiSubject))}
        noteApiError={notesError ?? noteDetailsError}
        noteApiStatus={getNotesApiStatus(notesStatus, Boolean(selectedApiModule))}
        onboardingStep={sidebarOnboardingStep}
        onCreateModule={handleCreateModule}
        onCreateNote={handleCreateNote}
        onCreateSubject={handleCreateSubject}
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
          {activeWorkspaceOnboarding && (
            <section
              className={`workspace-onboarding${sidebarOnboardingStep === 'demo' ? ' workspace-onboarding--demo' : ''}`}
              aria-label="Orientação do fluxo inicial"
            >
              <span>{activeWorkspaceOnboarding.eyebrow}</span>
              <div>
                <strong>{activeWorkspaceOnboarding.title}</strong>
                <p>{activeWorkspaceOnboarding.detail}</p>
              </div>
            </section>
          )}
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
                  Páginas reais podem ser salvas manualmente; páginas locais seguem como rascunho.
                </p>
              )}
              <TagList
                canEdit={canUseRealNoteMetadata}
                colorValue={newTagColor}
                errorMessage={tagUpdateError}
                helperText={metadataHelperText}
                isAdding={tagUpdateStatus === 'adding'}
                nameValue={newTagName}
                onAddTag={handleAddTag}
                onColorChange={setNewTagColor}
                onNameChange={setNewTagName}
                onRemoveTag={handleRemoveTag}
                removingTagName={removingTagName}
                statusMessage={tagStatusMessage}
                tags={displayTags}
              />
            </div>
            <div
              className={`favorite-card${displayIsFavorite ? ' favorite-card--active' : ''}`}
              aria-live="polite"
            >
              <button
                className="favorite-badge"
                type="button"
                disabled={!canUseRealNoteMetadata || favoriteUpdateStatus === 'saving'}
                onClick={handleToggleFavorite}
              >
                <span aria-hidden="true">{displayIsFavorite ? '★' : '☆'}</span>
                {displayIsFavorite ? 'Favorita' : 'Favoritar'}
              </button>
              <span>{favoriteStatusMessage}</span>
              {favoriteUpdateError && <strong>{favoriteUpdateError}</strong>}
            </div>
          </header>

          <A4EditorWorkspace
            activePage={editorState.activePage}
            draftNoteId={editorState.draftNoteId}
            pageSourceStatus={editorState.pageSourceStatus}
            pages={editorState.pages}
          />
        </main>
      </div>
    </div>
  )
}

export default App
