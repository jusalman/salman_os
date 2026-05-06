import type {
  ClientStatus,
  EventStatus,
  FileStatus,
  MoneyStatus,
  TaskPriority,
  TaskStatus,
} from './types'

export const clientStatusLabel: Record<ClientStatus, string> = {
  active: 'Active',
  attention: 'Check Needed',
  archived: 'Archived',
}

export const taskStatusLabel: Record<TaskStatus, string> = {
  doing: 'Doing',
  blocked: 'Blocked',
  done: 'Done',
  archived: 'Archived',
}

export const taskPriorityLabel: Record<TaskPriority, string> = {
  high: 'High',
  normal: 'Normal',
  low: 'Low',
}

export const fileStatusLabel: Record<FileStatus, string> = {
  active: 'Active',
  archived: '99_Archive',
}

export const moneyStatusLabel: Record<MoneyStatus, string> = {
  check_needed: 'Check Needed',
  checked: 'Checked',
  issue: 'Issue',
}

export const eventStatusLabel: Record<EventStatus, string> = {
  scheduled: 'Scheduled',
  done: 'Done',
  canceled: 'Canceled',
}
