import { TODAY } from '../config/constants'
import { moneyStatusLabel } from './labels'
import type { ClientRecord, SmartViewItem } from '../types'

export type SmartViews = {
  todaysItems: SmartViewItem[]
  priorityTasks: SmartViewItem[]
  moneyAlerts: SmartViewItem[]
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
        .filter((item) => item.status !== 'checked')
        .map((item) => ({
          clientName: client.name,
          title: item.title,
          meta: moneyStatusLabel[item.status],
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
