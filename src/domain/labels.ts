import type {
  ClientStatus,
  EventStatus,
  FileStatus,
  MoneyStatus,
  TaskPriority,
  TaskStatus,
} from './types'

export const clientStatusLabel: Record<ClientStatus, string> = {
  active: '정상 운영',
  attention: '확인 필요',
  archived: '보관',
}

export const taskStatusLabel: Record<TaskStatus, string> = {
  doing: '진행 중',
  blocked: '막힘',
  done: '완료',
  archived: '보관',
}

export const taskPriorityLabel: Record<TaskPriority, string> = {
  high: '높음',
  normal: '보통',
  low: '낮음',
}

export const fileStatusLabel: Record<FileStatus, string> = {
  active: '사용 중',
  archived: '보관',
}

export const moneyStatusLabel: Record<MoneyStatus, string> = {
  check_needed: '확인 필요',
  checked: '확인 완료',
  issue: '문제 발생',
}

export const eventStatusLabel: Record<EventStatus, string> = {
  scheduled: '예정',
  done: '완료',
  canceled: '취소',
}
