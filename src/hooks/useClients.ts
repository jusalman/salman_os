import { useEffect, useState } from 'react'
import type { ClientSummary } from '../types'
import { clientListRepository } from '../data/repositories/currentRepositories'

export type UseClientsResult = {
  clients: ClientSummary[]
  loading: boolean
  error: string
  reload: () => Promise<void>
}

export function useClients(): UseClientsResult {
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function reload() {
    setLoading(true)
    setError('')

    try {
      const nextClients = await clientListRepository.listClientSummaries()
      setClients(nextClients)
    } catch {
      setClients([])
      setError('Failed to load SALMAN OS client data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    async function loadInitialClients() {
      try {
        const nextClients = await clientListRepository.listClientSummaries()

        if (!isActive) {
          return
        }

        setClients(nextClients)
        setError('')
      } catch {
        if (!isActive) {
          return
        }

        setClients([])
        setError('Failed to load SALMAN OS client data.')
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadInitialClients()

    return () => {
      isActive = false
    }
  }, [])

  return {
    clients,
    loading,
    error,
    reload,
  }
}
