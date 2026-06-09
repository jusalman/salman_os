import { clientStatusLabel } from '../../domain/labels'
import type { ClientListView } from '../../types'

type ClientTabsProps = {
  listView: ClientListView
  selectedClientId: string
  onSelect: (clientId: string) => void
}

export function ClientTabs({ listView, selectedClientId, onSelect }: ClientTabsProps) {
  return (
    <section className="client-table-card" aria-label="고객사 목록">
      <div className="client-table" role="table" aria-label="고객사 관리 테이블">
        <div className="client-table-row client-table-head" role="row">
          <span>회사명</span>
          <span>담당자</span>
          <span>상태</span>
          <span>진행 업무</span>
          <span>예정 일정</span>
          <span>비즈머니</span>
          <span>최근 로그</span>
          <span>Action</span>
        </div>

        {listView.items.map((client) => (
          <button
            key={client.id}
            type="button"
            className={
              client.id === selectedClientId
                ? 'client-table-row client-table-item active'
                : 'client-table-row client-table-item'
            }
            role="row"
            onClick={() => onSelect(client.id)}
          >
            <strong className="client-company">{client.name}</strong>
            <span>{client.owner}</span>
            <span className={`status-badge ${client.status}`}>
              {clientStatusLabel[client.status]}
            </span>
            <span>{client.openTaskCount.toLocaleString('ko-KR')}</span>
            <span>{client.upcomingEventCount.toLocaleString('ko-KR')}</span>
            <span className={client.hasBizMoneyWarning ? 'money-cell warning' : 'money-cell'}>
              {client.hasBizMoneyWarning ? '확인 필요' : '정상'}
            </span>
            <span className="latest-log">
              {client.latestLogAt ?? '기록 없음'}
            </span>
            <span className="open-action">열기</span>
          </button>
        ))}
      </div>
    </section>
  )
}
