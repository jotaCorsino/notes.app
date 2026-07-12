import { useCallback, useEffect, useState } from 'react'
import { getSubjects, type ApiSubject } from '../services/subjectsApi'

export type SubjectsStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseSubjectsResult {
  subjects: ApiSubject[]
  status: SubjectsStatus
  error: string | null
  isLoading: boolean
  refetch: () => void
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unable to load subjects'

export function useSubjects(): UseSubjectsResult {
  const [subjects, setSubjects] = useState<ApiSubject[]>([])
  const [status, setStatus] = useState<SubjectsStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const loadSubjects = useCallback(async (signal?: AbortSignal) => {
    setStatus('loading')
    setError(null)

    try {
      const nextSubjects = await getSubjects(signal)

      if (signal?.aborted) {
        return
      }

      setSubjects(nextSubjects)
      setStatus('success')
    } catch (loadError) {
      if (signal?.aborted) {
        return
      }

      setSubjects([])
      setError(getErrorMessage(loadError))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    void loadSubjects(controller.signal)

    return () => {
      controller.abort()
    }
  }, [loadSubjects])

  const refetch = useCallback(() => {
    void loadSubjects()
  }, [loadSubjects])

  return {
    subjects,
    status,
    error,
    isLoading: status === 'loading',
    refetch,
  }
}
