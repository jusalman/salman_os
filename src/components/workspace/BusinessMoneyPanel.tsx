import { useMemo, useState } from 'react'
import { formatWon } from '../../domain/businessMoney'
import { moneyStatusLabel } from '../../domain/labels'
import type { ClientMoneyPanelItem, MoneyStatus } from '../../types'
import { Panel } from '../common/Panel'
import { createMockOperationLogNotice } from './operatorRecord'

type BusinessMoneyPanelProps = {
  moneyItems: ClientMoneyPanelItem[]
  currentOperatorName: string
}

export function BusinessMoneyPanel({
  moneyItems,
  currentOperatorName,
}: BusinessMoneyPanelProps) {
  const [selectedMoneyId, setSelectedMoneyId] = useState('')
  const [notice, setNotice] = useState('')
  const sortedMoneyItems = useMemo(
    () => [...moneyItems].sort((a, b) => getMoneyStatusWeight(b.status) - getMoneyStatusWeight(a.status)),
    [moneyItems],
  )
  const selectedMoneyItem =
    sortedMoneyItems.find((item) => item.id === selectedMoneyId) ?? sortedMoneyItems[0] ?? null
  const summary = useMemo(() => buildMoneySummary(sortedMoneyItems), [sortedMoneyItems])

  function handlePreparedAction(actionName: string) {
    setNotice(createMockOperationLogNotice(actionName, currentOperatorName))
  }

  return (
    <Panel title="정산/비즈머니" subtitle="잔액 기준 수동 확인과 알림 설정">
      <div className="money-management">
        <div className="ops-toolbar">
          <div>
            <strong>비즈머니 운영 보드</strong>
            <p>현재 잔액, 최소 알림 금액, 마지막 확인일 기준으로 수동 점검합니다.</p>
          </div>
          <div className="ops-actions">
            <button type="button" onClick={() => handlePreparedAction('잔액 확인')}>
              잔액 확인
            </button>
            <button type="button" onClick={() => handlePreparedAction('알림 금액 변경')}>
              알림 금액 변경
            </button>
            <button type="button" onClick={() => handlePreparedAction('확인 완료')}>
              확인 완료
            </button>
          </div>
        </div>

        <div className="ops-state-strip" aria-label="비즈머니 mock-first 상태">
          <span>mock-first 데이터</span>
          <span>자동 수집 없음</span>
          <span>쓰기 기능 비활성</span>
          <span>저장 예정 위치 client_money_items / operation_logs</span>
        </div>

        {notice ? <p className="ops-prepared-notice">{notice}</p> : null}

        <section className="ops-summary-grid" aria-label="비즈머니 요약">
          <SummaryCard label="현재 잔액" value={formatWon(summary.totalBalance)} tone={summary.tone} />
          <SummaryCard
            label="최소 알림 금액"
            value={formatWon(summary.minimumAlertAmount)}
            tone="neutral"
          />
          <SummaryCard label="상태" value={moneyStatusLabel[summary.status]} tone={summary.tone} />
          <SummaryCard label="마지막 확인일" value={summary.lastCheckedAt ?? '미확인'} tone="neutral" />
        </section>

        {sortedMoneyItems.length === 0 ? (
          <div className="ops-empty">
            <strong>등록된 비즈머니 항목이 없습니다.</strong>
            <p>잔액 확인과 알림 금액 설정은 현재 mock UI로만 준비되어 있습니다.</p>
          </div>
        ) : (
          <div className="money-workbench">
            <section className="ops-list-panel" aria-label="비즈머니 항목 리스트">
              <div className="ops-table-head money-table-head">
                <span>매체/계정명</span>
                <span>현재 잔액</span>
                <span>최소 알림 금액</span>
                <span>상태</span>
                <span>마지막 확인일</span>
                <span>확인 담당자</span>
              </div>

              <div className="ops-row-list">
                {sortedMoneyItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      selectedMoneyItem?.id === item.id
                        ? 'ops-row money-row active'
                        : 'ops-row money-row'
                    }
                    onClick={() => setSelectedMoneyId(item.id)}
                  >
                    <span className="ops-row-title">{item.title}</span>
                    <span>{formatWon(item.currentBalance)}</span>
                    <span>{formatWon(item.minimumAlertAmount)}</span>
                    <span className={`status-badge ${getMoneyStatusClass(item.status)}`}>
                      {moneyStatusLabel[item.status]}
                    </span>
                    <span>{item.lastCheckedAt ?? '미확인'}</span>
                    <span>{item.checkedBy ?? '담당자 없음'}</span>
                  </button>
                ))}
              </div>
            </section>

            <MoneyDetailPanel
              moneyItem={selectedMoneyItem}
              onPreparedAction={handlePreparedAction}
            />
          </div>
        )}
      </div>
    </Panel>
  )
}

function MoneyDetailPanel({
  moneyItem,
  onPreparedAction,
}: {
  moneyItem: ClientMoneyPanelItem | null
  onPreparedAction: (actionName: string) => void
}) {
  if (!moneyItem) {
    return (
      <aside className="ops-detail-panel">
        <div className="ops-empty compact-empty">
          <strong>비즈머니 항목을 선택하면 상세 정보가 표시됩니다.</strong>
          <p>왼쪽 리스트에서 잔액을 확인할 계정을 선택하세요.</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="ops-detail-panel" aria-label="선택한 비즈머니 상세">
      <div className="ops-detail-title">
        <p className="eyebrow">Business Money Detail</p>
        <h4>{moneyItem.title}</h4>
        <span className={`status-badge ${getMoneyStatusClass(moneyItem.status)}`}>
          {moneyStatusLabel[moneyItem.status]}
        </span>
      </div>

      <dl className="ops-detail-grid">
        <div>
          <dt>현재 잔액</dt>
          <dd>{formatWon(moneyItem.currentBalance)}</dd>
        </div>
        <div>
          <dt>최소 알림 금액</dt>
          <dd>{formatWon(moneyItem.minimumAlertAmount)}</dd>
        </div>
        <div>
          <dt>마지막 확인일</dt>
          <dd>{moneyItem.lastCheckedAt ?? '미확인'}</dd>
        </div>
        <div>
          <dt>확인 담당자</dt>
          <dd>{moneyItem.checkedBy ?? '담당자 없음'}</dd>
        </div>
      </dl>

      <div className="drive-source-box">
        <strong>확인 링크</strong>
        <a className="action-link" href={moneyItem.url} target="_blank" rel="noreferrer">
          확인 링크 열기
        </a>
      </div>

      <div className="ops-note-box">
        <strong>메모</strong>
        <p>{moneyItem.note}</p>
      </div>

      <div className="ops-log-placeholder">
        <strong>향후 저장 위치</strong>
        <p>
          잔액과 최소 알림 금액은 client_money_items에서 관리하고, 확인/변경 이력은
          현재 작업자 이름과 함께 operation_logs에 기록할 예정입니다.
        </p>
      </div>

      <div className="ops-detail-actions">
        <button type="button" onClick={() => onPreparedAction('잔액 확인')}>
          잔액 확인
        </button>
        <button type="button" onClick={() => onPreparedAction('알림 금액 변경')}>
          알림 금액 변경
        </button>
        <button type="button" onClick={() => onPreparedAction('확인 완료')}>
          확인 완료
        </button>
      </div>
    </aside>
  )
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'active' | 'danger' | 'neutral' | 'warning'
}) {
  return (
    <article className={`ops-summary-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function buildMoneySummary(moneyItems: ClientMoneyPanelItem[]) {
  const totalBalance = sumKnownBalances(moneyItems)
  const minimumAlertAmount = moneyItems.reduce(
    (total, item) => total + item.minimumAlertAmount,
    0,
  )
  const status = moneyItems.reduce<MoneyStatus>(
    (currentStatus, item) =>
      getMoneyStatusWeight(item.status) > getMoneyStatusWeight(currentStatus)
        ? item.status
        : currentStatus,
    'checked',
  )
  const lastCheckedAt =
    moneyItems
      .map((item) => item.lastCheckedAt)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1) ?? null

  return {
    totalBalance,
    minimumAlertAmount,
    status,
    lastCheckedAt,
    tone: getMoneySummaryTone(status),
  }
}

function sumKnownBalances(moneyItems: ClientMoneyPanelItem[]) {
  const knownBalances = moneyItems
    .map((item) => item.currentBalance)
    .filter((value): value is number => typeof value === 'number')

  if (knownBalances.length === 0) {
    return null
  }

  return knownBalances.reduce((total, value) => total + value, 0)
}

function getMoneyStatusWeight(status: MoneyStatus) {
  if (status === 'issue') {
    return 3
  }

  if (status === 'unknown') {
    return 2
  }

  if (status === 'check_needed') {
    return 1
  }

  return 0
}

function getMoneyStatusClass(status: MoneyStatus) {
  if (status === 'unknown') {
    return 'missing_data'
  }

  return status
}

function getMoneySummaryTone(
  status: MoneyStatus,
): 'active' | 'danger' | 'neutral' | 'warning' {
  if (status === 'issue' || status === 'unknown') {
    return 'danger'
  }

  if (status === 'check_needed') {
    return 'warning'
  }

  return 'active'
}
