import type {
  ClientEvent,
  ClientFile,
  ClientLink,
  ClientMoneyItem,
  ClientSummary,
  ClientTask,
  OperationLog,
} from '../../types'
import { TODAY } from '../../config/constants.ts'

type ClientSummarySource = {
  id: string
  name: string
  status: ClientSummary['status']
  owner: string
  driveRootUrl: string
  memo: string
  updatedAt: string
}

type ClientSummaryCollections = {
  tasks: ClientTask[]
  events: ClientEvent[]
  files: ClientFile[]
  moneyItems: ClientMoneyItem[]
  links: ClientLink[]
  logs: OperationLog[]
}

type ClientSummaryProjectionOptions = {
  referenceDate?: string
}

export function projectClientSummary(
  client: ClientSummarySource,
  collections: ClientSummaryCollections,
  { referenceDate = TODAY }: ClientSummaryProjectionOptions = {},
): ClientSummary {
  const openTaskCount = collections.tasks.filter(
    (task) => task.status === 'doing' || task.status === 'blocked',
  ).length
  const upcomingEventCount = collections.events.filter((event) =>
    isUpcomingScheduledEvent(event, referenceDate),
  ).length
  const hasBizMoneyWarning = collections.moneyItems.some((item) => item.status !== 'checked')
  const latestLogAt = collections.logs[0]?.createdAt ?? null
  const hasDriveFolder =
    client.driveRootUrl.trim().length > 0 ||
    collections.files.some((file) => file.folderPath.trim().length > 0)
  const hasLookerLink = collections.links.some(
    (link) =>
      link.title.toLowerCase().includes('looker') ||
      link.url.toLowerCase().includes('lookerstudio.google.com'),
  )
  const hasSheetLink = collections.links.some(
    (link) =>
      link.title.toLowerCase().includes('sheet') ||
      link.url.toLowerCase().includes('docs.google.com/spreadsheets'),
  )

  return {
    ...client,
    openTaskCount,
    upcomingEventCount,
    hasBizMoneyWarning,
    latestLogAt,
    hasDriveFolder,
    hasLookerLink,
    hasSheetLink,
  }
}

function isUpcomingScheduledEvent(event: ClientEvent, referenceDate: string): boolean {
  return event.status === 'scheduled' && toDateKey(event.eventDate) >= toDateKey(referenceDate)
}

function toDateKey(value: string): string {
  return value.slice(0, 10)
}
