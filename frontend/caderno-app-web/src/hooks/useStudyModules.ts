import { useCallback, useEffect, useState } from 'react'
import { getModulesBySubject } from '../services/modulesApi'
import type { ApiStudyModule } from '../services/subjectsApi'

export type StudyModulesStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseStudyModulesResult {
  modules: ApiStudyModule[]
  status: StudyModulesStatus
  error: string | null
  isLoading: boolean
  refetch: () => void
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unable to load study modules'

export function useStudyModules(subjectId: string | null): UseStudyModulesResult {
  const [modules, setModules] = useState<ApiStudyModule[]>([])
  const [status, setStatus] = useState<StudyModulesStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const loadModules = useCallback(
    async (signal?: AbortSignal) => {
      if (!subjectId) {
        setModules([])
        setStatus('idle')
        setError(null)
        return
      }

      setModules([])
      setStatus('loading')
      setError(null)

      try {
        const nextModules = await getModulesBySubject(subjectId, signal)

        if (signal?.aborted) {
          return
        }

        setModules(nextModules)
        setStatus('success')
      } catch (loadError) {
        if (signal?.aborted) {
          return
        }

        setModules([])
        setError(getErrorMessage(loadError))
        setStatus('error')
      }
    },
    [subjectId],
  )

  useEffect(() => {
    const controller = new AbortController()

    void loadModules(controller.signal)

    return () => {
      controller.abort()
    }
  }, [loadModules])

  const refetch = useCallback(() => {
    void loadModules()
  }, [loadModules])

  return {
    modules,
    status,
    error,
    isLoading: status === 'loading',
    refetch,
  }
}
