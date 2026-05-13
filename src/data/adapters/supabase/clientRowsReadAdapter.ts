import { requireSupabaseClient } from './supabaseClient'

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
