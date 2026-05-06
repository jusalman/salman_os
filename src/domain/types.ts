export type ClientStatus = 'active' | 'attention' | 'archived'
export type TaskStatus = 'doing' | 'blocked' | 'done' | 'archived'
export type TaskPriority = 'high' | 'normal' | 'low'
export type EventStatus = 'scheduled' | 'done' | 'canceled'
export type FileStatus = 'active' | 'archived'
export type MoneyStatus = 'check_needed' | 'checked' | 'issue'

export type ClientFile = {
  id: string
  name: string
  type: string
  folderPath: string
  driveUrl: string
  status: FileStatus
  uploadedBy: string
  uploadedAt: string
}

export type ClientTask = {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assignee: string
  relatedFileId?: string
  note: string
}

export type ClientEvent = {
  id: string
  title: string
  eventDate: string
  startTime: string
  endTime: string
  owner: string
  status: EventStatus
  note: string
}

export type ClientMoneyItem = {
  id: string
  title: string
  url: string
  status: MoneyStatus
  lastCheckedAt: string | null
  checkedBy: string | null
  note: string
}

export type ClientLink = {
  id: string
  title: string
  url: string
  category: 'drive' | 'admin' | 'report' | 'external'
}

export type OperationLog = {
  id: string
  createdAt: string
  actor: string
  action: string
  message: string
}

export type ClientSummary = {
  id: string
  name: string
  status: ClientStatus
  owner: string
  driveRootUrl: string
  memo: string
  updatedAt: string
}

export type ClientRecord = {
  id: string
  name: string
  status: ClientStatus
  owner: string
  driveRootUrl: string
  memo: string
  updatedAt: string
  files: ClientFile[]
  tasks: ClientTask[]
  events: ClientEvent[]
  moneyItems: ClientMoneyItem[]
  links: ClientLink[]
  logs: OperationLog[]
}

export type SmartViewItem = {
  clientName: string
  title: string
  meta: string
}
