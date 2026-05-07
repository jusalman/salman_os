import { useEffect, useState } from 'react'
import type { ClientRecord } from '../types'
import { clientDetailRepository } from '../data/repositories/currentRepositories'
import { getLoadErrorMessage } from './errors'

export type UseSelectedClientParams = {
  selectedClientId: string
  fallbackClientId: string
}

export type UseSelectedClientResult = {
  selectedClient: ClientRecord | null
  resolvedClientId: string
  loading: boolean
  error: string
  reload: () => Promise<void>
}

export function useSelectedClient({
  selectedClientId,
  fallbackClientId,
}: UseSelectedClientParams): UseSelectedClientResult {
  const resolvedClientId = selectedClientId || fallbackClientId
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function reload() {
    if (!resolvedClientId) {
      setSelectedClient(null)
      setError('')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const nextClient = await clientDetailRepository.getClientDetail(resolvedClientId)

      if (!nextClient) {
        setSelectedClient(null)
        setError('Selected client could not be found.')
        return
      }

      setSelectedClient(nextClient)
    } catch (loadError) {
      setSelectedClient(null)
      setError(getLoadErrorMessage(loadError, 'Failed to load selected client details.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    async function loadSelectedClient() {
      if (!resolvedClientId) {
        if (isActive) {
          setSelectedClient(null)
          setError('')
          setLoading(false)
        }
        return
      }

      if (isActive) {
        setLoading(true)
        setError('')
      }

      try {
        const nextClient = await clientDetailRepository.getClientDetail(resolvedClientId)

        if (!isActive) {
          return
        }

        if (!nextClient) {
          setSelectedClient(null)
          setError('Selected client could not be found.')
          return
        }

        setSelectedClient(nextClient)
      } catch (loadError) {
        if (!isActive) {
          return
        }

        setSelectedClient(null)
        setError(getLoadErrorMessage(loadError, 'Failed to load selected client details.'))
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadSelectedClient()

    return () => {
      isActive = false
    }
  }, [resolvedClientId])

  return {
    selectedClient,
    resolvedClientId,
    loading,
    error,
    reload,
  }
}
