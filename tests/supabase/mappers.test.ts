import assert from 'node:assert/strict'
import test from 'node:test'

import {
  hasBizMoneyWarningFromDb,
  isOpenTaskStatusForSummary,
  isScheduledEventStatusForSummary,
  mapClientStatusFromDb,
  mapEventStatusFromDb,
  mapFileStatusFromDb,
  mapMoneyStatusFromDb,
  mapTaskPriorityFromDb,
  mapTaskStatusFromDb,
  shouldIncludeEventRow,
} from '../../src/data/adapters/supabase/mappers.ts'

test('maps client_status values into the current UI status model', () => {
  assert.equal(mapClientStatusFromDb('pending'), 'attention')
  assert.equal(mapClientStatusFromDb('active'), 'active')
  assert.equal(mapClientStatusFromDb('ended'), 'archived')
})

test('maps task_status values into the current UI status model', () => {
  assert.equal(mapTaskStatusFromDb('todo'), 'doing')
  assert.equal(mapTaskStatusFromDb('in_progress'), 'doing')
  assert.equal(mapTaskStatusFromDb('blocked'), 'blocked')
  assert.equal(mapTaskStatusFromDb('done'), 'done')
})

test('tracks DB task statuses that count as open summary work', () => {
  assert.equal(isOpenTaskStatusForSummary('todo'), true)
  assert.equal(isOpenTaskStatusForSummary('in_progress'), true)
  assert.equal(isOpenTaskStatusForSummary('blocked'), true)
  assert.equal(isOpenTaskStatusForSummary('done'), false)
})

test('maps task_priority values into the current UI priority model', () => {
  assert.equal(mapTaskPriorityFromDb('low'), 'low')
  assert.equal(mapTaskPriorityFromDb('medium'), 'normal')
  assert.equal(mapTaskPriorityFromDb('high'), 'high')
  assert.equal(mapTaskPriorityFromDb('urgent'), 'high')
})

test('maps event_status values and excludes archived schedule rows', () => {
  assert.equal(mapEventStatusFromDb('scheduled'), 'scheduled')
  assert.equal(mapEventStatusFromDb('done'), 'done')
  assert.equal(mapEventStatusFromDb('canceled'), 'canceled')
  assert.equal(mapEventStatusFromDb('archived'), null)
  assert.equal(shouldIncludeEventRow('archived'), false)
})

test('keeps upcoming event count date policy unresolved', () => {
  assert.equal(isScheduledEventStatusForSummary('scheduled'), true)
  assert.equal(isScheduledEventStatusForSummary('done'), false)
  assert.equal(isScheduledEventStatusForSummary('canceled'), false)
  assert.equal(isScheduledEventStatusForSummary('archived'), false)
})

test('derives file status from archive category or archived timestamp', () => {
  assert.equal(mapFileStatusFromDb({ fileCategory: 'archive', archivedAt: null }), 'archived')
  assert.equal(
    mapFileStatusFromDb({ fileCategory: 'common', archivedAt: '2026-05-13T00:00:00Z' }),
    'archived',
  )
  assert.equal(mapFileStatusFromDb({ fileCategory: 'report', archivedAt: null }), 'active')
})

test('maps money_status values into the current UI money model', () => {
  assert.equal(mapMoneyStatusFromDb('normal'), 'checked')
  assert.equal(mapMoneyStatusFromDb('warning'), 'check_needed')
  assert.equal(mapMoneyStatusFromDb('low'), 'issue')
  assert.equal(mapMoneyStatusFromDb('empty'), 'issue')
})

test('tracks DB money statuses that count as summary warnings', () => {
  assert.equal(hasBizMoneyWarningFromDb('normal'), false)
  assert.equal(hasBizMoneyWarningFromDb('warning'), true)
  assert.equal(hasBizMoneyWarningFromDb('low'), true)
  assert.equal(hasBizMoneyWarningFromDb('empty'), true)
})
