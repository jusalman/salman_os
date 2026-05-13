export {
  getSupabaseClient,
  hasSupabaseBrowserConfig,
  requireSupabaseClient,
} from './supabaseClient'
export { listClientRows } from './clientRowsReadAdapter'
export type { ClientRow } from './clientRowsReadAdapter'
export { assembleClientSummaryFromRows } from './clientSummaryAssembler'
export type {
  ClientSummaryAssemblyInput,
  ClientSummaryClientRow,
  ClientSummaryEventRow,
  ClientSummaryFileRow,
  ClientSummaryLinkRow,
  ClientSummaryLogRow,
  ClientSummaryMemberRow,
  ClientSummaryMoneyRow,
  ClientSummaryTaskRow,
} from './clientSummaryAssembler'
export {
  hasBizMoneyWarningFromDb,
  isOpenTaskStatusForSummary,
  isScheduledEventStatusForSummary,
  isUpcomingScheduledEventForSummary,
  mapClientLinkCategoryFromDb,
  mapClientStatusFromDb,
  mapEventStatusFromDb,
  mapFileStatusFromDb,
  mapLogActionFromDb,
  mapMoneyStatusFromDb,
  mapTaskPriorityFromDb,
  mapTaskStatusFromDb,
  shouldIncludeEventRow,
} from './mappers'
export type {
  DbClientStatus,
  DbEventStatus,
  DbFileCategory,
  DbLogActionType,
  DbMoneyStatus,
  DbTaskPriority,
  DbTaskStatus,
} from './mappers'
export {
  clientDetailSupabasePlaceholderRepository,
  clientListSupabasePlaceholderRepository,
  smartOperationViewsSupabasePlaceholderRepository,
} from './notImplementedRepositories'
