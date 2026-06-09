import assert from 'node:assert/strict'
import test from 'node:test'

import { formatWon, resolveBusinessMoneyStatus } from '../../src/domain/businessMoney.ts'

test('marks business money normal when balance is above alert amount', () => {
  assert.equal(
    resolveBusinessMoneyStatus(
      {
        currentBalance: 300000,
        minimumAlertAmount: 200000,
        lastCheckedAt: '2026-05-22 09:00',
      },
      '2026-05-22',
    ),
    'checked',
  )
})

test('marks business money check_needed when balance is at or below alert amount', () => {
  assert.equal(
    resolveBusinessMoneyStatus(
      {
        currentBalance: 200000,
        minimumAlertAmount: 200000,
        lastCheckedAt: '2026-05-22 09:00',
      },
      '2026-05-22',
    ),
    'check_needed',
  )
})

test('marks business money issue when balance is zero or critically low', () => {
  assert.equal(
    resolveBusinessMoneyStatus(
      {
        currentBalance: 0,
        minimumAlertAmount: 200000,
        lastCheckedAt: '2026-05-22 09:00',
      },
      '2026-05-22',
    ),
    'issue',
  )
  assert.equal(
    resolveBusinessMoneyStatus(
      {
        currentBalance: 30000,
        minimumAlertAmount: 200000,
        lastCheckedAt: '2026-05-22 09:00',
      },
      '2026-05-22',
    ),
    'issue',
  )
})

test('marks business money unknown when balance or check date is missing or stale', () => {
  assert.equal(
    resolveBusinessMoneyStatus(
      {
        currentBalance: null,
        minimumAlertAmount: 200000,
        lastCheckedAt: '2026-05-22 09:00',
      },
      '2026-05-22',
    ),
    'unknown',
  )
  assert.equal(
    resolveBusinessMoneyStatus(
      {
        currentBalance: 300000,
        minimumAlertAmount: 200000,
        lastCheckedAt: null,
      },
      '2026-05-22',
    ),
    'unknown',
  )
  assert.equal(
    resolveBusinessMoneyStatus(
      {
        currentBalance: 300000,
        minimumAlertAmount: 200000,
        lastCheckedAt: '2026-05-18 09:00',
      },
      '2026-05-22',
    ),
    'unknown',
  )
})

test('formats Korean won amounts and missing balances', () => {
  assert.equal(formatWon(250000), '250,000원')
  assert.equal(formatWon(null), '잔액 미확인')
})
