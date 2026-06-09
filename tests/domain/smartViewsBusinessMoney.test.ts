import assert from 'node:assert/strict'
import test from 'node:test'

import { buildSmartViews } from '../../src/domain/smartViews.ts'
import type { ClientRecord } from '../../src/types.ts'

const baseClient: Omit<ClientRecord, 'id' | 'name' | 'moneyItems'> = {
  status: 'active',
  owner: '살만',
  driveRootUrl: '',
  memo: '',
  updatedAt: '2026-05-22',
  files: [],
  tasks: [],
  events: [],
  links: [],
  logs: [],
}

test('builds business money alerts only for problematic money items', () => {
  const views = buildSmartViews([
    {
      ...baseClient,
      id: 'client-1',
      name: '정상 고객사',
      moneyItems: [
        {
          id: 'normal',
          title: '정상 비즈머니',
          url: 'https://example.com/normal',
          status: 'checked',
          currentBalance: 500000,
          minimumAlertAmount: 200000,
          lastCheckedAt: '2026-05-22 09:00',
          checkedBy: '살만',
          note: '',
        },
      ],
    },
    {
      ...baseClient,
      id: 'client-2',
      name: '확인 고객사',
      moneyItems: [
        {
          id: 'low',
          title: '낮은 비즈머니',
          url: 'https://example.com/low',
          status: 'check_needed',
          currentBalance: 150000,
          minimumAlertAmount: 200000,
          lastCheckedAt: '2026-05-22 09:00',
          checkedBy: '민아',
          note: '',
        },
        {
          id: 'unknown',
          title: '미확인 비즈머니',
          url: 'https://example.com/unknown',
          status: 'unknown',
          currentBalance: null,
          minimumAlertAmount: 200000,
          lastCheckedAt: null,
          checkedBy: null,
          note: '',
        },
      ],
    },
  ])

  assert.deepEqual(
    views.moneyAlerts.map((item) => item.title),
    ['낮은 비즈머니', '미확인 비즈머니'],
  )
  assert.deepEqual(
    views.moneyAlerts.map((item) => item.clientId),
    ['client-2', 'client-2'],
  )
})
