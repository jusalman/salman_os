import { useEffect, useState } from 'react'
import { driveFileRepository } from '../data/repositories/currentRepositories'
import type { DriveFileRepositoryResult } from '../domain/driveFiles'
import { getLoadErrorMessage } from './errors'

export type UseClientDriveFilesResult = {
  driveFilesResult: DriveFileRepositoryResult | null
  loading: boolean
  error: string
  reload: () => Promise<void>
}

export function useClientDriveFiles(clientId: string): UseClientDriveFilesResult {
  const [driveFilesResult, setDriveFilesResult] = useState<DriveFileRepositoryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function reload() {
    if (!clientId) {
      setDriveFilesResult(null)
      setError('')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await driveFileRepository.listDriveFiles({ clientId })
      setDriveFilesResult(result)
    } catch (loadError) {
      setDriveFilesResult(null)
      setError(getLoadErrorMessage(loadError, 'Failed to load Drive file metadata.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    async function loadDriveFiles() {
      if (!clientId) {
        if (isActive) {
          setDriveFilesResult(null)
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
        const result = await driveFileRepository.listDriveFiles({ clientId })

        if (!isActive) {
          return
        }

        setDriveFilesResult(result)
      } catch (loadError) {
        if (!isActive) {
          return
        }

        setDriveFilesResult(null)
        setError(getLoadErrorMessage(loadError, 'Failed to load Drive file metadata.'))
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadDriveFiles()

    return () => {
      isActive = false
    }
  }, [clientId])

  return {
    driveFilesResult,
    loading,
    error,
    reload,
  }
}
