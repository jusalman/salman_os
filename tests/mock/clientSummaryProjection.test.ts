import assert from 'node:assert/strict'
import test from 'node:test'

import { projectClientSummary } from '../../src/data/projections/clientSummary.ts'

const client = {
  id: 'client-1',
  name: 'Ridge Campaign',
  status: 'active' as const,
  owner: 'Salman',
  driveRootUrl: '',
  memo: '',
  updatedAt: '2026-05-13T09:00:00Z',
}

const emptyCollections = {
  tasks: [],
  events: [],
  files: [],
  moneyItems: [],
  links: [],
  logs: [],
}

test('counts only today and future scheduled mock events as upcoming', () => {
  const summary = projectClientSummary(
    client,
    {
      ...emptyCollections,
      events: [
        {
          id: 'past',
          title: 'Past scheduled',
          eventDate: '2026-05-12',
          startTime: '09:00',
          endTime: '09:30',
          owner: 'Salman',
          status: 'scheduled',
          note: '',
        },
        {
          id: 'today',
          title: 'Today scheduled',
          eventDate: '2026-05-13',
          startTime: '09:00',
          endTime: '09:30',
          owner: 'Salman',
          status: 'scheduled',
          note: '',
        },
        {
          id: 'future',
          title: 'Future scheduled',
          eventDate: '2026-05-14',
          startTime: '09:00',
          endTime: '09:30',
          owner: 'Salman',
          status: 'scheduled',
          note: '',
        },
        {
          id: 'done',
          title: 'Done future',
          eventDate: '2026-05-14',
          startTime: '09:00',
          endTime: '09:30',
          owner: 'Salman',
          status: 'done',
          note: '',
        },
      ],
    },
    { referenceDate: '2026-05-13' },
  )

  assert.equal(summary.upcomingEventCount, 2)
})

test('uses the injected reference date for mock upcoming event parity', () => {
  const collections = {
    ...emptyCollections,
    events: [
      {
        id: 'today',
        title: 'Today scheduled',
        eventDate: '2026-05-13',
        startTime: '09:00',
        endTime: '09:30',
        owner: 'Salman',
        status: 'scheduled' as const,
        note: '',
      },
      {
        id: 'future',
        title: 'Future scheduled',
        eventDate: '2026-05-14',
        startTime: '09:00',
        endTime: '09:30',
        owner: 'Salman',
        status: 'scheduled' as const,
        note: '',
      },
    ],
  }

  assert.equal(
    projectClientSummary(client, collections, { referenceDate: '2026-05-13' })
      .upcomingEventCount,
    2,
  )
  assert.equal(
    projectClientSummary(client, collections, { referenceDate: '2026-05-14' })
      .upcomingEventCount,
    1,
  )
})
