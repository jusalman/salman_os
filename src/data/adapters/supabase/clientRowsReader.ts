import {
  type ClientSummaryClientRow,
  type ClientSummaryEventRow,
  type ClientSummaryFileRow,
  type ClientSummaryLinkRow,
  type ClientSummaryLogRow,
  type ClientSummaryMemberRow,
  type ClientSummaryMoneyRow,
  type ClientSummaryTaskRow,
} from './clientSummaryAssembler.ts'
import { requireSupabaseClient } from './supabaseClient.ts'

export type ClientSummaryRowsReader = {
  listClients: () => Promise<ClientSummaryClientRow[]>
  listMembers: (clientIds: string[]) => Promise<ClientSummaryMemberRow[]>
  listTasks: (clientIds: string[]) => Promise<ClientSummaryTaskRow[]>
  listEvents: (clientIds: string[]) => Promise<ClientSummaryEventRow[]>
  listFiles: (clientIds: string[]) => Promise<ClientSummaryFileRow[]>
  listMoneyItems: (clientIds: string[]) => Promise<ClientSummaryMoneyRow[]>
  listLinks: (clientIds: string[]) => Promise<ClientSummaryLinkRow[]>
  listLogs: (clientIds: string[]) => Promise<ClientSummaryLogRow[]>
}

export const supabaseClientSummaryRowsReader: ClientSummaryRowsReader = {
  async listClients() {
    const { data, error } = await requireSupabaseClient()
      .from('clients')
      .select('id, name, status, owner_name, drive_root_url, memo, updated_at')
      .order('updated_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []) as ClientSummaryClientRow[]
  },

  async listMembers(clientIds) {
    const { data, error } = await requireSupabaseClient()
      .from('client_members')
      .select('client_id, staff_name, is_primary, is_active')
      .in('client_id', clientIds)

    if (error) {
      throw error
    }

    return (data ?? []) as ClientSummaryMemberRow[]
  },

  async listTasks(clientIds) {
    const { data, error } = await requireSupabaseClient()
      .from('client_tasks')
      .select('client_id, status')
      .in('client_id', clientIds)

    if (error) {
      throw error
    }

    return (data ?? []) as ClientSummaryTaskRow[]
  },

  async listEvents(clientIds) {
    const { data, error } = await requireSupabaseClient()
      .from('client_events')
      .select('client_id, status, event_date')
      .in('client_id', clientIds)

    if (error) {
      throw error
    }

    return (data ?? []) as ClientSummaryEventRow[]
  },

  async listFiles(clientIds) {
    const { data, error } = await requireSupabaseClient()
      .from('client_files')
      .select('client_id, file_category, drive_folder_path, archived_at')
      .in('client_id', clientIds)

    if (error) {
      throw error
    }

    return (data ?? []) as ClientSummaryFileRow[]
  },

  async listMoneyItems(clientIds) {
    const { data, error } = await requireSupabaseClient()
      .from('client_money_items')
      .select('client_id, status')
      .in('client_id', clientIds)

    if (error) {
      throw error
    }

    return (data ?? []) as ClientSummaryMoneyRow[]
  },

  async listLinks(clientIds) {
    const { data, error } = await requireSupabaseClient()
      .from('client_links')
      .select('client_id, title, url')
      .in('client_id', clientIds)

    if (error) {
      throw error
    }

    return (data ?? []) as ClientSummaryLinkRow[]
  },

  async listLogs(clientIds) {
    const { data, error } = await requireSupabaseClient()
      .from('operation_logs')
      .select('client_id, created_at')
      .in('client_id', clientIds)

    if (error) {
      throw error
    }

    return (data ?? []) as ClientSummaryLogRow[]
  },
}
