import {
  clientDetailMockRepository,
  clientListMockRepository,
  smartOperationViewsMockRepository,
} from '../adapters/mock'
import {
  clientDetailSupabasePlaceholderRepository,
  clientListSupabasePlaceholderRepository,
  smartOperationViewsSupabasePlaceholderRepository,
} from '../adapters/supabase'
import type { ClientDetailRepository } from './clientDetailRepository'
import type { ClientListRepository } from './clientListRepository'
import type { SmartOperationViewsRepository } from './smartOperationViewsRepository'

type DataSource = 'mock' | 'supabase'

type RepositorySet = {
  clientListRepository: ClientListRepository
  clientDetailRepository: ClientDetailRepository
  smartOperationViewsRepository: SmartOperationViewsRepository
}

const mockRepositories: RepositorySet = {
  clientListRepository: clientListMockRepository,
  clientDetailRepository: clientDetailMockRepository,
  smartOperationViewsRepository: smartOperationViewsMockRepository,
}

const supabasePlaceholderRepositories: RepositorySet = {
  clientListRepository: clientListSupabasePlaceholderRepository,
  clientDetailRepository: clientDetailSupabasePlaceholderRepository,
  smartOperationViewsRepository: smartOperationViewsSupabasePlaceholderRepository,
}

function resolveDataSource(value: unknown): DataSource {
  if (value === 'supabase') {
    return 'supabase'
  }

  if (value === 'mock' || !value) {
    return 'mock'
  }

  // Invalid VITE_DATA_SOURCE values fall back to mock to keep SALMAN OS v1 local-safe.
  return 'mock'
}

function selectRepositories(dataSource: DataSource): RepositorySet {
  if (dataSource === 'supabase') {
    return supabasePlaceholderRepositories
  }

  return mockRepositories
}

const currentRepositories = selectRepositories(
  resolveDataSource(import.meta.env.VITE_DATA_SOURCE),
)

export const {
  clientListRepository,
  clientDetailRepository,
  smartOperationViewsRepository,
} = currentRepositories
