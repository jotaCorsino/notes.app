import { useCallback, useEffect, useState } from 'react'
import { getNotesByModule, type ApiNote } from '../services/notesApi'

export type NotesStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseNotesResult {
  notes: ApiNote[]
  status: NotesStatus
  error: string | null
  isLoading: boolean
  refetch: () => void
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unable to load notes'

export function useNotes(moduleId: string | null): UseNotesResult {
  const [notes, setNotes] = useState<ApiNote[]>([])
  const [status, setStatus] = useState<NotesStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const loadNotes = useCallback(
    async (signal?: AbortSignal) => {
      if (!moduleId) {
        setNotes([])
        setStatus('idle')
        setError(null)
        return
      }

      setNotes([])
      setStatus('loading')
      setError(null)

      try {
        const nextNotes = await getNotesByModule(moduleId, signal)

        if (signal?.aborted) {
          return
        }

        setNotes(nextNotes)
        setStatus('success')
      } catch (loadError) {
        if (signal?.aborted) {
          return
        }

        setNotes([])
        setError(getErrorMessage(loadError))
        setStatus('error')
      }
    },
    [moduleId],
  )

  useEffect(() => {
    const controller = new AbortController()

    void loadNotes(controller.signal)

    return () => {
      controller.abort()
    }
  }, [loadNotes])

  const refetch = useCallback(() => {
    void loadNotes()
  }, [loadNotes])

  return {
    notes,
    status,
    error,
    isLoading: status === 'loading',
    refetch,
  }
}
