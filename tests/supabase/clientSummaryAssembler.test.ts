import assert from 'node:assert/strict'
import test from 'node:test'

import { assembleClientSummaryFromRows } from '../../src/data/adapters/supabase/clientSummaryAssembler.ts'

const referenceDate = '2026-05-13'

test('assembles ClientSummary base fields from Supabase-shaped client rows', () => {
  const summary = assembleClientSummaryFromRows({
    referenceDate,
    client: {
      id: 'client-1',
      name: 'Ridge Campaign',
      status: 'pending',
      owner_name: 'Fallback Owner',
      drive_root_url: null,
      memo: null,
      updated_at: '2026-05-13T09:00:00Z',
    },
    members: [
      {
        client_id: 'client-1',
        staff_name: 'Primary Owner',
        is_primary: true,
        is_active: true,
      },
    ],
  })

  assert.equal(summary.id, 'client-1')
  assert.equal(summary.status, 'attention')
  assert.equal(summary.owner, 'Primary Owner')
  assert.equal(summary.driveRootUrl, '')
  assert.equal(summary.memo, '')
  assert.equal(summary.updatedAt, '2026-05-13T09:00:00Z')
})

test('counts open tasks and upcoming scheduled events from DB enum rows', () => {
  const summary = assembleClientSummaryFromRows({
    referenceDate,
    client: {
      id: 'client-1',
      name: 'Ridge Campaign',
      status: 'active',
      owner_name: 'Salman',
      drive_root_url: '',
      memo: '',
      updated_at: '2026-05-13T09:00:00Z',
    },
    tasks: [
      { client_id: 'client-1', status: 'todo' },
      { client_id: 'client-1', status: 'in_progress' },
      { client_id: 'client-1', status: 'blocked' },
      { client_id: 'client-1', status: 'done' },
    ],
    events: [
      { client_id: 'client-1', status: 'scheduled', event_date: '2026-05-12' },
      { client_id: 'client-1', status: 'scheduled', event_date: '2026-05-13' },
      { client_id: 'client-1', status: 'scheduled', event_date: '2026-05-14' },
      { client_id: 'client-1', status: 'done', event_date: '2026-05-14' },
      { client_id: 'client-1', status: 'archived', event_date: '2026-05-14' },
    ],
  })

  assert.equal(summary.openTaskCount, 3)
  assert.equal(summary.upcomingEventCount, 2)
})

test('assembles money, drive, link, and latest log summary flags', () => {
  const summary = assembleClientSummaryFromRows({
    referenceDate,
    client: {
      id: 'client-1',
      name: 'Ridge Campaign',
      status: 'active',
      owner_name: 'Salman',
      drive_root_url: '',
      memo: '',
      updated_at: '2026-05-13T09:00:00Z',
    },
    files: [
      {
        client_id: 'client-1',
        file_category: 'report',
        drive_folder_path: 'Clients/Ridge/Reports',
        archived_at: null,
      },
    ],
    moneyItems: [
      { client_id: 'client-1', status: 'normal' },
      { client_id: 'client-1', status: 'warning' },
    ],
    links: [
      {
        client_id: 'client-1',
        title: 'Looker dashboard',
        url: 'https://lookerstudio.google.com/reporting/example',
      },
      {
        client_id: 'client-1',
        title: 'Planning Sheet',
        url: 'https://docs.google.com/spreadsheets/d/example',
      },
    ],
    logs: [
      { client_id: 'client-1', created_at: '2026-05-12T09:00:00Z' },
      { client_id: 'client-1', created_at: '2026-05-13T10:00:00Z' },
    ],
  })

  assert.equal(summary.hasBizMoneyWarning, true)
  assert.equal(summary.hasDriveFolder, true)
  assert.equal(summary.hasLookerLink, true)
  assert.equal(summary.hasSheetLink, true)
  assert.equal(summary.latestLogAt, '2026-05-13T10:00:00Z')
})
