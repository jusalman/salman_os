import assert from 'node:assert/strict'
import test from 'node:test'

import {
  resolveDataSource,
  resolveSupabaseReadActivation,
  selectRepositories,
  type RepositorySet,
  type RepositorySets,
} from '../../src/data/repositories/repositorySelection.ts'

test('keeps mock as the default data source', () => {
  const repositories = selectRepositories(
    {
      dataSourceValue: undefined,
      supabaseReadActivationValue: undefined,
      hasSupabaseBrowserConfig: false,
    },
    createRepositorySets(),
  )

  assert.equal(repositories.clientListRepository, repositoryMarkers.mock.clientListRepository)
  assert.equal(repositories.clientDetailRepository, repositoryMarkers.mock.clientDetailRepository)
  assert.equal(
    repositories.smartOperationViewsRepository,
    repositoryMarkers.mock.smartOperationViewsRepository,
  )
})

test('falls back to mock for invalid data source values', () => {
  assert.equal(resolveDataSource('invalid'), 'mock')

  const repositories = selectRepositories(
    {
      dataSourceValue: 'invalid',
      supabaseReadActivationValue: 'client_list',
      hasSupabaseBrowserConfig: true,
    },
    createRepositorySets(),
  )

  assert.equal(repositories.clientListRepository, repositoryMarkers.mock.clientListRepository)
})

test('keeps Supabase placeholders when data source is Supabase but activation is off', () => {
  assert.equal(resolveSupabaseReadActivation(undefined), 'off')
  assert.equal(resolveSupabaseReadActivation('anything_else'), 'off')

  const repositories = selectRepositories(
    {
      dataSourceValue: 'supabase',
      supabaseReadActivationValue: 'off',
      hasSupabaseBrowserConfig: true,
    },
    createRepositorySets(),
  )

  assert.equal(
    repositories.clientListRepository,
    repositoryMarkers.supabasePlaceholder.clientListRepository,
  )
  assert.equal(
    repositories.clientDetailRepository,
    repositoryMarkers.supabasePlaceholder.clientDetailRepository,
  )
  assert.equal(
    repositories.smartOperationViewsRepository,
    repositoryMarkers.supabasePlaceholder.smartOperationViewsRepository,
  )
})

test('selects only ClientList Supabase RPC repository with explicit activation and config', () => {
  assert.equal(resolveSupabaseReadActivation('client_list'), 'client_list')

  const repositories = selectRepositories(
    {
      dataSourceValue: 'supabase',
      supabaseReadActivationValue: 'client_list',
      hasSupabaseBrowserConfig: true,
    },
    createRepositorySets(),
  )

  assert.equal(
    repositories.clientListRepository,
    repositoryMarkers.supabaseClientList.clientListRepository,
  )
  assert.equal(
    repositories.clientDetailRepository,
    repositoryMarkers.supabaseClientList.clientDetailRepository,
  )
  assert.equal(
    repositories.smartOperationViewsRepository,
    repositoryMarkers.supabaseClientList.smartOperationViewsRepository,
  )
})

test('keeps Supabase placeholders when ClientList activation lacks browser config', () => {
  const repositories = selectRepositories(
    {
      dataSourceValue: 'supabase',
      supabaseReadActivationValue: 'client_list',
      hasSupabaseBrowserConfig: false,
    },
    createRepositorySets(),
  )

  assert.equal(
    repositories.clientListRepository,
    repositoryMarkers.supabasePlaceholder.clientListRepository,
  )
})

test('does not silently fall back to mock when activated ClientList repository fails', async () => {
  const repositories = selectRepositories(
    {
      dataSourceValue: 'supabase',
      supabaseReadActivationValue: 'client_list',
      hasSupabaseBrowserConfig: true,
    },
    createRepositorySets({
      supabaseClientListClientListRepository: {
        async listClientSummaries() {
          throw new Error('TASK-39 activated ClientList failure')
        },
      },
    }),
  )

  await assert.rejects(
    () => repositories.clientListRepository.listClientSummaries(),
    /TASK-39 activated ClientList failure/,
  )
})

const repositoryMarkers = {
  mock: createRepositorySet('mock'),
  supabasePlaceholder: createRepositorySet('supabase-placeholder'),
  supabaseClientList: createRepositorySet('supabase-client-list-rpc'),
}

function createRepositorySets({
  supabaseClientListClientListRepository = repositoryMarkers.supabaseClientList.clientListRepository,
}: {
  supabaseClientListClientListRepository?: RepositorySet['clientListRepository']
} = {}): RepositorySets {
  return {
    mockRepositories: repositoryMarkers.mock,
    supabasePlaceholderRepositories: repositoryMarkers.supabasePlaceholder,
    supabaseClientListRepositories: {
      ...repositoryMarkers.supabaseClientList,
      clientListRepository: supabaseClientListClientListRepository,
    },
  }
}

function createRepositorySet(label: string): RepositorySet {
  return {
    clientListRepository: {
      async listClientSummaries() {
        return [
          {
            id: label,
            name: label,
            status: 'active',
            owner: label,
            driveRootUrl: '',
            memo: '',
            updatedAt: '',
            openTaskCount: 0,
            upcomingEventCount: 0,
            hasBizMoneyWarning: false,
            latestLogAt: null,
            hasDriveFolder: false,
            hasLookerLink: false,
            hasSheetLink: false,
          },
        ]
      },
    },
    clientDetailRepository: {
      async getClientDetail() {
        return undefined
      },
    },
    smartOperationViewsRepository: {
      async getSmartOperationViews() {
        return {
          todaysItems: [],
          priorityTasks: [],
          moneyAlerts: [],
          recentArchive: [],
        }
      },
    },
  }
}
