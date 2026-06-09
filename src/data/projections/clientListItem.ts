import type { ClientListItem, ClientSummary } from '../../types'

export function projectClientListItem(summary: ClientSummary): ClientListItem {
  return {
    id: summary.id,
    name: summary.name,
    status: summary.status,
    owner: summary.owner,
    openTaskCount: summary.openTaskCount,
    upcomingEventCount: summary.upcomingEventCount,
    hasBizMoneyWarning: summary.hasBizMoneyWarning,
    latestLogAt: summary.latestLogAt,
    hasDriveFolder: summary.hasDriveFolder,
    hasLookerLink: summary.hasLookerLink,
    hasSheetLink: summary.hasSheetLink,
  }
}
