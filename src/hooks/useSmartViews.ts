import { useEffect, useState } from 'react'
import type { SmartViews } from '../domain/smartViews'
import { smartOperationViewsRepository } from '../data/repositories/currentRepositories'

export type UseSmartViewsResult = {
  smartViews: SmartViews | null
  loading: boolean
  error: string
  reload: () => Promise<void>
}

export function useSmartViews(): UseSmartViewsResult {
  const [smartViews, setSmartViews] = useState<SmartViews | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function reload() {
    setLoading(true)
    setError('')

    try {
      const nextSmartViews = await smartOperationViewsRepository.getSmartOperationViews()
      setSmartViews(nextSmartViews)
    } catch {
      setSmartViews(null)
      setError('Failed to load SALMAN OS smart operation views.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    async function loadInitialSmartViews() {
      try {
        const nextSmartViews = await smartOperationViewsRepository.getSmartOperationViews()

        if (!isActive) {
          return
        }

        setSmartViews(nextSmartViews)
        setError('')
      } catch {
        if (!isActive) {
          return
        }

        setSmartViews(null)
        setError('Failed to load SALMAN OS smart operation views.')
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadInitialSmartViews()

    return () => {
      isActive = false
    }
  }, [])

  return {
    smartViews,
    loading,
    error,
    reload,
  }
}
