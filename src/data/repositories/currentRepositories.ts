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
import type { ClientListRepository } from './clientListRepository'
import { selectRepositories, type RepositorySet } from './repositorySelection'

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

const supabaseClientListRepositories: RepositorySet = {
  clientListRepository: createLazySupabaseClientListRepository(),
  clientDetailRepository: clientDetailSupabasePlaceholderRepository,
  smartOperationViewsRepository: smartOperationViewsSupabasePlaceholderRepository,
}

const currentRepositories = selectRepositories(
  {
    dataSourceValue: readFrontendEnv('VITE_DATA_SOURCE'),
    supabaseReadActivationValue: readFrontendEnv('VITE_SUPABASE_READ_ACTIVATION'),
    hasSupabaseBrowserConfig: hasFrontendSupabaseBrowserConfig(),
  },
  {
    mockRepositories,
    supabasePlaceholderRepositories,
    supabaseClientListRepositories,
  },
)

function readFrontendEnv(name: 'VITE_DATA_SOURCE' | 'VITE_SUPABASE_READ_ACTIVATION'): string {
  return import.meta.env[name]?.trim() ?? ''
}

function hasFrontendSupabaseBrowserConfig(): boolean {
  return (
    import.meta.env.VITE_SUPABASE_URL?.trim().length > 0 &&
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim().length > 0
  )
}

function createLazySupabaseClientListRepository(): ClientListRepository {
  return {
    async listClientSummaries() {
      const { clientListSupabaseRpcReadRepository } = await import(
        '../adapters/supabase/clientListRepository'
      )

      return clientListSupabaseRpcReadRepository.listClientSummaries()
    },
  }
}

export const {
  clientListRepository,
  clientDetailRepository,
  smartOperationViewsRepository,
} = currentRepositories
