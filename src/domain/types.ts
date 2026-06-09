import type { SmartViews as SmartViewsData } from './smartViews'

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
  openTaskCount: number
  upcomingEventCount: number
  hasBizMoneyWarning: boolean
  latestLogAt: string | null
  hasDriveFolder: boolean
  hasLookerLink: boolean
  hasSheetLink: boolean
}

export type ClientListItem = {
  id: string
  name: string
  status: ClientSummary['status']
  owner: string
  openTaskCount: number
  upcomingEventCount: number
  hasBizMoneyWarning: boolean
  latestLogAt: string | null
  hasDriveFolder: boolean
  hasLookerLink: boolean
  hasSheetLink: boolean
}

export type ClientListView = {
  items: ClientListItem[]
  totalCount: number
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

export type ClientDetailHeaderModel = {
  id: string
  name: string
  status: ClientRecord['status']
  owner: string
  driveRootUrl: string
  memo: string
  updatedAt: string
}

export type ClientFilePanelItem = {
  id: string
  name: string
  folderPath: string
  type: string
  status: ClientFile['status']
  uploadedBy: string
  driveUrl: string
}

export type ClientTaskPanelItem = {
  id: string
  title: string
  note: string
  status: ClientTask['status']
  priority: ClientTask['priority']
  assignee: string
  dueDate: string
  relatedFileId?: string
}

export type ClientSchedulePanelItem = {
  id: string
  title: string
  note: string
  eventDate: string
  timeRange: string
  owner: string
  status: ClientEvent['status']
}

export type ClientMoneyPanelItem = {
  id: string
  title: string
  note: string
  status: ClientMoneyItem['status']
  lastCheckedAt: string | null
  checkedBy: string | null
  url: string
}

export type ClientLinkPanelItem = {
  id: string
  title: string
  category: ClientLink['category']
  url: string
}

export type ClientLogPanelItem = {
  id: string
  message: string
  actor: string
  action: string
  createdAt: string
}

export type SelectedClientDetailPanels = {
  files: ClientFilePanelItem[]
  tasks: ClientTaskPanelItem[]
  schedule: ClientSchedulePanelItem[]
  money: ClientMoneyPanelItem[]
  links: ClientLinkPanelItem[]
  logs: ClientLogPanelItem[]
  smartViews: SmartViewsData
}

export type SelectedClientDetailView = {
  header: ClientDetailHeaderModel
  panels: SelectedClientDetailPanels
}

export type WorkspaceView = {
  listView: ClientListView
  detailView: SelectedClientDetailView | null
  smartViews: SmartViewsData
}

export type SmartViewItem = {
  clientName: string
  title: string
  meta: string
}
