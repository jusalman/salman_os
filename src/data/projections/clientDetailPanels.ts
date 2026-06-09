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
  }))
}
