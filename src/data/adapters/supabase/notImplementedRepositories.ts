import type { ClientDetailRepository } from '../../repositories/clientDetailRepository'
import type { ClientListRepository } from '../../repositories/clientListRepository'
import type { SmartOperationViewsRepository } from '../../repositories/smartOperationViewsRepository'

const SUPABASE_NOT_IMPLEMENTED_MESSAGE =
  'SALMAN OS Supabase data source is not implemented yet. Use VITE_DATA_SOURCE=mock for the v1 internal MVP.'

function rejectSupabasePlaceholder<T>(): Promise<T> {
  return Promise.reject(new Error(SUPABASE_NOT_IMPLEMENTED_MESSAGE))
}

export const clientListSupabasePlaceholderRepository: ClientListRepository = {
  listClientSummaries() {
    return rejectSupabasePlaceholder()
  },
}

export const clientDetailSupabasePlaceholderRepository: ClientDetailRepository = {
  getClientDetail() {
    return rejectSupabasePlaceholder()
  },
}

export const smartOperationViewsSupabasePlaceholderRepository: SmartOperationViewsRepository = {
  getSmartOperationViews() {
    return rejectSupabasePlaceholder()
  },
}
