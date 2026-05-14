import type { ClientSummary } from '../../../types'
import { mapClientStatusFromDb, type DbClientStatus } from './mappers.ts'
import { requireSupabaseClient } from './supabaseClient.ts'

export type ClientRow = {
  id: string
  name: string
  status: 'pending' | 'active' | 'ended'
  service_type: 'sa' | 'da' | 'sa_da'
  owner_name: string
  drive_root_url: string | null
  memo: string | null
  created_at: string
  updated_at: string
  ended_at: string | null
}

export type ClientListSummaryRpcRow = {
  id: string
  name: string
  status: DbClientStatus
  owner_name: string
  drive_root_url: string | null
  memo: string | null
  updated_at: string
  open_task_count: number
  upcoming_event_count: number
  has_biz_money_warning: boolean
  latest_log_at: string | null
  has_drive_folder: boolean
  has_looker_link: boolean
  has_sheet_link: boolean
}

export type ClientListRpcReader = {
  listClientSummaries: () => Promise<ClientListSummaryRpcRow[]>
}

export async function listClientRows(): Promise<ClientRow[]> {
  const { data, error } = await requireSupabaseClient()
    .from('clients')
    .select(
      'id, name, status, service_type, owner_name, drive_root_url, memo, created_at, updated_at, ended_at',
    )
    .order('updated_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

export const supabaseClientListRpcReader: ClientListRpcReader = {
  async listClientSummaries() {
    const { data, error } = await requireSupabaseClient().rpc('get_client_list_summaries_v1')

    if (error) {
      throw error
    }

    return (data ?? []) as ClientListSummaryRpcRow[]
  },
}

export function mapClientSummaryFromRpcRow(row: ClientListSummaryRpcRow): ClientSummary {
  return {
    id: row.id,
    name: row.name,
    status: mapClientStatusFromDb(row.status),
    owner: row.owner_name,
    driveRootUrl: row.drive_root_url ?? '',
    memo: row.memo ?? '',
    updatedAt: row.updated_at,
    openTaskCount: row.open_task_count,
    upcomingEventCount: row.upcoming_event_count,
    hasBizMoneyWarning: row.has_biz_money_warning,
    latestLogAt: row.latest_log_at,
    hasDriveFolder: row.has_drive_folder,
    hasLookerLink: row.has_looker_link,
    hasSheetLink: row.has_sheet_link,
  }
}
