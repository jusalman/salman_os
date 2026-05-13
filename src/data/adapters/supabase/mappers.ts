import type {
  ClientLink,
  ClientStatus,
  EventStatus,
  FileStatus,
  MoneyStatus,
  TaskPriority,
  TaskStatus,
} from '../../../types'

export type DbClientStatus = 'pending' | 'active' | 'ended'
export type DbTaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked'
export type DbTaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type DbEventStatus = 'scheduled' | 'done' | 'canceled' | 'archived'
export type DbFileCategory =
  | 'common'
  | 'sa'
  | 'da'
  | 'report'
  | 'contract'
  | 'meeting_note'
  | 'creative'
  | 'archive'
  | 'other'
export type DbMoneyStatus = 'normal' | 'warning' | 'low' | 'empty'
export type DbLogActionType =
  | 'create'
  | 'update'
  | 'archive'
  | 'restore'
  | 'view'
  | 'link_open'
  | 'login'
  | 'memo'

export function mapClientStatusFromDb(status: DbClientStatus): ClientStatus {
  switch (status) {
    case 'pending':
      return 'attention'
    case 'active':
      return 'active'
    case 'ended':
      return 'archived'
    default:
      return failUnknownDbValue('client_status', status)
  }
}

export function mapTaskStatusFromDb(status: DbTaskStatus): TaskStatus {
  switch (status) {
    // Lossy v1 mapping: the current UI does not distinguish queued and active work.
    case 'todo':
    case 'in_progress':
      return 'doing'
    case 'blocked':
      return 'blocked'
    case 'done':
      return 'done'
    default:
      return failUnknownDbValue('task_status', status)
  }
}

export function mapTaskPriorityFromDb(priority: DbTaskPriority): TaskPriority {
  switch (priority) {
    case 'low':
      return 'low'
    case 'medium':
      return 'normal'
    case 'high':
      return 'high'
    // Lossy v1 mapping: urgent stays high-attention without adding a UI state.
    case 'urgent':
      return 'high'
    default:
      return failUnknownDbValue('task_priority', priority)
  }
}

export function mapEventStatusFromDb(status: DbEventStatus): EventStatus | null {
  switch (status) {
    case 'scheduled':
      return 'scheduled'
    case 'done':
      return 'done'
    case 'canceled':
      return 'canceled'
    case 'archived':
      return null
    default:
      return failUnknownDbValue('event_status', status)
  }
}

export function shouldIncludeEventRow(status: DbEventStatus): boolean {
  return mapEventStatusFromDb(status) !== null
}

export function mapFileStatusFromDb({
  fileCategory,
  archivedAt,
}: {
  fileCategory: DbFileCategory
  archivedAt: string | null
}): FileStatus {
  if (fileCategory === 'archive' || archivedAt) {
    return 'archived'
  }

  return 'active'
}

export function mapMoneyStatusFromDb(status: DbMoneyStatus): MoneyStatus {
  switch (status) {
    case 'normal':
      return 'checked'
    case 'warning':
      return 'check_needed'
    // Lossy v1 mapping: low and empty are both surfaced as issue.
    case 'low':
    case 'empty':
      return 'issue'
    default:
      return failUnknownDbValue('money_status', status)
  }
}

export function mapLogActionFromDb(actionType: DbLogActionType): string {
  switch (actionType) {
    case 'create':
      return 'created'
    case 'update':
      return 'updated'
    case 'archive':
      return 'archived'
    case 'restore':
      return 'restored'
    case 'view':
      return 'viewed'
    case 'link_open':
      return 'link opened'
    case 'login':
      return 'login'
    case 'memo':
      return 'note'
    default:
      return failUnknownDbValue('log_action_type', actionType)
  }
}

export function mapClientLinkCategoryFromDb(category: string): ClientLink['category'] {
  switch (category) {
    case 'drive':
    case 'admin':
    case 'report':
    case 'external':
      return category
    default:
      return 'external'
  }
}

export function isOpenTaskStatusForSummary(status: DbTaskStatus): boolean {
  return status === 'todo' || status === 'in_progress' || status === 'blocked'
}

export function hasBizMoneyWarningFromDb(status: DbMoneyStatus): boolean {
  return status !== 'normal'
}

export function isScheduledEventStatusForSummary(status: DbEventStatus): boolean {
  return status === 'scheduled'
}

export function isUpcomingScheduledEventForSummary({
  status,
  eventDate,
  referenceDate,
}: {
  status: DbEventStatus
  eventDate: string
  referenceDate: string
}): boolean {
  if (!isScheduledEventStatusForSummary(status)) {
    return false
  }

  return toDateKey(eventDate) >= toDateKey(referenceDate)
}

function failUnknownDbValue(enumName: string, value: never): never {
  throw new Error(`Unknown SALMAN OS Supabase ${enumName} value: ${String(value)}`)
}

function toDateKey(value: string): string {
  return value.slice(0, 10)
}
