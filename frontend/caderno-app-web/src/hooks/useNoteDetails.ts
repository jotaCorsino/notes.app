import { useCallback, useEffect, useState } from 'react'
import { getNoteById, type ApiNoteDetails } from '../services/notesApi'

export type NoteDetailsStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseNoteDetailsResult {
  note: ApiNoteDetails | null
  status: NoteDetailsStatus
  error: string | null
  isLoading: boolean
  refetch: () => void
  updateNote: (updater: (note: ApiNoteDetails) => ApiNoteDetails) => void
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unable to load note details'

export function useNoteDetails(noteId: string | null): UseNoteDetailsResult {
  const [note, setNote] = useState<ApiNoteDetails | null>(null)
  const [status, setStatus] = useState<NoteDetailsStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const loadNote = useCallback(
    async (signal?: AbortSignal) => {
      if (!noteId) {
        setNote(null)
        setStatus('idle')
        setError(null)
        return
      }

      setNote(null)
      setStatus('loading')
      setError(null)

      try {
        const nextNote = await getNoteById(noteId, signal)

        if (signal?.aborted) {
          return
        }

        setNote(nextNote)
        setStatus('success')
      } catch (loadError) {
        if (signal?.aborted) {
          return
        }

        setNote(null)
        setError(getErrorMessage(loadError))
        setStatus('error')
      }
    },
    [noteId],
  )

  useEffect(() => {
    const controller = new AbortController()

    void loadNote(controller.signal)

    return () => {
      controller.abort()
    }
  }, [loadNote])

  const refetch = useCallback(() => {
    void loadNote()
  }, [loadNote])

  const updateNote = useCallback((updater: (note: ApiNoteDetails) => ApiNoteDetails) => {
    setNote((currentNote) => currentNote ? updater(currentNote) : currentNote)
  }, [])

  return {
    note,
    status,
    error,
    isLoading: status === 'loading',
    refetch,
    updateNote,
  }
}
