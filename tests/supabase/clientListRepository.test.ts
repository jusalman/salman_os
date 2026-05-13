import assert from 'node:assert/strict'
import test from 'node:test'

import { createClientListSupabaseRepository } from '../../src/data/adapters/supabase/clientListRepository.ts'
import type { ClientSummaryRowsReader } from '../../src/data/adapters/supabase/clientRowsReader.ts'

test('returns ClientSummary rows assembled from fake Supabase row readers', async () => {
  const repository = createClientListSupabaseRepository({
    rowsReader: createFakeRowsReader({
      clients: [
        {
          id: 'client-1',
          name: 'Ridge Campaign',
          status: 'active',
          owner_name: 'Fallback Owner',
          drive_root_url: null,
          memo: null,
          updated_at: '2026-05-13T09:00:00Z',
        },
      ],
      members: [
        {
          client_id: 'client-1',
          staff_name: 'Primary Owner',
          is_primary: true,
          is_active: true,
        },
      ],
      tasks: [
        { client_id: 'client-1', status: 'todo' },
        { client_id: 'client-1', status: 'done' },
      ],
      events: [
        { client_id: 'client-1', status: 'scheduled', event_date: '2026-05-12' },
        { client_id: 'client-1', status: 'scheduled', event_date: '2026-05-13' },
        { client_id: 'client-1', status: 'scheduled', event_date: '2026-05-14' },
      ],
      moneyItems: [{ client_id: 'client-1', status: 'warning' }],
      links: [
        {
          client_id: 'client-1',
          title: 'Looker dashboard',
          url: 'https://lookerstudio.google.com/reporting/example',
        },
      ],
    }),
    getReferenceDate: () => '2026-05-13',
  })

  const summaries = await repository.listClientSummaries()

  assert.equal(summaries.length, 1)
  assert.deepEqual(summaries[0], {
    id: 'client-1',
    name: 'Ridge Campaign',
    status: 'active',
    owner: 'Primary Owner',
    driveRootUrl: '',
    memo: '',
    updatedAt: '2026-05-13T09:00:00Z',
    openTaskCount: 1,
    upcomingEventCount: 2,
    hasBizMoneyWarning: true,
    latestLogAt: null,
    hasDriveFolder: false,
    hasLookerLink: true,
    hasSheetLink: false,
  })
})

test('returns an empty list without reading child rows when there are no clients', async () => {
  const calls: string[] = []
  const repository = createClientListSupabaseRepository({
    rowsReader: createFakeRowsReader({
      calls,
      clients: [],
      failIfChildReaderIsCalled: true,
    }),
    getReferenceDate: () => '2026-05-13',
  })

  await assert.doesNotReject(async () => {
    assert.deepEqual(await repository.listClientSummaries(), [])
  })
  assert.deepEqual(calls, ['listClients'])
})

test('groups child rows by client_id before assembling summaries', async () => {
  const repository = createClientListSupabaseRepository({
    rowsReader: createFakeRowsReader({
      clients: [
        {
          id: 'client-1',
          name: 'Ridge Campaign',
          status: 'active',
          owner_name: 'Salman',
          drive_root_url: '',
          memo: '',
          updated_at: '2026-05-13T09:00:00Z',
        },
        {
          id: 'client-2',
          name: 'North Retail',
          status: 'pending',
          owner_name: 'Mina',
          drive_root_url: '',
          memo: '',
          updated_at: '2026-05-12T09:00:00Z',
        },
      ],
      tasks: [
        { client_id: 'client-1', status: 'todo' },
        { client_id: 'client-2', status: 'blocked' },
        { client_id: 'client-2', status: 'done' },
      ],
      events: [
        { client_id: 'client-1', status: 'scheduled', event_date: '2026-05-13' },
        { client_id: 'client-2', status: 'scheduled', event_date: '2026-05-12' },
        { client_id: 'client-2', status: 'scheduled', event_date: '2026-05-14' },
      ],
    }),
    getReferenceDate: () => '2026-05-13',
  })

  const summaries = await repository.listClientSummaries()

  assert.equal(summaries[0]?.openTaskCount, 1)
  assert.equal(summaries[0]?.upcomingEventCount, 1)
  assert.equal(summaries[1]?.openTaskCount, 1)
  assert.equal(summaries[1]?.upcomingEventCount, 1)
})

test('passes the injected reference date into ClientSummary assembly', async () => {
  const rowsReader = createFakeRowsReader({
    clients: [
      {
        id: 'client-1',
        name: 'Ridge Campaign',
        status: 'active',
        owner_name: 'Salman',
        drive_root_url: '',
        memo: '',
        updated_at: '2026-05-13T09:00:00Z',
      },
    ],
    events: [
      { client_id: 'client-1', status: 'scheduled', event_date: '2026-05-13' },
      { client_id: 'client-1', status: 'scheduled', event_date: '2026-05-14' },
    ],
  })

  const todayRepository = createClientListSupabaseRepository({
    rowsReader,
    getReferenceDate: () => '2026-05-13',
  })
  const tomorrowRepository = createClientListSupabaseRepository({
    rowsReader,
    getReferenceDate: () => '2026-05-14',
  })

  assert.equal((await todayRepository.listClientSummaries())[0]?.upcomingEventCount, 2)
  assert.equal((await tomorrowRepository.listClientSummaries())[0]?.upcomingEventCount, 1)
})

test('rejects the repository call when a row reader fails', async () => {
  const repository = createClientListSupabaseRepository({
    rowsReader: createFakeRowsReader({
      clients: [
        {
          id: 'client-1',
          name: 'Ridge Campaign',
          status: 'active',
          owner_name: 'Salman',
          drive_root_url: '',
          memo: '',
          updated_at: '2026-05-13T09:00:00Z',
        },
      ],
      failTasks: true,
    }),
    getReferenceDate: () => '2026-05-13',
  })

  await assert.rejects(
    () => repository.listClientSummaries(),
    /TASK-36 fake task reader failure/,
  )
})

type FakeRowsReaderOptions = {
  calls?: string[]
  failIfChildReaderIsCalled?: boolean
  failTasks?: boolean
} & Partial<{
  [Key in keyof FakeRows]: FakeRows[Key]
}>

type FakeRows = {
  clients: Awaited<ReturnType<ClientSummaryRowsReader['listClients']>>
  members: Awaited<ReturnType<ClientSummaryRowsReader['listMembers']>>
  tasks: Awaited<ReturnType<ClientSummaryRowsReader['listTasks']>>
  events: Awaited<ReturnType<ClientSummaryRowsReader['listEvents']>>
  files: Awaited<ReturnType<ClientSummaryRowsReader['listFiles']>>
  moneyItems: Awaited<ReturnType<ClientSummaryRowsReader['listMoneyItems']>>
  links: Awaited<ReturnType<ClientSummaryRowsReader['listLinks']>>
  logs: Awaited<ReturnType<ClientSummaryRowsReader['listLogs']>>
}

function createFakeRowsReader({
  calls = [],
  failIfChildReaderIsCalled = false,
  failTasks = false,
  clients = [],
  members = [],
  tasks = [],
  events = [],
  files = [],
  moneyItems = [],
  links = [],
  logs = [],
}: FakeRowsReaderOptions): ClientSummaryRowsReader {
  function readChildRows<T>(name: string, rows: T[]): Promise<T[]> {
    calls.push(name)

    if (failIfChildReaderIsCalled) {
      throw new Error(`${name} should not be called`)
    }

    return Promise.resolve(rows)
  }

  return {
    async listClients() {
      calls.push('listClients')
      return clients
    },
    listMembers() {
      return readChildRows('listMembers', members)
    },
    listTasks() {
      calls.push('listTasks')

      if (failTasks) {
        return Promise.reject(new Error('TASK-36 fake task reader failure'))
      }

      if (failIfChildReaderIsCalled) {
        return Promise.reject(new Error('listTasks should not be called'))
      }

      return Promise.resolve(tasks)
    },
    listEvents() {
      return readChildRows('listEvents', events)
    },
    listFiles() {
      return readChildRows('listFiles', files)
    },
    listMoneyItems() {
      return readChildRows('listMoneyItems', moneyItems)
    },
    listLinks() {
      return readChildRows('listLinks', links)
    },
    listLogs() {
      return readChildRows('listLogs', logs)
    },
  }
}
