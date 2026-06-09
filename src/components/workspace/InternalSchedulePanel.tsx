import { useMemo, useState } from 'react'
import { TODAY } from '../../config/constants'
import { eventStatusLabel } from '../../domain/labels'
import type { ClientSchedulePanelItem } from '../../types'
import { Panel } from '../common/Panel'
import { createMockOperationLogNotice } from './operatorRecord'

type InternalSchedulePanelProps = {
  scheduleItems: ClientSchedulePanelItem[]
  clientName: string
  currentOperatorName: string
}

export function InternalSchedulePanel({
  scheduleItems,
  clientName,
  currentOperatorName,
}: InternalSchedulePanelProps) {
  const [selectedEventId, setSelectedEventId] = useState('')
  const [notice, setNotice] = useState('')
  const selectedEvent =
    scheduleItems.find((event) => event.id === selectedEventId) ?? scheduleItems[0] ?? null
  const summary = useMemo(
    () => ({
      today: scheduleItems.filter(
        (event) => event.eventDate === TODAY && event.status === 'scheduled',
      ).length,
      upcoming: scheduleItems.filter(
        (event) => event.eventDate >= TODAY && event.status === 'scheduled',
      ).length,
      done: scheduleItems.filter((event) => event.status === 'done').length,
      canceled: scheduleItems.filter((event) => event.status === 'canceled').length,
    }),
    [scheduleItems],
  )

  function handlePreparedAction(actionName: string) {
    setNotice(createMockOperationLogNotice(actionName, currentOperatorName))
  }

  return (
    <Panel title="일정" subtitle="SALMAN OS에 기록된 고객사 내부 일정">
      <div className="ops-management">
        <div className="ops-toolbar">
          <div>
            <strong>일정 운영 보드</strong>
            <p>날짜, 시간, 담당자, 상태 기준으로 고객사 일정을 확인합니다.</p>
          </div>
          <div className="ops-actions">
            <button type="button" onClick={() => handlePreparedAction('일정 추가')}>
              일정 추가
            </button>
            <button type="button" onClick={() => handlePreparedAction('완료 처리')}>
              완료 처리
            </button>
            <button type="button" onClick={() => handlePreparedAction('일정 변경')}>
              일정 변경
            </button>
          </div>
        </div>

        <div className="ops-state-strip" aria-label="일정 mock-first 상태">
          <span>Supabase 내부 일정 기준</span>
          <span>쓰기 기능 비활성</span>
          <span>현재 작업자 {currentOperatorName}</span>
          <span>Google Calendar 연동 없음</span>
        </div>

        {notice ? <p className="ops-prepared-notice">{notice}</p> : null}

        <section className="ops-summary-grid" aria-label="일정 요약">
          <SummaryCard label="오늘 일정" value={summary.today} tone="neutral" />
          <SummaryCard label="예정 일정" value={summary.upcoming} tone="active" />
          <SummaryCard label="완료 일정" value={summary.done} tone="done" />
          <SummaryCard label="취소/보류" value={summary.canceled} tone="danger" />
        </section>

        {scheduleItems.length === 0 ? (
          <div className="ops-empty">
            <strong>등록된 일정이 없습니다.</strong>
            <p>
              일정 추가는 현재 mock UI로만 준비되어 있으며, 실제 저장 단계에서
              operation_logs에 작업자 이름과 함께 기록됩니다.
            </p>
          </div>
        ) : (
          <div className="ops-workbench">
            <section className="ops-list-panel" aria-label="일정 리스트">
              <div className="ops-table-head schedule-table-head">
                <span>일정명</span>
                <span>날짜</span>
                <span>시간</span>
                <span>담당자</span>
                <span>상태</span>
                <span>관련 업무</span>
                <span>메모</span>
              </div>

              <div className="ops-row-list">
                {scheduleItems.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className={
                      selectedEvent?.id === event.id
                        ? 'ops-row schedule-row active'
                        : 'ops-row schedule-row'
                    }
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    <span className="ops-row-title">{event.title}</span>
                    <span>{event.eventDate}</span>
                    <span>{event.timeRange}</span>
                    <span>{event.owner}</span>
                    <span className={`status-badge ${event.status}`}>
                      {eventStatusLabel[event.status]}
                    </span>
                    <span>관련 업무 준비</span>
                    <span className="ops-row-note">{event.note}</span>
                  </button>
                ))}
              </div>
            </section>

            <ScheduleDetailPanel
              event={selectedEvent}
              clientName={clientName}
              onPreparedAction={handlePreparedAction}
            />
          </div>
        )}
      </div>
    </Panel>
  )
}

function ScheduleDetailPanel({
  event,
  clientName,
  onPreparedAction,
}: {
  event: ClientSchedulePanelItem | null
  clientName: string
  onPreparedAction: (actionName: string) => void
}) {
  if (!event) {
    return (
      <aside className="ops-detail-panel">
        <div className="ops-empty compact-empty">
          <strong>일정을 선택하면 상세 정보가 표시됩니다.</strong>
          <p>왼쪽 일정 리스트에서 확인할 항목을 선택하세요.</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="ops-detail-panel" aria-label="선택한 일정 상세">
      <div className="ops-detail-title">
        <p className="eyebrow">Schedule Detail</p>
        <h4>{event.title}</h4>
        <span className={`status-badge ${event.status}`}>{eventStatusLabel[event.status]}</span>
      </div>

      <dl className="ops-detail-grid">
        <div>
          <dt>날짜</dt>
          <dd>{event.eventDate}</dd>
        </div>
        <div>
          <dt>시간</dt>
          <dd>{event.timeRange}</dd>
        </div>
        <div>
          <dt>담당자</dt>
          <dd>{event.owner}</dd>
        </div>
        <div>
          <dt>연결 고객사</dt>
          <dd>{clientName}</dd>
        </div>
        <div>
          <dt>관련 업무</dt>
          <dd>관련 업무 연결은 mock 준비 상태입니다.</dd>
        </div>
      </dl>

      <div className="ops-note-box">
        <strong>메모</strong>
        <p>{event.note}</p>
      </div>

      <div className="ops-detail-actions">
        <button type="button" onClick={() => onPreparedAction('완료 처리')}>
          완료 처리
        </button>
        <button type="button" onClick={() => onPreparedAction('일정 변경')}>
          일정 변경
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
  value: number
  tone: 'active' | 'danger' | 'done' | 'neutral'
}) {
  return (
    <article className={`ops-summary-card ${tone}`}>
      <span>{label}</span>
      <strong>{value.toLocaleString('ko-KR')}</strong>
    </article>
  )
}
