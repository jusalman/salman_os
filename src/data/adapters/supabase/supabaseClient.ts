import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const missingConfigMessage =
  'SALMAN OS Supabase client is missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.'

let supabaseClient: SupabaseClient | null = null

function readFrontendEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  return import.meta.env[name]?.trim() ?? ''
}

export function hasSupabaseBrowserConfig(): boolean {
  return (
    readFrontendEnv('VITE_SUPABASE_URL').length > 0 &&
    readFrontendEnv('VITE_SUPABASE_ANON_KEY').length > 0
  )
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!hasSupabaseBrowserConfig()) {
    return null
  }

  supabaseClient ??= createClient(
    readFrontendEnv('VITE_SUPABASE_URL'),
    readFrontendEnv('VITE_SUPABASE_ANON_KEY'),
  )

  return supabaseClient
}

export function requireSupabaseClient(): SupabaseClient {
  const client = getSupabaseClient()

  if (!client) {
    throw new Error(missingConfigMessage)
  }

  return client
}
