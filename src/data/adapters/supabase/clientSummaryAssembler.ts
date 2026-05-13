import type { ClientSummary } from '../../../types'
import {
  hasBizMoneyWarningFromDb,
  isOpenTaskStatusForSummary,
  isUpcomingScheduledEventForSummary,
  mapClientStatusFromDb,
  type DbClientStatus,
  type DbEventStatus,
  type DbFileCategory,
  type DbMoneyStatus,
  type DbTaskStatus,
} from './mappers.ts'

export type ClientSummaryClientRow = {
  id: string
  name: string
  status: DbClientStatus
  owner_name: string
  drive_root_url: string | null
  memo: string | null
  updated_at: string
}

export type ClientSummaryMemberRow = {
  client_id: string
  staff_name: string
  is_primary: boolean
  is_active: boolean
}

export type ClientSummaryTaskRow = {
  client_id: string
  status: DbTaskStatus
}

export type ClientSummaryEventRow = {
  client_id: string
  status: DbEventStatus
  event_date: string
}

export type ClientSummaryFileRow = {
  client_id: string
  file_category: DbFileCategory
  drive_folder_path: string | null
  archived_at: string | null
}

export type ClientSummaryMoneyRow = {
  client_id: string
  status: DbMoneyStatus
}

export type ClientSummaryLinkRow = {
  client_id: string
  title: string
  url: string
}

export type ClientSummaryLogRow = {
  client_id: string
  created_at: string
}

export type ClientSummaryAssemblyInput = {
  client: ClientSummaryClientRow
  referenceDate: string
  members?: ClientSummaryMemberRow[]
  tasks?: ClientSummaryTaskRow[]
  events?: ClientSummaryEventRow[]
  files?: ClientSummaryFileRow[]
  moneyItems?: ClientSummaryMoneyRow[]
  links?: ClientSummaryLinkRow[]
  logs?: ClientSummaryLogRow[]
}

export function assembleClientSummaryFromRows({
  client,
  referenceDate,
  members = [],
  tasks = [],
  events = [],
  files = [],
  moneyItems = [],
  links = [],
  logs = [],
}: ClientSummaryAssemblyInput): ClientSummary {
  const driveRootUrl = client.drive_root_url ?? ''

  return {
    id: client.id,
    name: client.name,
    status: mapClientStatusFromDb(client.status),
    owner: resolveOwnerName(client, members),
    driveRootUrl,
    memo: client.memo ?? '',
    updatedAt: client.updated_at,
    openTaskCount: tasks.filter((task) => isOpenTaskStatusForSummary(task.status)).length,
    upcomingEventCount: events.filter((event) =>
      isUpcomingScheduledEventForSummary({
        status: event.status,
        eventDate: event.event_date,
        referenceDate,
      }),
    ).length,
    hasBizMoneyWarning: moneyItems.some((item) => hasBizMoneyWarningFromDb(item.status)),
    latestLogAt: resolveLatestLogAt(logs),
    hasDriveFolder: hasDriveFolder(driveRootUrl, files),
    hasLookerLink: links.some(isLookerLink),
    hasSheetLink: links.some(isSheetLink),
  }
}

function resolveOwnerName(
  client: ClientSummaryClientRow,
  members: ClientSummaryMemberRow[],
): string {
  const primaryMember = members.find(
    (member) =>
      member.client_id === client.id &&
      member.is_active &&
      member.is_primary &&
      member.staff_name.trim().length > 0,
  )

  return primaryMember?.staff_name ?? client.owner_name
}

function resolveLatestLogAt(logs: ClientSummaryLogRow[]): string | null {
  return logs.map((log) => log.created_at).sort().at(-1) ?? null
}

function hasDriveFolder(driveRootUrl: string, files: ClientSummaryFileRow[]): boolean {
  return (
    driveRootUrl.trim().length > 0 ||
    files.some((file) => file.drive_folder_path?.trim().length)
  )
}

function isLookerLink(link: ClientSummaryLinkRow): boolean {
  return includesLower(link.title, 'looker') || includesLower(link.url, 'lookerstudio.google.com')
}

function isSheetLink(link: ClientSummaryLinkRow): boolean {
  return includesLower(link.title, 'sheet') || includesLower(link.url, 'docs.google.com/spreadsheets')
}

function includesLower(value: string, search: string): boolean {
  return value.toLowerCase().includes(search)
}
