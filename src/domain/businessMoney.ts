import { TODAY } from '../config/constants.ts'
import type { ClientMoneyItem, MoneyStatus } from '../types'

type BusinessMoneyStatusInput = Pick<
  ClientMoneyItem,
  'currentBalance' | 'lastCheckedAt' | 'minimumAlertAmount'
>

const STALE_CHECK_DAYS = 3

export function resolveBusinessMoneyStatus(
  item: BusinessMoneyStatusInput,
  referenceDate = TODAY,
): MoneyStatus {
  if (item.currentBalance === null || item.currentBalance === undefined) {
    return 'unknown'
  }

  if (!item.lastCheckedAt || isStaleCheckDate(item.lastCheckedAt, referenceDate)) {
    return 'unknown'
  }

  if (item.currentBalance <= 0 || isCriticalBalance(item.currentBalance, item.minimumAlertAmount)) {
    return 'issue'
  }

  if (item.currentBalance <= item.minimumAlertAmount) {
    return 'check_needed'
  }

  return 'checked'
}

export function isBusinessMoneyAlertStatus(status: MoneyStatus) {
  return status !== 'checked'
}

export function formatWon(amount: number | null | undefined) {
  if (amount === null || amount === undefined) {
    return '잔액 미확인'
  }

  return `${amount.toLocaleString('ko-KR')}원`
}

function isCriticalBalance(currentBalance: number, minimumAlertAmount: number) {
  const criticalAmount = Math.max(Math.floor(minimumAlertAmount * 0.2), 10000)

  return currentBalance <= criticalAmount
}

function isStaleCheckDate(lastCheckedAt: string, referenceDate: string) {
  const lastCheckedDate = toUtcDate(lastCheckedAt)
  const reference = toUtcDate(referenceDate)
  const daysSinceLastCheck =
    (reference.getTime() - lastCheckedDate.getTime()) / (1000 * 60 * 60 * 24)

  return daysSinceLastCheck > STALE_CHECK_DAYS
}

function toUtcDate(value: string) {
  const [year = '0', month = '1', day = '1'] = value.slice(0, 10).split('-')

  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
}
