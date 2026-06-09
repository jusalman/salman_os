import { useMemo, useState } from 'react'
import { TODAY } from '../../config/constants'
import type { ClientLogPanelItem } from '../../types'
import { Panel } from '../common/Panel'
import { resolveCurrentOperatorName } from './operatorRecord'

type OperationLogsPanelProps = {
  logs: ClientLogPanelItem[]
  currentOperatorName: string
}

const logStatusLabel: Record<ClientLogPanelItem['status'], string> = {
  recorded: '기록됨',
  check_needed: '확인 필요',
  archived: '보관',
}

export function OperationLogsPanel({
  logs,
  currentOperatorName,
}: OperationLogsPanelProps) {
  const [selectedLogId, setSelectedLogId] = useState('')
  const currentOperator = resolveCurrentOperatorName(currentOperatorName)
  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [logs],
  )
  const selectedLog = sortedLogs.find((log) => log.id === selectedLogId) ?? null
  const summary = useMemo(
    () => ({
      total: logs.length,
      today: logs.filter((log) => log.createdAt.startsWith(TODAY)).length,
      actors: new Set(logs.map((log) => log.actor)).size,
      attention: logs.filter((log) => log.status === 'check_needed').length,
    }),
    [logs],
  )

  return (
    <Panel title="로그" subtitle="작업자 기준 고객사 운영 기록">
      <div className="logs-management">
        <div className="ops-toolbar">
          <div>
            <strong>운영 로그 보드</strong>
            <p>고객사별 작업 기록, 수정 이력, 향후 챗봇 대화 로그의 기준 화면입니다.</p>
          </div>
          <div className="current-operator-card" aria-label="현재 작업자">
            <strong>현재 작업자: {currentOperator}</strong>
            <span>이 이름은 작업 기록, 수정 이력, 향후 챗봇 대화 로그에 표시됩니다.</span>
          </div>
        </div>

        <div className="ops-state-strip" aria-label="로그 mock-first 상태">
          <span>mock-first 로그</span>
          <span>쓰기 기능 비활성</span>
          <span>저장 예정 위치 operation_logs</span>
        </div>

        <p className="ops-prepared-notice">
          이 탭은 현재 mock 운영 로그를 표시합니다. 실제 저장은 아직 없으며 후속 저장
          단계에서 현재 작업자 이름과 함께 operation_logs에 기록됩니다.
        </p>

        <section className="ops-summary-grid" aria-label="로그 요약">
          <SummaryCard label="전체 로그" value={summary.total} tone="neutral" />
          <SummaryCard label="오늘 기록" value={summary.today} tone="active" />
          <SummaryCard label="작업자 수" value={summary.actors} tone="neutral" />
          <SummaryCard label="확인 필요" value={summary.attention} tone="danger" />
        </section>

        {sortedLogs.length === 0 ? (
          <div className="ops-empty">
            <strong>등록된 운영 로그가 없습니다.</strong>
            <p>후속 저장 단계에서 작업자 기록이 operation_logs에 쌓이면 이곳에 표시됩니다.</p>
          </div>
        ) : (
          <div className="log-workbench">
            <section className="ops-list-panel log-list-panel" aria-label="운영 로그 리스트">
              <div className="ops-table-head log-table-head">
                <span>시간</span>
                <span>작업자</span>
                <span>유형</span>
                <span>대상</span>
                <span>내용</span>
                <span>상태</span>
              </div>

              <div className="ops-row-list">
                {sortedLogs.map((log) => (
                  <button
                    key={log.id}
                    type="button"
                    className={selectedLog?.id === log.id ? 'ops-row log-row active' : 'ops-row log-row'}
                    onClick={() => setSelectedLogId(log.id)}
                  >
                    <span>{log.createdAt}</span>
                    <span>{log.actor}</span>
                    <span className="log-action-pill">{log.action}</span>
                    <span>{log.target}</span>
                    <span className="ops-row-note">{log.message}</span>
                    <span className={`status-badge ${getLogStatusClass(log.status)}`}>
                      {logStatusLabel[log.status]}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <LogDetailPanel log={selectedLog} />
          </div>
        )}
      </div>
    </Panel>
  )
}

function LogDetailPanel({ log }: { log: ClientLogPanelItem | null }) {
  if (!log) {
    return (
      <aside className="ops-detail-panel">
        <div className="ops-empty compact-empty">
          <strong>로그를 선택하면 상세 정보가 표시됩니다.</strong>
          <p>왼쪽 운영 로그 리스트에서 확인할 기록을 선택하세요.</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="ops-detail-panel log-detail-panel" aria-label="선택한 로그 상세">
      <div className="ops-detail-title">
        <p className="eyebrow">Log Detail</p>
        <h4>{`${log.action} · ${log.target}`}</h4>
        <div className="ops-detail-badges">
          <span className={`status-badge ${getLogStatusClass(log.status)}`}>
            {logStatusLabel[log.status]}
          </span>
          <span className="log-action-pill">{log.action}</span>
        </div>
      </div>

      <dl className="ops-detail-grid log-detail-grid">
        <div>
          <dt>작업자</dt>
          <dd>{log.actor}</dd>
        </div>
        <div>
          <dt>발생 시간</dt>
          <dd>{log.createdAt}</dd>
        </div>
        <div>
          <dt>액션 유형</dt>
          <dd>{log.action}</dd>
        </div>
        <div>
          <dt>대상</dt>
          <dd>{log.target}</dd>
        </div>
        <div>
          <dt>연결된 업무</dt>
          <dd>{log.relatedTaskTitle}</dd>
        </div>
        <div>
          <dt>연결된 파일</dt>
          <dd>{log.relatedFileName}</dd>
        </div>
        <div>
          <dt>연결된 일정</dt>
          <dd>{log.relatedScheduleTitle}</dd>
        </div>
        <div>
          <dt>저장 위치</dt>
          <dd>operation_logs</dd>
        </div>
      </dl>

      <div className="ops-note-box">
        <strong>내용</strong>
        <p>{log.message}</p>
      </div>

      <div className="ops-log-placeholder">
        <strong>메모</strong>
        <p>{log.note}</p>
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
  value: number
  tone: 'active' | 'danger' | 'neutral'
}) {
  return (
    <article className={`ops-summary-card ${tone}`}>
      <span>{label}</span>
      <strong>{value.toLocaleString('ko-KR')}</strong>
    </article>
  )
}

function getLogStatusClass(status: ClientLogPanelItem['status']) {
  if (status === 'recorded') {
    return 'info'
  }

  return status
}
