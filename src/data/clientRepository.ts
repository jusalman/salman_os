import type {
  ClientEvent,
  ClientFile,
  ClientLink,
  ClientMoneyItem,
  ClientRecord,
  ClientTask,
  OperationLog,
} from '../types'
import { clientEventsByClientId } from './mock/clientEvents'
import { clientFilesByClientId } from './mock/clientFiles'
import { clientLinksByClientId } from './mock/clientLinks'
import { clientLogsByClientId } from './mock/clientLogs'
import { clientMoneyItemsByClientId } from './mock/clientMoney'
import { clientRecords } from './mock/clientRecords'
import { clientTasksByClientId } from './mock/clientTasks'

function cloneItems<T>(items: T[]): T[] {
  return items.map((item) => ({ ...item }))
}

export function getClientFiles(clientId: string): ClientFile[] {
  return cloneItems(clientFilesByClientId[clientId] ?? [])
}

export function getClientTasks(clientId: string): ClientTask[] {
  return cloneItems(clientTasksByClientId[clientId] ?? [])
}

export function getClientEvents(clientId: string): ClientEvent[] {
  return cloneItems(clientEventsByClientId[clientId] ?? [])
}

export function getClientMoneyItems(clientId: string): ClientMoneyItem[] {
  return cloneItems(clientMoneyItemsByClientId[clientId] ?? [])
}

export function getClientLinks(clientId: string): ClientLink[] {
  return cloneItems(clientLinksByClientId[clientId] ?? [])
}

export function getClientLogs(clientId: string): OperationLog[] {
  return cloneItems(clientLogsByClientId[clientId] ?? [])
}

export function getClients(): ClientRecord[] {
  return clientRecords.map((client) => ({
    ...client,
    files: getClientFiles(client.id),
    tasks: getClientTasks(client.id),
    events: getClientEvents(client.id),
    moneyItems: getClientMoneyItems(client.id),
    links: getClientLinks(client.id),
    logs: getClientLogs(client.id),
  }))
}

export function getClientById(clientId: string): ClientRecord | undefined {
  return getClients().find((client) => client.id === clientId)
}

export function getInitialClientId(): string {
  return clientRecords[0]?.id ?? ''
}
