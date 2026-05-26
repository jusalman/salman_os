import type { ClientDetailRepository } from './clientDetailRepository.ts'
import type { ClientListRepository } from './clientListRepository.ts'
import type { DriveFileRepository } from './driveFileRepository.ts'
import type { SmartOperationViewsRepository } from './smartOperationViewsRepository.ts'

export type DataSource = 'mock' | 'supabase'
export type SupabaseReadActivation = 'off' | 'client_list'

export type RepositorySet = {
  clientListRepository: ClientListRepository
  clientDetailRepository: ClientDetailRepository
  driveFileRepository: DriveFileRepository
  smartOperationViewsRepository: SmartOperationViewsRepository
}

export type RepositorySets = {
  mockRepositories: RepositorySet
  supabasePlaceholderRepositories: RepositorySet
  supabaseClientListRepositories: RepositorySet
}

export type RepositorySelectionInput = {
  dataSourceValue: unknown
  supabaseReadActivationValue: unknown
  hasSupabaseBrowserConfig: boolean
}

export function resolveDataSource(value: unknown): DataSource {
  if (value === 'supabase') {
    return 'supabase'
  }

  if (value === 'mock' || !value) {
    return 'mock'
  }

  // Invalid VITE_DATA_SOURCE values fall back to mock to keep SALMAN OS v1 local-safe.
  return 'mock'
}

export function resolveSupabaseReadActivation(value: unknown): SupabaseReadActivation {
  if (value === 'client_list') {
    return 'client_list'
  }

  return 'off'
}

export function selectRepositories(
  {
    dataSourceValue,
    supabaseReadActivationValue,
    hasSupabaseBrowserConfig,
  }: RepositorySelectionInput,
  repositorySets: RepositorySets,
): RepositorySet {
  const dataSource = resolveDataSource(dataSourceValue)

  if (dataSource === 'mock') {
    return repositorySets.mockRepositories
  }

  const supabaseReadActivation = resolveSupabaseReadActivation(supabaseReadActivationValue)

  if (supabaseReadActivation === 'client_list' && hasSupabaseBrowserConfig) {
    return repositorySets.supabaseClientListRepositories
  }

  return repositorySets.supabasePlaceholderRepositories
}
