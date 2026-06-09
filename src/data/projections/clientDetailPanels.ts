import type {
  ClientFilePanelItem,
  ClientLinkPanelItem,
  ClientLogPanelItem,
  ClientMoneyPanelItem,
  ClientRecord,
  ClientSchedulePanelItem,
  ClientTaskPanelItem,
} from '../../types'

export function projectClientFilePanelItems(client: ClientRecord): ClientFilePanelItem[] {
  return client.files.map((file) => ({
    id: file.id,
    name: file.name,
    folderPath: file.folderPath,
    type: file.type,
    status: file.status,
    uploadedBy: file.uploadedBy,
    driveUrl: file.driveUrl,
  }))
}

export function projectClientTaskPanelItems(client: ClientRecord): ClientTaskPanelItem[] {
  return client.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    note: task.note,
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
    dueDate: task.dueDate,
    relatedFileId: task.relatedFileId,
  }))
}

export function projectClientSchedulePanelItems(client: ClientRecord): ClientSchedulePanelItem[] {
  return client.events.map((event) => ({
    id: event.id,
    title: event.title,
    note: event.note,
    eventDate: event.eventDate,
    timeRange: `${event.startTime}-${event.endTime}`,
    owner: event.owner,
    status: event.status,
  }))
}

export function projectClientMoneyPanelItems(client: ClientRecord): ClientMoneyPanelItem[] {
  return client.moneyItems.map((item) => ({
    id: item.id,
    title: item.title,
    note: item.note,
    status: item.status,
    lastCheckedAt: item.lastCheckedAt,
    checkedBy: item.checkedBy,
    url: item.url,
  }))
}

export function projectClientLinkPanelItems(client: ClientRecord): ClientLinkPanelItem[] {
  return client.links.map((link) => ({
    id: link.id,
    title: link.title,
    category: link.category,
    url: link.url,
  }))
}

export function projectClientLogPanelItems(client: ClientRecord): ClientLogPanelItem[] {
  return client.logs.map((log) => ({
    id: log.id,
    message: log.message,
    actor: log.actor,
    action: log.action,
    createdAt: log.createdAt,
    target: resolveLogTarget(log.message),
    status: resolveLogStatus(log.action, log.message),
    relatedTaskTitle: resolveRelatedTaskTitle(log.message),
    relatedFileName: resolveRelatedFileName(log.message),
    relatedScheduleTitle: resolveRelatedScheduleTitle(log.message),
    note: `${client.name} 운영 로그입니다. 현재는 mock-first 읽기 모델이며 실제 저장 단계에서 operation_logs 기준으로 확장합니다.`,
  }))
}

function resolveLogTarget(message: string) {
  if (message.includes('비즈머니') || message.includes('결제')) {
    return '정산/비즈머니'
  }

  if (message.includes('파일') || message.includes('자료') || message.includes('소재')) {
    return '자료실'
  }

  if (message.includes('예산안')) {
    return '견적/계약'
  }

  if (message.includes('운영 종료') || message.includes('고객사')) {
    return '고객사 상태'
  }

  return '운영 기록'
}

function resolveLogStatus(action: string, message: string): ClientLogPanelItem['status'] {
  if (action === '보관' || message.includes('보관')) {
    return 'archived'
  }

  if (message.includes('확인 필요') || message.includes('오류')) {
    return 'check_needed'
  }

  return 'recorded'
}

function resolveRelatedTaskTitle(message: string) {
  if (message.includes('진행 업무') || message.includes('업무')) {
    return '진행 업무 연결 준비'
  }

  return '연결 업무 없음'
}

function resolveRelatedFileName(message: string) {
  if (message.includes('파일') || message.includes('자료') || message.includes('소재')) {
    return '관련 자료 연결 준비'
  }

  return '연결 파일 없음'
}

function resolveRelatedScheduleTitle(message: string) {
  if (message.includes('오늘')) {
    return '오늘 확인 일정 연결 준비'
  }

  return '연결 일정 없음'
}
