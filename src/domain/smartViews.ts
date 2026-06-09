import { TODAY } from '../config/constants.ts'
import {
  formatWon,
  isBusinessMoneyAlertStatus,
  resolveBusinessMoneyStatus,
} from './businessMoney.ts'
import { moneyStatusLabel } from './labels.ts'
import type { ClientRecord, MoneyStatus, SmartViewItem } from '../types'

export type BusinessMoneyAlertItem = SmartViewItem & {
  clientId: string
  currentBalance: number | null
  minimumAlertAmount: number
  status: MoneyStatus
  lastCheckedAt: string | null
  checkedBy: string | null
  url: string
  note: string
}

export type SmartViews = {
  todaysItems: SmartViewItem[]
  priorityTasks: SmartViewItem[]
  moneyAlerts: BusinessMoneyAlertItem[]
  recentArchive: SmartViewItem[]
}

export function buildSmartViews(clients: ClientRecord[]): SmartViews {
  return {
    todaysItems: clients.flatMap((client) =>
      client.events
        .filter((event) => event.eventDate === TODAY && event.status === 'scheduled')
        .map((event) => ({
          clientName: client.name,
          title: event.title,
          meta: `${event.startTime}-${event.endTime}`,
        })),
    ),
    priorityTasks: clients.flatMap((client) =>
      client.tasks
        .filter((task) => task.status === 'blocked' || task.priority === 'high')
        .map((task) => ({
          clientName: client.name,
          title: task.title,
          meta: task.dueDate,
        })),
    ),
    moneyAlerts: clients.flatMap((client) =>
      client.moneyItems
        .map((item) => ({
          item,
          status: resolveBusinessMoneyStatus(item),
        }))
        .filter(({ status }) => isBusinessMoneyAlertStatus(status))
        .map((item) => ({
          clientName: client.name,
          clientId: client.id,
          title: item.item.title,
          meta: `${moneyStatusLabel[item.status]} · ${formatWon(item.item.currentBalance)} / ${formatWon(item.item.minimumAlertAmount)}`,
          currentBalance: item.item.currentBalance ?? null,
          minimumAlertAmount: item.item.minimumAlertAmount,
          status: item.status,
          lastCheckedAt: item.item.lastCheckedAt,
          checkedBy: item.item.checkedBy,
          url: item.item.url,
          note: item.item.note,
        })),
    ),
    recentArchive: clients.flatMap((client) =>
      client.files
        .filter((file) => file.status === 'archived')
        .map((file) => ({
          clientName: client.name,
          title: file.name,
          meta: file.folderPath,
        })),
    ),
  }
}
