import { useMemo, useState } from 'react'
import { taskPriorityLabel, taskStatusLabel } from '../../domain/labels'
import type { ClientTaskPanelItem } from '../../types'
import { Panel } from '../common/Panel'
import { createMockOperationLogNotice } from './operatorRecord'

type TasksPanelProps = {
  tasks: ClientTaskPanelItem[]
  currentOperatorName: string
}

export function TasksPanel({ tasks, currentOperatorName }: TasksPanelProps) {
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [notice, setNotice] = useState('')
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? tasks[0] ?? null
  const summary = useMemo(
    () => ({
      total: tasks.length,
      doing: tasks.filter((task) => task.status === 'doing').length,
      blocked: tasks.filter((task) => task.status === 'blocked').length,
      done: tasks.filter((task) => task.status === 'done').length,
    }),
    [tasks],
  )

  function handlePreparedAction(actionName: string) {
    setNotice(createMockOperationLogNotice(actionName, currentOperatorName))
  }

  return (
    <Panel title="업무" subtitle="고객사별 진행 업무와 우선순위">
      <div className="ops-management">
        <div className="ops-toolbar">
          <div>
            <strong>업무 운영 보드</strong>
            <p>상태, 우선순위, 담당자, 마감일 기준으로 고객사 업무를 확인합니다.</p>
          </div>
          <div className="ops-actions">
            <button type="button" onClick={() => handlePreparedAction('업무 추가')}>
              업무 추가
            </button>
            <button type="button" onClick={() => handlePreparedAction('상태 변경')}>
              상태 변경
            </button>
            <button type="button" onClick={() => handlePreparedAction('완료 처리')}>
              완료 처리
            </button>
          </div>
        </div>

        <div className="ops-state-strip" aria-label="업무 mock-first 상태">
          <span>mock-first 데이터</span>
          <span>쓰기 기능 비활성</span>
          <span>현재 작업자 {currentOperatorName}</span>
          <span>로딩 완료 후 표시</span>
        </div>

        {notice ? <p className="ops-prepared-notice">{notice}</p> : null}

        <section className="ops-summary-grid" aria-label="업무 요약">
          <SummaryCard label="전체 업무" value={summary.total} tone="neutral" />
          <SummaryCard label="진행 중" value={summary.doing} tone="active" />
          <SummaryCard label="막힘" value={summary.blocked} tone="danger" />
          <SummaryCard label="완료" value={summary.done} tone="done" />
        </section>

        {tasks.length === 0 ? (
          <div className="ops-empty">
            <strong>등록된 업무가 없습니다.</strong>
            <p>
              업무 추가는 현재 mock UI로만 준비되어 있으며, 실제 저장 단계에서
              operation_logs에 작업자 이름과 함께 기록됩니다.
            </p>
          </div>
        ) : (
          <div className="ops-workbench">
            <section className="ops-list-panel" aria-label="업무 리스트">
              <div className="ops-table-head task-table-head">
                <span>업무명</span>
                <span>상태</span>
                <span>우선순위</span>
                <span>담당자</span>
                <span>마감일</span>
                <span>자료</span>
                <span>최근 업데이트</span>
              </div>

              <div className="ops-row-list">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    className={selectedTask?.id === task.id ? 'ops-row task-row active' : 'ops-row task-row'}
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <span className="ops-row-title">{task.title}</span>
                    <span className={`status-badge ${task.status}`}>{taskStatusLabel[task.status]}</span>
                    <span className={`priority-badge ${task.priority}`}>
                      {taskPriorityLabel[task.priority]}
                    </span>
                    <span>{task.assignee}</span>
                    <span>{task.dueDate}</span>
                    <span className={task.relatedFileId ? 'related-file-pill attached' : 'related-file-pill'}>
                      {task.relatedFileId ? '연결됨' : '없음'}
                    </span>
                    <span>{getTaskUpdatedLabel(task)}</span>
                  </button>
                ))}
              </div>
            </section>

            <TaskDetailPanel task={selectedTask} onPreparedAction={handlePreparedAction} />
          </div>
        )}
      </div>
    </Panel>
  )
}

function TaskDetailPanel({
  task,
  onPreparedAction,
}: {
  task: ClientTaskPanelItem | null
  onPreparedAction: (actionName: string) => void
}) {
  if (!task) {
    return (
      <aside className="ops-detail-panel">
        <div className="ops-empty compact-empty">
          <strong>업무를 선택하면 상세 정보가 표시됩니다.</strong>
          <p>왼쪽 업무 리스트에서 확인할 항목을 선택하세요.</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="ops-detail-panel" aria-label="선택한 업무 상세">
      <div className="ops-detail-title">
        <p className="eyebrow">Task Detail</p>
        <h4>{task.title}</h4>
        <div className="ops-detail-badges">
          <span className={`status-badge ${task.status}`}>{taskStatusLabel[task.status]}</span>
          <span className={`priority-badge ${task.priority}`}>
            {taskPriorityLabel[task.priority]}
          </span>
        </div>
      </div>

      <dl className="ops-detail-grid">
        <div>
          <dt>담당자</dt>
          <dd>{task.assignee}</dd>
        </div>
        <div>
          <dt>마감일</dt>
          <dd>{task.dueDate}</dd>
        </div>
        <div>
          <dt>연결된 자료</dt>
          <dd>{task.relatedFileId ? `자료 ID ${task.relatedFileId}` : '연결 자료 없음'}</dd>
        </div>
        <div>
          <dt>최근 업데이트</dt>
          <dd>{getTaskUpdatedLabel(task)}</dd>
        </div>
      </dl>

      <div className="ops-note-box">
        <strong>메모</strong>
        <p>{task.note}</p>
      </div>

      <div className="ops-log-placeholder">
        <strong>작업 로그</strong>
        <p>
          작업 수정 이력과 담당자 변경 로그는 후속 승인 작업에서 현재 작업자 이름과
          함께 operation_logs에 연결할 mock 준비 영역입니다.
        </p>
      </div>

      <div className="ops-detail-actions">
        <button type="button" onClick={() => onPreparedAction('상태 변경')}>
          상태 변경
        </button>
        <button type="button" onClick={() => onPreparedAction('완료 처리')}>
          완료 처리
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

function getTaskUpdatedLabel(task: ClientTaskPanelItem) {
  if (task.status === 'done') {
    return `${task.dueDate} 완료`
  }

  if (task.status === 'archived') {
    return `${task.dueDate} 보관`
  }

  return 'mock 기록 준비'
}
